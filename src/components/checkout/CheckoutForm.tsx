
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import BackendEmailService from "@/services/backendEmailService";
import AddressForm from "./AddressForm";
import PaymentMethods from "./PaymentMethods";
import DigitalPaymentMethods from "./DigitalPaymentMethods";

const CheckoutForm = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  const hasDigitalItems = items.some(item => item.is_digital);
  const hasPhysicalItems = items.some(item => !item.is_digital);
  const isDigitalOnly = hasDigitalItems && !hasPhysicalItems;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Payment Method Required",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    // Digital products require PayPal or Ziina
    if (hasDigitalItems && !['paypal', 'ziina'].includes(paymentMethod)) {
      toast({
        title: "Invalid Payment Method",
        description: "Digital products can only be purchased with PayPal or Ziina",
        variant: "destructive",
      });
      return;
    }

    if (!isDigitalOnly && !shippingAddress) {
      toast({
        title: "Shipping Address Required",
        description: "Please provide a shipping address",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          total_amount: totalPrice,
          currency: "USD",
          payment_method: paymentMethod,
          payment_status: "pending",
          status: "pending",
          shipping_address: isDigitalOnly ? null : shippingAddress,
          delivery_type: isDigitalOnly ? "digital" : "standard",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
        customization: item.customization,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Send confirmation email
      const userProfile = await supabase
        .from('profiles')
        .select('email, first_name, last_name')
        .eq('id', user.id)
        .single();

      const userEmail = userProfile.data?.email || user.email;
      const userName = userProfile.data?.first_name || 'Customer';

      if (userEmail) {
        // Prepare order items for the email
        const orderItems = items.map(item => ({
          name: item.name,
          quantity: item.quantity || 1,
          price: item.price
        }));

        const result = await BackendEmailService.sendOrderConfirmation(
          order.id.slice(0, 8), // Use short order number
          userName,
          userEmail,
          orderItems,
          totalPrice,
          isDigitalOnly ? undefined : shippingAddress?.formatted_address
        );

        if (!result.success) {
          console.error('Failed to send order confirmation email:', result.error);
        }
      }

      await clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Order #${order.id.slice(0, 8)} has been created`,
      });

      // For digital products, redirect to digital download page
      if (isDigitalOnly) {
        navigate(`/order-confirmation/${order.id}?digital=true`);
      } else {
        navigate(`/order-confirmation/${order.id}`);
      }

    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Order Failed",
        description: error.message || "Failed to process order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Your cart is empty</p>
          <Button 
            onClick={() => navigate('/shop')} 
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {!isDigitalOnly && (
          <AddressForm 
            shippingInfo={shippingAddress || {
              firstName: '', lastName: '', email: '', phone: '',
              address: '', city: '', state: '', zipCode: '', country: ''
            }}
            onShippingInfoChange={(field, value) => 
              setShippingAddress(prev => ({ ...prev, [field]: value }))
            }
          />
          )}
          
          {isDigitalOnly ? (
            <DigitalPaymentMethods 
              total={totalPrice}
              onPaymentSuccess={(orderId) => navigate(`/order-confirmation/${orderId}`)}
              orderData={{
                user_id: user?.id,
                items: items,
                ...shippingAddress
              }}
            />
          ) : (
            <PaymentMethods 
              total={totalPrice}
              onPaymentSuccess={(orderId) => navigate(`/order-confirmation/${orderId}`)}
              orderData={{
                user_id: user?.id,
                items: items,
                ...shippingAddress
              }}
            />
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={item.image_url || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                        {item.is_digital && (
                          <span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Digital
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? "Processing..." : `Place Order - $${totalPrice.toFixed(2)}`}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
