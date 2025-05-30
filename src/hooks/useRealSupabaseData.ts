
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export const useRealSupabaseData = () => {
  const { user } = useAuth();

  const { data: emails = [] } = useQuery({
    queryKey: ['emails', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('emails')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['notion_tasks', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('notion_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: events = [] } = useQuery({
    queryKey: ['calendar_events', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .eq('user_id', user.id)
        .order('start_time', { ascending: true });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: aiActivities = [] } = useQuery({
    queryKey: ['ai_agent_activities', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('ai_agent_activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  const { data: voiceNotes = [] } = useQuery({
    queryKey: ['voice_notes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('voice_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });

  return {
    emails,
    tasks,
    events,
    aiActivities,
    voiceNotes,
  };
};

export const useRealCommandProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();

  const processCommand = async (command: string, commandType?: string) => {
    if (!user) {
      throw new Error('User must be authenticated to process commands');
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('command-processor', {
        body: { 
          command, 
          command_type: commandType || 'general' 
        }
      });

      if (error) {
        throw error;
      }

      return data.result;
    } catch (error) {
      console.error('Command processing error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return { processCommand, isProcessing };
};
