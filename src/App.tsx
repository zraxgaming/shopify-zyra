import React from "react";
import { Route, Routes } from "react-router-dom";
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

function App() {
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
                    
                    {/* 404 Not Found Route - Must be last */}
                    <Route path="*" element={<NotFound />} />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
