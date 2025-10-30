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
          `id, name, slug, price, images, short_description, description, is_featured, stock_quantity, stock_status, category_id, is_customizable`
        );
      if (filters.categories && filters.categories.length > 0) {
        query = query.in("category_id", filters.categories);
      }
      if (filters.priceRange) {
        query = query.gte("price", filters.priceRange[0]).lte("price", filters.priceRange[1]);
      }
      if (filters.inStock) {
        query = query.gt("stock_quantity", 0).neq("stock_status", "out_of_stock");
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
      return (data || []).map(product => ({
        ...product,
        in_stock: product.stock_quantity > 0 && product.stock_status !== 'out_of_stock',
        featured: product.is_featured,
        rating: 0,
        review_count: 0,
        category: 'Uncategorized'
      })) as Product[];
    },
    staleTime: 1000 * 60 * 2,
    refetchOnWindowFocus: false,
  });
};
