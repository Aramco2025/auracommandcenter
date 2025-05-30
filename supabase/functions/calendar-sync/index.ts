
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

    const { access_token } = await req.json();

    // Get events from the next 30 days
    const timeMin = new Date().toISOString();
    const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const calendarResponse = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime&maxResults=100`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const calendarData = await calendarResponse.json();
    
    if (!calendarData.items) {
      return new Response(JSON.stringify({ success: true, synced: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const syncedEvents = [];
    for (const event of calendarData.items) {
      if (!event.start || !event.end) continue;

      const startTime = event.start.dateTime || event.start.date;
      const endTime = event.end.dateTime || event.end.date;
      
      // Check if event already exists
      const { data: existingEvent } = await supabaseClient
        .from('calendar_events')
        .select('id')
        .eq('google_event_id', event.id)
        .single();

      if (!existingEvent) {
        const { data, error } = await supabaseClient
          .from('calendar_events')
          .insert({
            user_id: user.id,
            google_event_id: event.id,
            title: event.summary || 'Untitled Event',
            description: event.description || null,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            location: event.location || null,
            attendees: event.attendees || null,
            meeting_link: event.hangoutLink || null,
            status: event.status || 'confirmed',
          });

        if (!error) {
          syncedEvents.push(data);
        }
      } else {
        // Update existing event
        await supabaseClient
          .from('calendar_events')
          .update({
            title: event.summary || 'Untitled Event',
            description: event.description || null,
            start_time: new Date(startTime).toISOString(),
            end_time: new Date(endTime).toISOString(),
            location: event.location || null,
            attendees: event.attendees || null,
            meeting_link: event.hangoutLink || null,
            status: event.status || 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('google_event_id', event.id);
      }
    }

    // Update sync status
    await supabaseClient
      .from('user_integrations')
      .upsert({
        user_id: user.id,
        integration_type: 'calendar',
        is_connected: true,
        last_sync: new Date().toISOString(),
      });

    return new Response(JSON.stringify({ 
      success: true, 
      synced: syncedEvents.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Calendar sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
