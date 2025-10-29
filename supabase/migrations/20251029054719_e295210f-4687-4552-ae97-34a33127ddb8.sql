-- Enable RLS on products table (products are public but we need RLS enabled for security compliance)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Recreate policies
CREATE POLICY "Anyone can view products" 
  ON public.products FOR SELECT 
  USING (true);

CREATE POLICY "Admins can insert products" 
  ON public.products FOR INSERT 
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update products" 
  ON public.products FOR UPDATE 
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete products" 
  ON public.products FOR DELETE 
  USING (public.has_role(auth.uid(), 'admin'::app_role));