import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Order, OrderItem } from "@/types/order";

export const useUserOrders = (userId?: string) => {
  return useQuery({
    queryKey: ["user-orders", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            customization,
            products:product_id (
              id,
              name,
              images,
              slug
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      // Transform the data to match our types
      return (data || []).map(order => ({
        ...order,
        order_items: order.order_items?.map((item: any) => ({
          ...item,
          product: {
            id: item.products?.id || '',
            name: item.products?.name || 'Unknown Product',
            images: Array.isArray(item.products?.images)
              ? item.products.images
              : item.products?.images
                ? [item.products.images]
                : [],
            slug: item.products?.slug || ''
          }
        })) || []
      })) as Order[];
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: false,
  });
};
