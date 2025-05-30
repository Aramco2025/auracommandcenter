
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

    const { title, startTime, endTime, description, location } = await req.json();

    // Get the user's Google access token from their session
    const { data: session } = await supabaseClient.auth.getSession();
    const accessToken = session.session?.provider_token;

    if (!accessToken) {
      throw new Error('No Google access token found. Please re-authenticate with Google.');
    }

    // Create event in Google Calendar
    const calendarResponse = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: title,
        description: description || '',
        location: location || '',
        start: {
          dateTime: startTime,
          timeZone: 'UTC',
        },
        end: {
          dateTime: endTime,
          timeZone: 'UTC',
        },
      }),
    });

    const calendarData = await calendarResponse.json();

    if (!calendarResponse.ok) {
      console.error('Google Calendar API error:', calendarData);
      throw new Error(`Failed to create calendar event: ${calendarData.error?.message || 'Unknown error'}`);
    }

    // Also store in our database for reference
    const { error: dbError } = await supabaseClient
      .from('calendar_events')
      .insert({
        user_id: user.id,
        google_event_id: calendarData.id,
        title: title,
        description: description || null,
        start_time: startTime,
        end_time: endTime,
        location: location || null,
        status: 'confirmed',
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Don't throw here as the Google Calendar event was created successfully
    }

    return new Response(JSON.stringify({ 
      success: true, 
      event: calendarData,
      message: `Event "${title}" created successfully in your Google Calendar`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Calendar event creation error:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
