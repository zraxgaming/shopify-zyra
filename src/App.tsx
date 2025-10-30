import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/components/cart/CartProvider";
import { WishlistProvider } from "@/contexts/WishlistContext";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import ProductDetail from "@/pages/ProductDetail";
import Categories from "@/pages/Categories";
import FAQ from "@/pages/FAQ";
import Contact from "@/pages/Contact";
import Auth from "@/pages/Auth";
import Account from "@/pages/Account";
import Checkout from "@/pages/Checkout";
import Success from "@/pages/Success";
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
import GiftCards from "@/pages/GiftCards";
import Referrals from "@/pages/Referrals";
import CategoryPage from "@/pages/CategoryPage";
import NotFound from "@/pages/NotFound";
import Dashboard from "@/pages/Dashboard";
import Products from "@/pages/Products";
import ProductCustomizer from "@/pages/ProductCustomizer";
import Unsubscribe from "@/pages/Unsubscribe";
import OrderConfirmation from "@/pages/OrderConfirmation";
import OrderFailed from "@/pages/OrderFailed";
// Admin pages removed from the public SPA; Shopify provides its own admin.
// The admin pages/components are kept in the repository if needed, but are
// intentionally not imported or routed here to avoid exposing them in the
// storefront bundle.
import ProductDetails from "@/pages/ProductDetails";
import OrderDetail from "@/components/user/OrderDetail";
// Admin imports intentionally omitted

const queryClient = new QueryClient();

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <AuthProvider>
              <CartProvider>
                <WishlistProvider>
                  <Toaster />
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/product-details/:slug" element={<ProductDetails />} />
                    <Route path="/customize/:productId" element={<ProductCustomizer />} />
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
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/unsubscribe" element={<Unsubscribe />} />
                    <Route path="/offline" element={<Offline />} />
                    <Route path="/order-tracking" element={<OrderTracking />} />
                    <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="/order-failed/:orderId" element={<OrderFailed />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/gift-cards" element={<GiftCards />} />
                    <Route path="/referrals" element={<Referrals />} />
                    <Route path="/order-success/:orderId" element={<Success />} />

                    {/* Admin routes removed from storefront - use Shopify admin instead. */}

                    <Route path="/order/:id" element={<OrderDetail />} />
                    
                    {/* 404 Not Found Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </WishlistProvider>
              </CartProvider>
            </AuthProvider>
          </Router>
        </ThemeProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
