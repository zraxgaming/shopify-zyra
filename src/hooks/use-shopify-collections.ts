import { useQuery } from "@tanstack/react-query";
import { fetchShopifyCollections, fetchCollectionByHandle } from "@/services/shopifyCollections";

export const useShopifyCollections = () =>
  useQuery({
    queryKey: ["shopify-collections"],
    queryFn: () => fetchShopifyCollections(20),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

export const useShopifyCollection = (handle: string | undefined) =>
  useQuery({
    queryKey: ["shopify-collection", handle],
    queryFn: () => fetchCollectionByHandle(handle!),
    enabled: !!handle,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
