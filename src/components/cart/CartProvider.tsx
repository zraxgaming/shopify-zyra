
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface CartItem {
  id?: string;
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  customization?: any;
  user_id?: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'id' | 'quantity' | 'user_id'>, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateCartItem: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  totalItems: () => number;
  totalPrice: () => number;
  // Additional properties for checkout
  items: CartItem[];
  isLoading: boolean;
  subtotal: number;
  discount: number;
  giftCardAmount: number;
  coupon: any;
  giftCard: any;
  setCoupon: (coupon: any) => void;
  setGiftCard: (giftCard: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState<any>(null);
  const [giftCard, setGiftCard] = useState<any>(null);
  const { toast } = useToast();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item: Omit<CartItem, 'id' | 'quantity' | 'user_id'>, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.product_id === item.product_id);
      
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.product_id === item.product_id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity, id: item.product_id }];
      }
    });

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product_id !== productId));
    
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const updateCartItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prevCart => prevCart.filter(item => item.id !== id));
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const totalItems = getTotalItems;
  const totalPrice = getTotalPrice;

  // Calculate values for checkout
  const subtotal = getTotalPrice();
  const discount = coupon ? coupon.discount || 0 : 0;
  const giftCardAmount = giftCard ? giftCard.amount || 0 : 0;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      clearCart,
      getTotalItems,
      getTotalPrice,
      totalItems,
      totalPrice,
      items: cart,
      isLoading,
      subtotal,
      discount,
      giftCardAmount,
      coupon,
      giftCard,
      setCoupon,
      setGiftCard
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
