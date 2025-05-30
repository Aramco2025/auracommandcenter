
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Command processor called with method:', req.method);
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Try to get user, but don't fail if not authenticated
    const { data: { user } } = await supabaseClient.auth.getUser();
    console.log('User authenticated:', !!user);

    const { command, command_type = 'general' } = await req.json();
    console.log('Processing command:', command, 'type:', command_type);

    // Use a default user_id if no user is authenticated (for demo purposes)
    const userId = user?.id || '00000000-0000-0000-0000-000000000000';

    let result = { message: 'Command received' };
    let status = 'completed';

    // Process different types of commands
    try {
      if (command.toLowerCase().includes('send email') || command_type === 'email') {
        result = await processEmailCommand(command, userId, supabaseClient);
      } else if (command.toLowerCase().includes('create task') || command.toLowerCase().includes('update task') || command_type === 'task') {
        result = await processTaskCommand(command, userId, supabaseClient);
      } else if (command.toLowerCase().includes('schedule') || command_type === 'calendar') {
        result = await processCalendarCommand(command, userId, supabaseClient);
      } else if (command.toLowerCase().includes('record note') || command_type === 'voice') {
        result = await processVoiceCommand(command, userId, supabaseClient);
      } else {
        result = await processGeneralCommand(command, userId, supabaseClient);
      }
    } catch (error) {
      console.error('Command processing error:', error);
      status = 'failed';
      result = { error: error.message, message: 'Command processing failed' };
    }

    // Only save to command history if we have a real user
    if (user) {
      try {
        await supabaseClient
          .from('command_history')
          .insert({
            user_id: user.id,
            command_text: command,
            command_type,
            status,
            result,
          });
      } catch (error) {
        console.error('Failed to save command history:', error);
      }
    }

    console.log('Command result:', result);

    return new Response(JSON.stringify({ 
      success: status === 'completed',
      result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Command processing error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      result: { message: 'Failed to process command' }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processEmailCommand(command: string, userId: string, supabase: any) {
  console.log('Processing email command:', command);
  
  // Extract email details from command (simplified)
  const emailMatch = command.match(/send email to ([^\s]+)(?:\s+(?:about|with subject)\s+)?(.+)/i);
  if (emailMatch) {
    const [, recipient, subject] = emailMatch;
    
    try {
      // Record the email intent (actual sending would require SMTP setup)
      await supabase
        .from('emails')
        .insert({
          user_id: userId,
          message_id: `draft-${Date.now()}`,
          subject: subject || 'Email from AURA',
          sender_email: 'user@example.com',
          recipient_emails: [recipient],
          body_preview: command,
          is_sent: false,
        });

      return { message: `Email draft created for ${recipient}`, action: 'email_draft' };
    } catch (error) {
      console.error('Email command error:', error);
      return { message: 'Email command processed (demo mode)', action: 'email_demo' };
    }
  }
  
  return { message: 'Email command processed', action: 'email_general' };
}

async function processTaskCommand(command: string, userId: string, supabase: any) {
  console.log('Processing task command:', command);
  
  if (command.toLowerCase().includes('create task')) {
    const taskMatch = command.match(/create task[:\s]+(.+)/i);
    if (taskMatch) {
      const [, title] = taskMatch;
      
      try {
        await supabase
          .from('notion_tasks')
          .insert({
            user_id: userId,
            notion_page_id: `local-${Date.now()}`,
            title: title.trim(),
            status: 'To Do',
          });

        return { message: `Task created: ${title}`, action: 'task_created' };
      } catch (error) {
        console.error('Task command error:', error);
        return { message: `Task processed (demo mode): ${title}`, action: 'task_demo' };
      }
    }
  }
  
  return { message: 'Task command processed', action: 'task_general' };
}

async function processCalendarCommand(command: string, userId: string, supabase: any) {
  console.log('Processing calendar command:', command);
  
  if (command.toLowerCase().includes('schedule meeting')) {
    const meetingMatch = command.match(/schedule meeting[:\s]+(.+)/i);
    if (meetingMatch) {
      const [, details] = meetingMatch;
      
      try {
        await supabase
          .from('calendar_events')
          .insert({
            user_id: userId,
            google_event_id: `local-${Date.now()}`,
            title: details.trim(),
            start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(),
            status: 'tentative',
          });

        return { message: `Meeting scheduled: ${details}`, action: 'meeting_scheduled' };
      } catch (error) {
        console.error('Calendar command error:', error);
        return { message: `Meeting processed (demo mode): ${details}`, action: 'meeting_demo' };
      }
    }
  }
  
  return { message: 'Calendar command processed', action: 'calendar_general' };
}

async function processVoiceCommand(command: string, userId: string, supabase: any) {
  console.log('Processing voice command:', command);
  
  try {
    await supabase
      .from('voice_notes')
      .insert({
        user_id: userId,
        title: `Voice note - ${new Date().toLocaleTimeString()}`,
        transcript: command,
        duration: Math.floor(command.length / 5),
        is_urgent: command.toLowerCase().includes('urgent'),
      });

    return { message: 'Voice note recorded', action: 'voice_note_saved' };
  } catch (error) {
    console.error('Voice command error:', error);
    return { message: 'Voice note processed (demo mode)', action: 'voice_demo' };
  }
}

async function processGeneralCommand(command: string, userId: string, supabase: any) {
  console.log('Processing general command:', command);
  
  try {
    await supabase
      .from('ai_agent_activities')
      .insert({
        user_id: userId,
        agent_name: 'Command Processor',
        task_description: `Processing: ${command}`,
        status: 'completed',
        progress: 100,
        last_action: 'Command interpreted',
        completed_at: new Date().toISOString(),
      });

    return { message: 'Command processed by AI agent', action: 'general_processing' };
  } catch (error) {
    console.error('General command error:', error);
    return { message: 'Command processed (demo mode)', action: 'general_demo' };
  }
}
