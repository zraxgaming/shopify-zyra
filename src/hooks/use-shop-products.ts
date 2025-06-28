import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/hooks/use-products";

export const useShopProducts = (filters: {
  categories?: string[];
  priceRange?: [number, number];
  inStock?: boolean;
  featured?: boolean;
  customizable?: boolean;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
} = {}) => {
  return useQuery<Product[], Error>({
    queryKey: ["shop-products", filters],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(
          `id, name, slug, price, images, short_description, description, rating, is_featured, featured, in_stock, stock_quantity, category, is_customizable`
        );
      if (filters.categories && filters.categories.length > 0) {
        query = query.in("category", filters.categories);
      }
      if (filters.priceRange) {
        query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1]);
      }
      if (filters.inStock) {
        query = query.eq("in_stock", true);
      }
      if (filters.featured) {
        query = query.eq("is_featured", true);
      }
      if (filters.customizable) {
        query = query.eq("is_customizable", true);
      }
      if (filters.search) {
        query = query.ilike("name", `%${filters.search}%`);
      }
      if (filters.sortBy) {
        query = query.order(filters.sortBy, { ascending: false });
      } else {
        query = query.order("created_at", { ascending: false });
      }
      const page = filters.page || 1;
      const pageSize = filters.pageSize || 20;
      query = query.range((page - 1) * pageSize, page * pageSize - 1);
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return (data || []) as Product[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
