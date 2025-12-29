-- Add rejected status and reason columns to agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS rejected boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS rejection_reason text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rejected_at timestamp with time zone DEFAULT NULL;