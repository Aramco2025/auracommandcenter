
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export const useGoogleCalendar = () => {
  const { user, session } = useAuth();

  const createCalendarEvent = async (eventDetails: {
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
    location?: string;
  }) => {
    if (!user || !session) {
      throw new Error('User must be authenticated');
    }

    try {
      // Call our edge function that will create the event in Google Calendar
      const { data, error } = await supabase.functions.invoke('create-calendar-event', {
        body: eventDetails
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error creating calendar event:', error);
      throw error;
    }
  };

  const getCalendarEvents = async (timeMin?: string, timeMax?: string) => {
    if (!user || !session) {
      throw new Error('User must be authenticated');
    }

    try {
      const { data, error } = await supabase.functions.invoke('get-calendar-events', {
        body: { timeMin, timeMax }
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      throw error;
    }
  };

  return {
    createCalendarEvent,
    getCalendarEvents
  };
};
