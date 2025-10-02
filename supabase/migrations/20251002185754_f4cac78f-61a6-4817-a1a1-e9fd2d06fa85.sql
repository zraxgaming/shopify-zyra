-- Create site_config table for maintenance mode and other settings
CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Create barcode_generations table for tracking generated barcodes
CREATE TABLE IF NOT EXISTS public.barcode_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    barcode_type TEXT NOT NULL,
    barcode_value TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.barcode_generations ENABLE ROW LEVEL SECURITY;

-- Create referrals table for referral program
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    referral_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending',
    reward_earned NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Create reviews table for product reviews
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT,
    comment TEXT,
    verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create coupons table for discount codes
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL,
    discount_value NUMERIC NOT NULL,
    min_purchase_amount NUMERIC DEFAULT 0,
    max_uses INTEGER,
    used_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Add missing columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;

-- RLS Policies for site_config (admins only)
CREATE POLICY "Admins can manage site config" ON public.site_config FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view site config" ON public.site_config FOR SELECT TO public USING (true);

-- RLS Policies for barcode_generations (admins only)
CREATE POLICY "Admins can manage barcodes" ON public.barcode_generations FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals FOR SELECT TO authenticated USING (auth.uid() = referrer_id OR auth.uid() = referred_id);
CREATE POLICY "Users can create referrals" ON public.referrals FOR INSERT TO authenticated WITH CHECK (auth.uid() = referrer_id);
CREATE POLICY "Admins can manage referrals" ON public.referrals FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT TO public USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for coupons
CREATE POLICY "Anyone can view active coupons" ON public.coupons FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));