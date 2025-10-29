-- Enable RLS on profiles table (if not already enabled)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins view all" ON public.profiles;

-- Create policies for profiles table
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" 
  ON public.profiles FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Restrict site_config access to prevent reading API keys
DROP POLICY IF EXISTS "Anyone can view site config" ON public.site_config;
DROP POLICY IF EXISTS "Non-sensitive config readable by all" ON public.site_config;
DROP POLICY IF EXISTS "Admins can view all config" ON public.site_config;

CREATE POLICY "Non-sensitive config readable by all" 
  ON public.site_config FOR SELECT 
  USING (
    key NOT LIKE '%api_key%' 
    AND key NOT LIKE '%secret%' 
    AND key NOT LIKE '%password%'
    AND key NOT LIKE '%token%'
  );

CREATE POLICY "Admins can view all config" 
  ON public.site_config FOR SELECT 
  USING (public.has_role(auth.uid(), 'admin'::app_role));