
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    const { command, command_type = 'general' } = await req.json();

    // Save command to history
    const { data: commandRecord } = await supabaseClient
      .from('command_history')
      .insert({
        user_id: user.id,
        command_text: command,
        command_type,
        status: 'processing',
      })
      .select()
      .single();

    let result = { message: 'Command received' };
    let status = 'completed';

    // Process different types of commands
    try {
      if (command.toLowerCase().includes('send email') || command_type === 'email') {
        result = await processEmailCommand(command, user.id, supabaseClient);
      } else if (command.toLowerCase().includes('update task') || command_type === 'task') {
        result = await processTaskCommand(command, user.id, supabaseClient);
      } else if (command.toLowerCase().includes('schedule') || command_type === 'calendar') {
        result = await processCalendarCommand(command, user.id, supabaseClient);
      } else if (command.toLowerCase().includes('record note') || command_type === 'voice') {
        result = await processVoiceCommand(command, user.id, supabaseClient);
      } else {
        result = await processGeneralCommand(command, user.id, supabaseClient);
      }
    } catch (error) {
      status = 'failed';
      result = { error: error.message };
    }

    // Update command status
    await supabaseClient
      .from('command_history')
      .update({
        status,
        result,
      })
      .eq('id', commandRecord.id);

    return new Response(JSON.stringify({ 
      success: status === 'completed',
      result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Command processing error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processEmailCommand(command: string, userId: string, supabase: any) {
  // Extract email details from command (simplified)
  const emailMatch = command.match(/send email to ([^\s]+) (.+)/i);
  if (emailMatch) {
    const [, recipient, subject] = emailMatch;
    
    // Record the email intent (actual sending would require SMTP setup)
    await supabase
      .from('emails')
      .insert({
        user_id: userId,
        message_id: `draft-${Date.now()}`,
        subject: subject,
        sender_email: 'user@example.com', // Would get from user profile
        recipient_emails: [recipient],
        body_preview: command,
        is_sent: false,
      });

    return { message: `Email draft created for ${recipient}`, action: 'email_draft' };
  }
  
  return { message: 'Email command processed', action: 'email_general' };
}

async function processTaskCommand(command: string, userId: string, supabase: any) {
  // Extract task details from command
  if (command.toLowerCase().includes('create task')) {
    const taskMatch = command.match(/create task[:\s]+(.+)/i);
    if (taskMatch) {
      const [, title] = taskMatch;
      
      await supabase
        .from('notion_tasks')
        .insert({
          user_id: userId,
          notion_page_id: `local-${Date.now()}`,
          title: title.trim(),
          status: 'To Do',
        });

      return { message: `Task created: ${title}`, action: 'task_created' };
    }
  }
  
  return { message: 'Task command processed', action: 'task_general' };
}

async function processCalendarCommand(command: string, userId: string, supabase: any) {
  // Extract calendar details from command
  if (command.toLowerCase().includes('schedule meeting')) {
    const meetingMatch = command.match(/schedule meeting[:\s]+(.+)/i);
    if (meetingMatch) {
      const [, details] = meetingMatch;
      
      // Create a placeholder event (would integrate with Google Calendar API)
      await supabase
        .from('calendar_events')
        .insert({
          user_id: userId,
          google_event_id: `local-${Date.now()}`,
          title: details.trim(),
          start_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 24 * 60 * 60 * 1000 + 60 * 60 * 1000).toISOString(), // 1 hour duration
          status: 'tentative',
        });

      return { message: `Meeting scheduled: ${details}`, action: 'meeting_scheduled' };
    }
  }
  
  return { message: 'Calendar command processed', action: 'calendar_general' };
}

async function processVoiceCommand(command: string, userId: string, supabase: any) {
  // Record voice note
  await supabase
    .from('voice_notes')
    .insert({
      user_id: userId,
      title: `Voice note - ${new Date().toLocaleTimeString()}`,
      transcript: command,
      duration: Math.floor(command.length / 5), // Rough estimate
      is_urgent: command.toLowerCase().includes('urgent'),
    });

  return { message: 'Voice note recorded', action: 'voice_note_saved' };
}

async function processGeneralCommand(command: string, userId: string, supabase: any) {
  // Log AI agent activity
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
}
