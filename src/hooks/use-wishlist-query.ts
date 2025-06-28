import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useWishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const wishlistQuery = useQuery({
    queryKey: ["wishlist", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wishlists")
        .select(`
          id,
          product_id,
          products!wishlists_product_id_fkey (
            name,
            price,
            images
          )
        `)
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);
      return (data || []).map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.products?.price || 0,
        images: Array.isArray(item.products?.images)
          ? item.products.images.filter((img) => typeof img === 'string')
          : []
      }));
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  const addToWishlist = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("wishlists")
        .insert({ user_id: user.id, product_id: productId });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
    },
  });

  const removeFromWishlist = useMutation({
    mutationFn: async (productId: string) => {
      const { error } = await supabase
        .from("wishlists")
        .delete()
        .eq("user_id", user.id)
        .eq("product_id", productId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist", user?.id] });
    },
  });

  const isInWishlist = (productId: string) => {
    return wishlistQuery.data?.some((item: any) => item.product_id === productId) ?? false;
  };

  return {
    items: wishlistQuery.data || [],
    isLoading: wishlistQuery.isLoading,
    addToWishlist: addToWishlist.mutateAsync,
    removeFromWishlist: removeFromWishlist.mutateAsync,
    isInWishlist,
  };
};
