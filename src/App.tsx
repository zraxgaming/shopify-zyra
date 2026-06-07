import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ShopifyProductDetail";
import { useCartSync } from "@/hooks/use-cart-sync";
import Categories from "@/pages/Categories";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Newsletter from "@/pages/Newsletter";
import Offline from "@/pages/Offline";
import About from "@/pages/About";
import OrderTracking from "@/pages/OrderTracking";
import Terms from "@/pages/Terms";
import Privacy from "@/pages/Privacy";
import Profile from "@/pages/Profile";
import Wishlist from "@/pages/Wishlist";
import Cart from "@/pages/Cart";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Unsubscribe from "@/pages/Unsubscribe";

function App() {
  useCartSync();
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/account" element={<Account />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/newsletter" element={<Newsletter />} />
              <Route path="/unsubscribe" element={<Unsubscribe />} />
              <Route path="/offline" element={<Offline />} />
              <Route path="/order-tracking" element={<OrderTracking />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
