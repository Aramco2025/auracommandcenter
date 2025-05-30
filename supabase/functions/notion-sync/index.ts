
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

    const { notion_token, database_id } = await req.json();

    // Fetch pages from Notion database
    const notionResponse = await fetch(
      `https://api.notion.com/v1/databases/${database_id}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notion_token}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2022-06-28',
        },
        body: JSON.stringify({
          page_size: 100,
        }),
      }
    );

    const notionData = await notionResponse.json();
    
    if (!notionData.results) {
      return new Response(JSON.stringify({ error: 'Failed to fetch Notion data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const syncedTasks = [];
    for (const page of notionData.results) {
      const properties = page.properties;
      
      // Extract common task properties (adjust based on your Notion setup)
      const title = properties.Name?.title?.[0]?.plain_text || 
                   properties.Title?.title?.[0]?.plain_text || 
                   'Untitled';
      
      const status = properties.Status?.select?.name || 
                    properties.Stage?.select?.name || 
                    'To Do';
      
      const priority = properties.Priority?.select?.name || null;
      const dueDate = properties['Due Date']?.date?.start || null;
      const progress = properties.Progress?.number || 0;

      // Check if task already exists
      const { data: existingTask } = await supabaseClient
        .from('notion_tasks')
        .select('id')
        .eq('notion_page_id', page.id)
        .single();

      if (!existingTask) {
        const { data, error } = await supabaseClient
          .from('notion_tasks')
          .insert({
            user_id: user.id,
            notion_page_id: page.id,
            title,
            status,
            priority,
            due_date: dueDate,
            progress,
            notion_url: page.url,
            last_edited_time: page.last_edited_time,
          });

        if (!error) {
          syncedTasks.push(data);
        }
      } else {
        // Update existing task
        await supabaseClient
          .from('notion_tasks')
          .update({
            title,
            status,
            priority,
            due_date: dueDate,
            progress,
            last_edited_time: page.last_edited_time,
            updated_at: new Date().toISOString(),
          })
          .eq('notion_page_id', page.id);
      }
    }

    // Update sync status
    await supabaseClient
      .from('user_integrations')
      .upsert({
        user_id: user.id,
        integration_type: 'notion',
        is_connected: true,
        last_sync: new Date().toISOString(),
        settings: { database_id },
      });

    return new Response(JSON.stringify({ 
      success: true, 
      synced: syncedTasks.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Notion sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
