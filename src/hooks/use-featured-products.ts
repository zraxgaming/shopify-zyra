import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/use-products";

export const useFeaturedProducts = (category?: string, limit: number = 4) => {
  return useQuery({
    queryKey: ["featured-products", category, limit],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(
          `id, name, slug, price, images, short_description, description, is_featured, stock_quantity, stock_status`
        )
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []).map(product => ({
        ...product,
        featured: true,
        in_stock: product.stock_quantity > 0 && product.stock_status !== 'out_of_stock',
        rating: 0,
        review_count: 0
      })) as Product[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
