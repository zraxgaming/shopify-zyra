import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useRef,
} from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define the types
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface CartItem {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  price: number;
  image_url: string;
  name?: string;
  customization?: Json;
  is_digital?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  items: CartItem[];
  addToCart: (
    product: Omit<CartItem, "id" | "quantity" | "user_id">,
    quantity: number,
    customization?: Json
  ) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateCartItem: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: () => number;
  totalPrice: () => number;
  isLoading: boolean;
  subtotal: number;
  discount: number;
  giftCardAmount: number;
  setCoupon: (coupon: any) => void;
  setGiftCard: (giftCard: any) => void;
  coupon: any;
  giftCard: any;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setCoupon] = useState<any>(null);
  const [giftCard, setGiftCard] = useState<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    const poll = () => {
      if (user) {
        loadCartFromDb();
      }
    };
    if (user) {
      loadCartFromDb();
      intervalRef.current = setInterval(poll, 5000);
    } else {
      setCart([]);
      setCoupon(null);
      setGiftCard(null);
    }
    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [user]);

  // always ensure customization is loaded/saved properly
  const loadCartFromDb = async () => {
    setIsLoading(true);
    try {
      const { data: dbCart, error } = await supabase
        .from("cart_items")
        .select("*, product:is_digital") // join product for is_digital
        .eq("user_id", user?.id);
      if (!error && dbCart) {
        setCart(
          dbCart.map((item: any) => ({
            ...item,
            price: typeof item.price === "number" ? item.price : 0,
            image_url: typeof item.image_url === "string" ? item.image_url : "",
            name: typeof item.name === "string" ? item.name : "",
            customization: item.customization ?? {},
            is_digital: typeof item.is_digital === 'boolean' ? item.is_digital : (item.product?.is_digital ?? false),
          }))
        );
      } else if (error) {
        toast({
          title: "Cart Load Error",
          description: error.message || "Failed to load cart from server.",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Error loading cart from database:", err);
      toast({
        title: "Cart Load Error",
        description: err.message || "Failed to load cart from server.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (
    product,
    quantity,
    customization = {}
  ) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    // Digital/physical product cart rules
    const isDigital = product.is_digital;
    const cartHasDigital = cart.some(item => item.is_digital);
    const cartHasPhysical = cart.some(item => !item.is_digital);
    if (isDigital && cartHasPhysical) {
      toast({
        title: "Cart Rule",
        description: "Digital products can only be bought with other digital products.",
        variant: "destructive",
      });
      return;
    }
    if (!isDigital && cartHasDigital) {
      toast({
        title: "Cart Rule",
        description: "Physical products cannot be added to a cart with digital products.",
        variant: "destructive",
      });
      return;
    }
    // Check product stock from Supabase directly for freshness
    let productRes = await supabase
      .from("products")
      .select("id, stock_quantity")
      .eq("id", product.product_id)
      .maybeSingle();

    const maxStock =
      typeof productRes.data?.stock_quantity === "number"
        ? productRes.data?.stock_quantity
        : 99;

    // Check how much is in cart for this customization
    const itemInCart = cart.find(
      (item) =>
        item.product_id === product.product_id &&
        JSON.stringify(item.customization || {}) ===
          JSON.stringify(customization || {})
    );
    const cartQty = itemInCart ? itemInCart.quantity : 0;
    const totalDesired = cartQty + quantity;

    if (totalDesired > maxStock) {
      toast({
        title: "Stock Limit",
        description: "Cannot add more than available stock.",
        variant: "destructive",
      });
      return;
    }
    if (
      product.name?.toLowerCase().includes("custom") &&
      (!customization || Object.keys(customization).length === 0)
    ) {
      toast({
        title: "Customization Required",
        description: "Please provide customization details for this product.",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert([
          {
            product_id: product.product_id,
            user_id: user.id,
            quantity: quantity,
            price: product.price,
            image_url: product.image_url,
            name: product.name,
            customization: customization,
          },
        ])
        .select()
        .single();
      if (error) {
        toast({
          title: "Add to Cart Failed",
          description: error.message || "Could not add item to cart.",
          variant: "destructive",
        });
        return;
      }
      setCart((prevCart) => [
        ...prevCart,
        {
          ...data,
          price: data.price || 0,
          image_url: data.image_url || "",
          name: data.name || "",
          customization: data.customization ?? {},
          is_digital: typeof product.is_digital === 'boolean' ? product.is_digital : false,
        }
      ]);
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast({
        title: "Add to Cart Failed",
        description: err.message || "Could not add item to cart.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = async (id: string) => {
    try {
      const { error } = await supabase.from("cart_items").delete().eq("id", id);
      if (error) {
        toast({
          title: "Remove from Cart Failed",
          description: error.message || "Could not remove item from cart.",
          variant: "destructive",
        });
        return;
      }
      setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Error removing from cart:", err);
      toast({
        title: "Remove from Cart Failed",
        description: err.message || "Could not remove item from cart.",
        variant: "destructive",
      });
    }
  };

  const updateCartItem = async (id: string, quantity: number) => {
    try {
      const item = cart.find((it) => it.id === id);
      if (!item) return;
      // Fetch latest product stock
      let productRes = await supabase
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .maybeSingle();
      const maxStock =
        typeof productRes.data?.stock_quantity === "number"
          ? productRes.data?.stock_quantity
          : 99;
      if (quantity > maxStock) {
        toast({
          title: "Stock Limit",
          description: "Cannot set quantity above available stock.",
          variant: "destructive",
        });
        return;
      }
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("id", id);
      if (error) {
        toast({
          title: "Update Cart Failed",
          description: error.message || "Could not update cart item.",
          variant: "destructive",
        });
        return;
      }
      setCart((prevCart) =>
        prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    } catch (err) {
      console.error("Error updating cart item:", err);
      toast({
        title: "Update Cart Failed",
        description: err.message || "Could not update cart item.",
        variant: "destructive",
      });
    }
  };

  const clearCart = async () => {
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user?.id);
      if (error) {
        toast({
          title: "Clear Cart Failed",
          description: error.message || "Could not clear cart.",
          variant: "destructive",
        });
        return;
      }
      setCart([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
      toast({
        title: "Clear Cart Failed",
        description: err.message || "Could not clear cart.",
        variant: "destructive",
      });
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const discount = coupon
    ? coupon.discount_type === "percentage"
      ? subtotal * coupon.discount_value / 100
      : coupon.discount_value
    : 0;
  const giftCardAmount = giftCard ? Math.min(giftCard.amount, subtotal - discount) : 0;
  const totalCartPrice = () => subtotal - discount - giftCardAmount;

  const totalItems = () => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  };

  const value: CartContextType = {
    cart,
    items: cart,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    totalItems,
    totalPrice: totalCartPrice,
    isLoading,
    subtotal,
    discount,
    giftCardAmount,
    setCoupon,
    setGiftCard,
    coupon,
    giftCard,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export { CartProvider, useCart };

// ... NOTE: This file is getting long, consider refactoring if more cart logic is needed!
