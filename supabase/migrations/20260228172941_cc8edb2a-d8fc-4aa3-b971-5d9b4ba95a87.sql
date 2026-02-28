
-- Table to store conversion events
CREATE TABLE public.conversions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id TEXT NOT NULL,
  tag_label TEXT NOT NULL,
  transaction_id TEXT,
  customer_name TEXT,
  customer_cpf TEXT,
  amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

-- Allow insert from edge functions (service role)
CREATE POLICY "Allow insert from service role"
ON public.conversions
FOR INSERT
WITH CHECK (true);

-- Allow select from service role (for dashboard - public read for now)
CREATE POLICY "Allow public read"
ON public.conversions
FOR SELECT
USING (true);
