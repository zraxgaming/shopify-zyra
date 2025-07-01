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
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProducts from "@/pages/admin/AdminProducts";
import AdminOrders from "@/pages/admin/AdminOrders";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminProductDetails from "@/pages/admin/AdminProductDetails";
import AdminOrderDetails from "@/pages/admin/AdminOrderDetails";
import ProductDetails from "@/pages/ProductDetails";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminCoupons from "@/pages/admin/AdminCoupons";
import AdminGiftCards from "@/pages/admin/AdminGiftCards";
import AdminReviews from "@/pages/admin/AdminReviews";
import AdminBlogs from "@/pages/admin/AdminBlogs";
import AdminFaqs from "@/pages/admin/AdminFaqs";
import AdminContacts from "@/pages/admin/AdminContacts";
import AdminNewsletter from "@/pages/admin/AdminNewsletter";
import AdminAppearance from "@/pages/admin/AdminAppearance";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import OrderDetail from "@/components/user/OrderDetail";
import AdminRefunds from "@/pages/admin/AdminRefunds";

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
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/product-details/:slug" element={<ProductDetails />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                    <Route path="/offline" element={<Offline />} />
                    <Route path="/order-success/:orderId" element={<Success />} />

                    {/* Admin Routes - Example with Layout */}
                    <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
                    <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
                    <Route path="/admin/products/:id" element={<AdminLayout><AdminProductDetails /></AdminLayout>} />
                    <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
                    <Route path="/admin/orders/:id" element={<AdminLayout><AdminOrderDetails /></AdminLayout>} />
                    <Route path="/admin/refunds" element={<AdminLayout><AdminRefunds /></AdminLayout>} />
                    <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
                    <Route path="/admin/categories" element={<AdminLayout><AdminCategories /></AdminLayout>} />
                    <Route path="/admin/coupons" element={<AdminLayout><AdminCoupons /></AdminLayout>} />
                    <Route path="/admin/gift-cards" element={<AdminLayout><AdminGiftCards /></AdminLayout>} />
                    <Route path="/admin/reviews" element={<AdminLayout><AdminReviews /></AdminLayout>} />
                    <Route path="/admin/blogs" element={<AdminLayout><AdminBlogs /></AdminLayout>} />
                    <Route path="/admin/faqs" element={<AdminLayout><AdminFaqs /></AdminLayout>} />
                    <Route path="/admin/contacts" element={<AdminLayout><AdminContacts /></AdminLayout>} />
                    <Route path="/admin/newsletter" element={<AdminLayout><AdminNewsletter /></AdminLayout>} />
                    <Route path="/admin/appearance" element={<AdminLayout><AdminAppearance /></AdminLayout>} />
                    <Route path="/admin/analytics" element={<AdminLayout><AdminAnalytics /></AdminLayout>} />
                    <Route path="/admin/settings" element={<AdminLayout><AdminSettings /></AdminLayout>} />

                    <Route path="/order/:id" element={<OrderDetail />} />
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
