
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useSupabaseData = () => {
  // Fetch emails
  const { data: emails } = useQuery({
    queryKey: ['emails'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch notion tasks
  const { data: tasks } = useQuery({
    queryKey: ['notion_tasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notion_tasks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch calendar events
  const { data: events } = useQuery({
    queryKey: ['calendar_events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .gte('start_time', new Date().toISOString())
        .order('start_time', { ascending: true })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch AI agent activities
  const { data: aiActivities } = useQuery({
    queryKey: ['ai_agent_activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ai_agent_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  // Fetch voice notes
  const { data: voiceNotes } = useQuery({
    queryKey: ['voice_notes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('voice_notes')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    },
  });

  return {
    emails: emails || [],
    tasks: tasks || [],
    events: events || [],
    aiActivities: aiActivities || [],
    voiceNotes: voiceNotes || [],
  };
};

export const useCommandProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  const processCommand = async (command: string, commandType?: string) => {
    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('command-processor', {
        body: { command, command_type: commandType },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Command processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processCommand, isProcessing };
};
