
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GmailMessage {
  id: string;
  threadId: string;
  snippet: string;
  payload: {
    headers: Array<{ name: string; value: string }>;
  };
  internalDate: string;
  labelIds?: string[];
}

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

    // Fetch recent emails from Gmail API
    const gmailResponse = await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=50&q=newer_than:7d`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const gmailData = await gmailResponse.json();
    
    if (!gmailData.messages) {
      return new Response(JSON.stringify({ success: true, synced: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Process each message
    const syncedEmails = [];
    for (const message of gmailData.messages.slice(0, 20)) {
      const messageResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`,
        {
          headers: {
            'Authorization': `Bearer ${access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const messageData: GmailMessage = await messageResponse.json();
      
      const headers = messageData.payload.headers;
      const subject = headers.find(h => h.name === 'Subject')?.value || '';
      const from = headers.find(h => h.name === 'From')?.value || '';
      const to = headers.find(h => h.name === 'To')?.value || '';
      const date = new Date(parseInt(messageData.internalDate));

      // Check if email already exists
      const { data: existingEmail } = await supabaseClient
        .from('emails')
        .select('id')
        .eq('message_id', messageData.id)
        .single();

      if (!existingEmail) {
        const { data, error } = await supabaseClient
          .from('emails')
          .insert({
            user_id: user.id,
            message_id: messageData.id,
            thread_id: messageData.threadId,
            subject,
            sender_email: from,
            recipient_emails: [to],
            body_preview: messageData.snippet,
            is_sent: messageData.labelIds?.includes('SENT') || false,
            is_reply: messageData.threadId !== messageData.id,
            received_at: date.toISOString(),
            labels: messageData.labelIds || [],
          });

        if (!error) {
          syncedEmails.push(data);
        }
      }
    }

    // Update sync status
    await supabaseClient
      .from('user_integrations')
      .upsert({
        user_id: user.id,
        integration_type: 'gmail',
        is_connected: true,
        last_sync: new Date().toISOString(),
      });

    return new Response(JSON.stringify({ 
      success: true, 
      synced: syncedEmails.length 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Gmail sync error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
