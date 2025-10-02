-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create order_refunds table
CREATE TABLE IF NOT EXISTS public.order_refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'AED',
    status TEXT DEFAULT 'pending',
    reason TEXT,
    ziina_refund_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.order_refunds ENABLE ROW LEVEL SECURITY;

-- Create shipping_methods table
CREATE TABLE IF NOT EXISTS public.shipping_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    active BOOLEAN DEFAULT true,
    estimated_days TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- RLS Policies for contact_submissions (admins only)
CREATE POLICY "Admins can view contact submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can submit contact form" ON public.contact_submissions FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for order_refunds
CREATE POLICY "Users can view own refunds" ON public.order_refunds FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE orders.id = order_refunds.order_id 
        AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
);
CREATE POLICY "Admins can manage refunds" ON public.order_refunds FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for shipping_methods
CREATE POLICY "Anyone can view active shipping methods" ON public.shipping_methods FOR SELECT TO public USING (active = true);
CREATE POLICY "Admins can manage shipping methods" ON public.shipping_methods FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));