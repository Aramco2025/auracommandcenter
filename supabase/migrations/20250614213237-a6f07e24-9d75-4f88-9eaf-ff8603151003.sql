
-- Update the existing user_integrations table to match your schema
ALTER TABLE user_integrations 
ADD COLUMN IF NOT EXISTS notion_access_token text,
ADD COLUMN IF NOT EXISTS google_access_token text,
ADD COLUMN IF NOT EXISTS google_refresh_token text,
ADD COLUMN IF NOT EXISTS slack_access_token text,
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS stripe_subscription_status text;

-- Create a subscribers table for Stripe subscription management
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  subscription_status TEXT DEFAULT 'inactive',
  billing_cycle TEXT DEFAULT 'monthly', -- 'monthly' or 'annual'
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security for subscribers
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policies for subscribers table
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Update the existing tasks table structure to match your schema
ALTER TABLE notion_tasks 
ADD COLUMN IF NOT EXISTS notion_task_id text;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);
CREATE INDEX IF NOT EXISTS idx_user_integrations_user_id ON public.user_integrations(user_id);
