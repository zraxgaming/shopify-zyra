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
          `id, name, slug, price, images, short_description, description, rating, is_featured, featured, in_stock, stock_quantity`
        )
        .eq("is_featured", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (category) {
        query = query.eq("category", category);
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []) as Product[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
