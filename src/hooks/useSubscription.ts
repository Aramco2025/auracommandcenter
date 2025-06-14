
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionData {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
  billing_cycle?: string;
}

export const useSubscription = () => {
  const { user, session } = useAuth();
  const [subscription, setSubscription] = useState<SubscriptionData>({ subscribed: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkSubscription = async () => {
    if (!user || !session) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      console.log('Subscription check result:', data);
      setSubscription(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check subscription';
      console.error('Subscription check error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createCheckout = async (billingCycle: 'monthly' | 'annual' = 'monthly') => {
    if (!user || !session) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { billingCycle },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open Stripe checkout in a new tab
      window.open(data.url, '_blank');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create checkout';
      console.error('Checkout creation error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openCustomerPortal = async () => {
    if (!user || !session) throw new Error('User not authenticated');
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      // Open customer portal in a new tab
      window.open(data.url, '_blank');
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to open customer portal';
      console.error('Customer portal error:', errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && session) {
      checkSubscription();
    }
  }, [user, session]);

  return {
    subscription,
    loading,
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
