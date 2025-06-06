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
    // Create client with user auth for getting user info
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Create service role client for database operations
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
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
        result = await processEmailCommand(command, userId, supabaseServiceClient, supabaseClient);
      } else if (command.toLowerCase().includes('create task') || command.toLowerCase().includes('update task') || command_type === 'task') {
        result = await processTaskCommand(command, userId, supabaseServiceClient);
      } else if (command.toLowerCase().includes('schedule') || command.toLowerCase().includes('calendar') || command.toLowerCase().includes('meeting') || command.toLowerCase().includes('what\'s on my calendar') || command_type === 'calendar') {
        result = await processCalendarCommand(command, userId, supabaseServiceClient, supabaseClient);
      } else if (command.toLowerCase().includes('record note') || command_type === 'voice') {
        result = await processVoiceCommand(command, userId, supabaseServiceClient);
      } else {
        result = await processGeneralCommand(command, userId, supabaseServiceClient);
      }
    } catch (error) {
      console.error('Command processing error:', error);
      status = 'failed';
      result = { error: error.message, message: 'Command processing failed' };
    }

    // Only save to command history if we have a real user
    if (user) {
      try {
        await supabaseServiceClient
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

async function getGoogleAccessToken(userSupabase: any) {
  try {
    console.log('Getting Google access token...');
    
    // Get the current session
    const { data: sessionData, error: sessionError } = await userSupabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
      return null;
    }
    
    const session = sessionData.session;
    
    if (!session) {
      console.log('No session found');
      return null;
    }
    
    console.log('Session provider:', session.user?.app_metadata?.provider);
    console.log('Has provider_token:', !!session.provider_token);
    console.log('Has provider_refresh_token:', !!session.provider_refresh_token);
    
    // Method 1: Direct from session provider_token
    if (session.provider_token) {
      console.log('Found access token in session.provider_token');
      return session.provider_token;
    }
    
    // Method 2: Try to refresh the token if we have a refresh token
    if (session.provider_refresh_token) {
      console.log('Attempting to refresh Google token using refresh token...');
      
      try {
        const refreshResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: Deno.env.get('GOOGLE_CLIENT_ID') || '',
            client_secret: Deno.env.get('GOOGLE_CLIENT_SECRET') || '',
            refresh_token: session.provider_refresh_token,
            grant_type: 'refresh_token',
          }),
        });
        
        console.log('Google refresh response status:', refreshResponse.status);
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          console.log('Successfully refreshed Google token');
          return refreshData.access_token;
        } else {
          const errorText = await refreshResponse.text();
          console.error('Failed to refresh Google token:', errorText);
        }
      } catch (refreshError) {
        console.error('Error during token refresh:', refreshError);
      }
    }
    
    console.log('No valid Google access token found');
    return null;
    
  } catch (error) {
    console.error('Error in getGoogleAccessToken:', error);
    return null;
  }
}

