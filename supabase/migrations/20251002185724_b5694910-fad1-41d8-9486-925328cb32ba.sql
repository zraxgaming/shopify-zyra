-- Enable RLS on existing tables that were missing it
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for order_items
CREATE POLICY "Users can view own order items" ON public.order_items 
FOR SELECT TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    WHERE orders.id = order_items.order_id 
    AND (orders.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Admins can manage order items" ON public.order_items 
FOR ALL TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));