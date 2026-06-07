import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, Home, ExternalLink, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";

const Cart = () => {
  const navigate = useNavigate();
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode || "USD";

  const handleCheckout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <Container className="py-12">
          <div className="flex gap-3 mb-6">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            <Button variant="secondary" onClick={() => navigate("/shop")}>Shop</Button>
            <Button variant="secondary" onClick={() => navigate("/home")}>
              <Home className="h-4 w-4 mr-1" /> Home
            </Button>
          </div>
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 text-muted-foreground/40 mx-auto mb-8" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-lg text-muted-foreground mb-8">Add some Shopify products to get started.</p>
            <Button onClick={() => navigate("/shop")}>Continue Shopping</Button>
          </div>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <div className="flex gap-3 mb-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <Button variant="secondary" onClick={() => navigate("/shop")}>Shop</Button>
        </div>

        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center gap-4 p-6 border border-border rounded-lg bg-card"
              >
                <div className="w-20 h-20 bg-muted rounded-md overflow-hidden flex-shrink-0">
                  {item.product.node.images?.edges?.[0]?.node && (
                    <img
                      src={item.product.node.images.edges[0].node.url}
                      alt={item.product.node.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg truncate">{item.product.node.title}</h3>
                  {item.selectedOptions.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {item.selectedOptions.map((o) => `${o.name}: ${o.value}`).join(" • ")}
                    </p>
                  )}
                  <p className="text-muted-foreground">
                    {item.price.currencyCode} {parseFloat(item.price.amount).toFixed(2)} each
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center font-medium">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-lg">
                    {item.price.currencyCode} {(parseFloat(item.price.amount) * item.quantity).toFixed(2)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive mt-2"
                    onClick={() => removeItem(item.variantId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span>{totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{currency} {subtotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes are calculated at Shopify checkout.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full"
                  size="lg"
                  disabled={isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Checkout with Shopify
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => navigate("/shop")}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default Cart;