async function processCalendarCommand(command: string, userId: string, supabase: any, userSupabase: any) {
  console.log('Processing calendar command:', command);
  
  // Handle "what's on my calendar" queries
  if (command.toLowerCase().includes('what\'s on my calendar') || command.toLowerCase().includes('calendar today') || command.toLowerCase().includes('schedule today')) {
    try {
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const { data: events, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', userId)
        .gte('start_time', startOfDay.toISOString())
        .lt('start_time', endOfDay.toISOString())
        .order('start_time');

      if (error) throw error;

      if (events && events.length > 0) {
        const eventList = events.map(event => 
          `${event.title} at ${new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
        ).join(', ');
        return { message: `Today's events: ${eventList}`, action: 'calendar_query', events };
      } else {
        return { message: 'No events scheduled for today', action: 'calendar_query_empty' };
      }
    } catch (error) {
      console.error('Calendar query error:', error);
      return { message: 'Calendar queried (demo mode - no events found)', action: 'calendar_query_demo' };
    }
  }
  
  // Handle schedule meeting commands - REAL GOOGLE CALENDAR INTEGRATION
  if (command.toLowerCase().includes('schedule meeting') || command.toLowerCase().includes('schedule') || command.toLowerCase().includes('meeting')) {
    const meetingMatch = command.match(/schedule.*?meeting[:\s]+(.+)/i) || command.match(/schedule[:\s]+(.+)/i);
    if (meetingMatch) {
      const [, details] = meetingMatch;
      
      // Parse time from the command
      let startTime = new Date();
      let endTime = new Date();
      
      if (details.toLowerCase().includes('tomorrow')) {
        startTime.setDate(startTime.getDate() + 1);
        endTime.setDate(endTime.getDate() + 1);
      }
      
      // Simple time parsing for "9am", "2pm", etc.
      const timeMatch = details.match(/(\d{1,2})(am|pm)/i);
      if (timeMatch) {
        let hour = parseInt(timeMatch[1]);
        const ampm = timeMatch[2].toLowerCase();
        if (ampm === 'pm' && hour !== 12) hour += 12;
        if (ampm === 'am' && hour === 12) hour = 0;
        
        startTime.setHours(hour, 0, 0, 0);
        endTime.setHours(hour + 1, 0, 0, 0);
      } else {
        // Default to next available hour if no time specified
        const now = new Date();
        startTime.setHours(now.getHours() + 1, 0, 0, 0);
        endTime.setHours(now.getHours() + 2, 0, 0, 0);
      }
      
      try {
        const accessToken = await getGoogleAccessToken(userSupabase);

        if (!accessToken) {
          return { 
            message: 'Google Calendar access not available. Please sign out and sign back in with Google, making sure to accept all permissions when prompted.', 
            action: 'auth_required' 
          };
        }

        console.log('Creating Google Calendar event with access token');

        // Create event in Google Calendar
        const eventData = {
          summary: details.trim(),
          start: {
            dateTime: startTime.toISOString(),
            timeZone: 'UTC',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: 'UTC',
          },
        };
        
        console.log('Event data:', JSON.stringify(eventData, null, 2));

        const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(eventData),
        });

        const calendarData = await calendarResponse.json();
        console.log('Google Calendar API response status:', calendarResponse.status);
        console.log('Google Calendar API response:', JSON.stringify(calendarData, null, 2));

        if (!calendarResponse.ok) {
          console.error('Google Calendar API error:', calendarData);
          throw new Error(`Failed to create calendar event: ${calendarData.error?.message || 'Unknown error'}`);
        }

        // Store in our database for reference
        try {
          const { data, error } = await supabase
            .from('calendar_events')
            .insert({
              user_id: userId,
              google_event_id: calendarData.id,
              title: details.trim(),
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              status: 'confirmed',
            })
            .select()
            .single();

          if (error) {
            console.error('Database error:', error);
            // Don't throw here as the Google Calendar event was created successfully
          }
        } catch (dbError) {
          console.error('Database storage error:', dbError);
        }

        return { 
          message: `✅ Meeting "${details}" successfully created in your Google Calendar for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, 
          action: 'meeting_scheduled_google',
          event: calendarData
        };
      } catch (error) {
        console.error('Calendar command error:', error);
        
        // Fallback to local storage
        try {
          const { data, error } = await supabase
            .from('calendar_events')
            .insert({
              user_id: userId,
              google_event_id: `local-${Date.now()}`,
              title: details.trim(),
              start_time: startTime.toISOString(),
              end_time: endTime.toISOString(),
              status: 'confirmed',
            })
            .select()
            .single();

          if (error) throw error;

          return { 
            message: `Meeting "${details}" scheduled locally for ${startTime.toLocaleDateString()} at ${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}. Note: Could not sync to Google Calendar - ${error.message}`, 
            action: 'meeting_scheduled_local',
            event: data
          };
        } catch (dbError) {
          return { message: `Failed to schedule meeting: ${error.message}`, action: 'meeting_failed' };
        }
      }
    }
  }
  
  return { message: 'Calendar command processed', action: 'calendar_general' };
}

async function processEmailCommand(command: string, userId: string, supabase: any, userSupabase: any) {
  console.log('Processing email command:', command);
  
  // Extract email details from command
  const emailMatch = command.match(/send email to ([^\s]+)(?:\s+(?:about|with subject)\s+)?(.+)/i);
  if (emailMatch) {
    const [, recipient, subject] = emailMatch;
    
    try {
      const accessToken = await getGoogleAccessToken(userSupabase);

      if (!accessToken) {
        // Record the email intent without sending
        try {
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
        } catch (dbError) {
          console.error('Database error:', dbError);
        }

        return { 
          message: `Email draft created for ${recipient}. Please reconnect Google to enable sending.`, 
          action: 'email_draft_auth_required' 
        };
      }

      console.log('Sending email via Gmail API');

      // Create email content
      const emailContent = `Subject: ${subject || 'Message from AURA'}\r\nTo: ${recipient}\r\nContent-Type: text/plain; charset=utf-8\r\n\r\n${subject || command}`;
      const encodedEmail = btoa(emailContent).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

      // Send via Gmail API
      const gmailResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          raw: encodedEmail
        }),
      });

      console.log('Gmail API response status:', gmailResponse.status);

      if (gmailResponse.ok) {
        const gmailData = await gmailResponse.json();
        console.log('Email sent successfully:', gmailData.id);
        
        // Record the sent email
        try {
          const { data: session } = await userSupabase.auth.getSession();
          await supabase
            .from('emails')
            .insert({
              user_id: userId,
              message_id: gmailData.id,
              subject: subject || 'Email from AURA',
              sender_email: session.session?.user?.email || 'user@example.com',
              recipient_emails: [recipient],
              body_preview: subject || command,
              is_sent: true,
              sent_at: new Date().toISOString(),
            });
        } catch (dbError) {
          console.error('Database error:', dbError);
        }

        return { 
          message: `✅ Email sent successfully to ${recipient}`, 
          action: 'email_sent',
          emailId: gmailData.id
        };
      } else {
        const errorData = await gmailResponse.json();
        console.error('Gmail API error:', errorData);
        throw new Error(`Failed to send email: ${errorData.error?.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Email command error:', error);
      
      // Fallback: Record draft
      try {
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

        return { 
          message: `Email draft created for ${recipient}. Could not send: ${error.message}`, 
          action: 'email_draft_error' 
        };
      } catch (dbError) {
        return { 
          message: `Failed to process email command: ${error.message}`, 
          action: 'email_failed' 
        };
      }
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
        // Check if we have Notion integration configured
        const notionToken = Deno.env.get('NOTION_TOKEN');
        const notionDatabaseId = Deno.env.get('NOTION_DATABASE_ID');

        if (notionToken && notionDatabaseId) {
          // Create task in Notion
          const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${notionToken}`,
              'Content-Type': 'application/json',
              'Notion-Version': '2022-06-28',
            },
            body: JSON.stringify({
              parent: { database_id: notionDatabaseId },
              properties: {
                Name: {
                  title: [{ text: { content: title.trim() } }]
                },
                Status: {
                  select: { name: 'To Do' }
                }
              }
            }),
          });

          if (notionResponse.ok) {
            const notionData = await notionResponse.json();
            
            // Also store locally
            await supabase
              .from('notion_tasks')
              .insert({
                user_id: userId,
                notion_page_id: notionData.id,
                title: title.trim(),
                status: 'To Do',
                notion_url: notionData.url,
              });

            return { 
              message: `✅ Task "${title}" created in Notion successfully`, 
              action: 'task_created_notion',
              taskId: notionData.id
            };
          }
        }

        // Fallback: Create locally only
        await supabase
          .from('notion_tasks')
          .insert({
            user_id: userId,
            notion_page_id: `local-${Date.now()}`,
            title: title.trim(),
            status: 'To Do',
          });

        return { 
          message: `Task "${title}" created locally. Connect Notion for full integration.`, 
          action: 'task_created_local' 
        };
      } catch (error) {
        console.error('Task command error:', error);
        return { 
          message: `Failed to create task: ${error.message}`, 
          action: 'task_failed' 
        };
      }
    }
  }
  
  return { message: 'Task command processed', action: 'task_general' };
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
