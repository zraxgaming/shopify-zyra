
import React, { createContext, useContext, useReducer, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
  customization?: any;
  is_digital?: boolean;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
}

type CartAction = 
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload || [] };
    case 'ADD_ITEM':
      const currentItems = state.items || [];
      const existingItem = currentItems.find(item => item.product_id === action.payload.product_id);
      if (existingItem) {
        return {
          ...state,
          items: currentItems.map(item =>
            item.product_id === action.payload.product_id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        };
      }
      return { ...state, items: [...currentItems, action.payload] };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: (state.items || []).map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: (state.items || []).filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface CartContextType {
  items: CartItem[];
  isLoading: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
  giftCardAmount: number;
  coupon: any;
  giftCard: any;
  setCoupon: (coupon: any) => void;
  setGiftCard: (card: any) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isLoading: false });
  const [coupon, setCoupon] = React.useState<any>(null);
  const [giftCard, setGiftCard] = React.useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load cart on mount and user change
  useEffect(() => {
    loadCart();
  }, [user]);

  const loadCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      if (user) {
        // Load from database for logged-in users
        const { data, error } = await supabase
          .from('cart_items')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        dispatch({ type: 'SET_ITEMS', payload: (data || []) as any });
      } else {
        // Load from localStorage for guests
        const savedCart = localStorage.getItem('zyra_cart');
        if (savedCart) {
          const items = JSON.parse(savedCart);
          dispatch({ type: 'SET_ITEMS', payload: items });
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast({
        title: "Cart Loading Error",
        description: "Could not load your cart items",
        variant: "destructive",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const saveCart = async (items: CartItem[]) => {
    try {
      if (user) {
        // Save to database for logged-in users
        // First, clear existing cart items
        await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);

        // Then insert new items
        if (items.length > 0) {
          const { error } = await supabase
            .from('cart_items')
            .insert(
              items.map(item => ({
                user_id: user.id,
                product_id: item.product_id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image_url,
                customization: item.customization
              }))
            );

          if (error) throw error;
        }
      } else {
        // Save to localStorage for guests
        localStorage.setItem('zyra_cart', JSON.stringify(items));
      }
    } catch (error) {
      console.error('Error saving cart:', error);
      toast({
        title: "Cart Save Error",
        description: "Could not save your cart",
        variant: "destructive",
      });
    }
  };

  const computeAdd = (items: CartItem[], item: CartItem): CartItem[] => {
    const existingIndex = items.findIndex(i => i.product_id === item.product_id);
    if (existingIndex >= 0) {
      return items.map((i, idx) =>
        idx === existingIndex ? { ...i, quantity: i.quantity + item.quantity } : i
      );
    }
    return [...items, item];
  };

  const addItem = async (newItem: Omit<CartItem, 'id'>) => {
    const item = { ...newItem, id: crypto.randomUUID() };
    dispatch({ type: 'ADD_ITEM', payload: item });

    const updatedItems = computeAdd(state.items || [], item);
    await saveCart(updatedItems);

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(id);
      return;
    }

    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    const updatedItems = (state.items || []).map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    await saveCart(updatedItems);
  };

  const removeItem = async (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
    const updatedItems = (state.items || []).filter(item => item.id !== id);
    await saveCart(updatedItems);
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart",
    });
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });
    await saveCart([]);
  };

  const totalItems = state.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  const totalPrice = state.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;
  
  const subtotal = totalPrice;
  const discount = coupon?.discount_value || 0;
  const giftCardAmount = giftCard?.amount || 0;

  return (
    <CartContext.Provider value={{
      items: state.items,
      isLoading: state.isLoading,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      totalItems,
      totalPrice,
      subtotal,
      discount,
      giftCardAmount,
      coupon,
      giftCard,
      setCoupon,
      setGiftCard,
      addToCart: addItem,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
