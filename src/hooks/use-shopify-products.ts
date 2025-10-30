import { useQuery } from "@tanstack/react-query";
import { fetchShopifyProducts, ShopifyProduct } from "@/services/shopifyService";

export const useShopifyProducts = () => {
  return useQuery<ShopifyProduct[], Error>({
    queryKey: ["shopify-products"],
    queryFn: () => fetchShopifyProducts(50),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
