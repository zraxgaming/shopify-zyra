// Shopify-backed auth context. Keeps the same API as the previous Supabase-based
// AuthContext so existing components (which read user.id, user.email,
// user.user_metadata, signIn/signUp/signOut) continue to work.
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  shopifyLogin,
  shopifyRegister,
  shopifyLogout,
  shopifyFetchCustomer,
  ShopifyCustomer,
  ShopifyOrder,
} from "@/services/shopifyCustomer";

const TOKEN_KEY = "shopify_customer_token";

interface StoredToken {
  accessToken: string;
  expiresAt: string;
}

// Shape kept compatible with previous Supabase user usage.
interface CompatUser {
  id: string;
  email: string;
  user_metadata: { first_name?: string; last_name?: string; full_name?: string };
  customer: ShopifyCustomer;
}

interface AuthContextType {
  user: CompatUser | null;
  customer: ShopifyCustomer | null;
  orders: ShopifyOrder[];
  accessToken: string | null;
  loading: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readToken(): StoredToken | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredToken;
    if (new Date(parsed.expiresAt).getTime() <= Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function toCompatUser(customer: ShopifyCustomer): CompatUser {
  return {
    id: customer.id,
    email: customer.email,
    user_metadata: {
      first_name: customer.firstName ?? undefined,
      last_name: customer.lastName ?? undefined,
      full_name: customer.displayName,
    },
    customer,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customer, setCustomer] = useState<ShopifyCustomer | null>(null);
  const [orders, setOrders] = useState<ShopifyOrder[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const stored = readToken();
    if (!stored) {
      setCustomer(null);
      setOrders([]);
      setAccessToken(null);
      return;
    }
    setAccessToken(stored.accessToken);
    try {
      const result = await shopifyFetchCustomer(stored.accessToken);
      if (result) {
        setCustomer(result.customer);
        setOrders(result.orders);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setCustomer(null);
        setOrders([]);
        setAccessToken(null);
      }
    } catch (e) {
      console.error("Failed to fetch Shopify customer", e);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await refresh();
      setLoading(false);
    })();
  }, [refresh]);

  const signIn = async (email: string, password: string) => {
    const token = await shopifyLogin(email, password);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    setAccessToken(token.accessToken);
    await refresh();
  };

  const signUp = async (email: string, password: string, metadata?: { first_name?: string; last_name?: string }) => {
    await shopifyRegister({
      email,
      password,
      firstName: metadata?.first_name,
      lastName: metadata?.last_name,
    });
    // After successful registration, sign the user in automatically.
    const token = await shopifyLogin(email, password);
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    setAccessToken(token.accessToken);
    await refresh();
  };

  const signOut = async () => {
    if (accessToken) await shopifyLogout(accessToken);
    localStorage.removeItem(TOKEN_KEY);
    setCustomer(null);
    setOrders([]);
    setAccessToken(null);
  };

  const user = customer ? toCompatUser(customer) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        customer,
        orders,
        accessToken,
        loading,
        isLoading: loading,
        isAdmin: false,
        signIn,
        signUp,
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
