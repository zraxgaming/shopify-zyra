-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles without RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Add missing columns to orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS total_amount NUMERIC;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address JSONB;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_email TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_name TEXT;

-- Add missing columns to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS short_description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cost_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS sku TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS manage_stock BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category_id UUID;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_customizable BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_digital BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Add missing columns to profiles table  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address JSONB;

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    image_url TEXT,
    customization JSONB,
    is_digital BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Create page_views table for analytics
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path TEXT NOT NULL,
    user_id UUID,
    session_id TEXT,
    referrer TEXT,
    user_agent TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    ip_address TEXT
);

ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Create gift_cards table
CREATE TABLE IF NOT EXISTS public.gift_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    initial_amount NUMERIC NOT NULL,
    current_amount NUMERIC NOT NULL,
    recipient_email TEXT,
    sender_name TEXT,
    message TEXT,
    status TEXT DEFAULT 'active',
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;

-- Create newsletter_subscriptions table
CREATE TABLE IF NOT EXISTS public.newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'subscribed',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create wishlists table
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_roles (admins can manage)
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for cart_items
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own cart" ON public.cart_items FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own cart" ON public.cart_items FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for wishlists
CREATE POLICY "Users can view own wishlist" ON public.wishlists FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own wishlist" ON public.wishlists FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own wishlist" ON public.wishlists FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RLS Policies for products (public read, admin write)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO public USING (true);
CREATE POLICY "Admins can insert products" ON public.products FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update products" ON public.products FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete products" ON public.products FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for categories (public read, admin write)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT TO public USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for orders (users see own, admins see all)
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for page_views (admins only)
CREATE POLICY "Admins can view analytics" ON public.page_views FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can insert page views" ON public.page_views FOR INSERT TO public WITH CHECK (true);

-- RLS Policies for gift_cards (admins manage, users can view own)
CREATE POLICY "Admins can manage gift cards" ON public.gift_cards FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for newsletter (public can subscribe)
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscriptions FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admins can view subscriptions" ON public.newsletter_subscriptions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Public can view product images" ON storage.objects FOR SELECT TO public USING (bucket_id = 'products');
CREATE POLICY "Admins can upload product images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update product images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete product images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'products' AND public.has_role(auth.uid(), 'admin'));