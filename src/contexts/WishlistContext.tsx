
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  images?: string[];
  slug: string;
  rating?: number;
  review_count?: number;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load wishlist from localStorage on mount (for guests) or from Supabase (for users)
  useEffect(() => {
    if (user) {
      loadWishlistFromDB();
    } else {
      loadWishlistFromStorage();
    }
  }, [user]);

  const loadWishlistFromStorage = () => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
      }
    }
  };

  const loadWishlistFromDB = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          *,
          products (
            id,
            name,
            price,
            images,
            slug
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const wishlistItems = data?.map(item => ({
        id: item.id,
        product_id: item.product_id,
        name: item.products?.name || '',
        price: item.products?.price || 0,
        images: item.products?.images || [],
        slug: item.products?.slug || '',
      })) || [];

      setWishlist(wishlistItems);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save wishlist to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const addToWishlist = async (item: WishlistItem) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: item.product_id
          });

        if (error) throw error;
        
        setWishlist(prev => [...prev, item]);
        toast({
          title: "Added to Wishlist",
          description: `${item.name} has been added to your wishlist.`,
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to add item to wishlist.",
          variant: "destructive",
        });
      }
    } else {
      setWishlist(prev => [...prev, item]);
      toast({
        title: "Added to Wishlist",
        description: `${item.name} has been added to your wishlist.`,
      });
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        
        setWishlist(prev => prev.filter(item => item.product_id !== productId));
        toast({
          title: "Removed from Wishlist",
          description: "Item has been removed from your wishlist.",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: "Failed to remove item from wishlist.",
          variant: "destructive",
        });
      }
    } else {
      setWishlist(prev => prev.filter(item => item.product_id !== productId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.product_id === productId);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      isLoading
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
