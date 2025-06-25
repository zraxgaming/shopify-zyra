import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import { useAuth } from "@/contexts/AuthContext";
import { PayPalPayment } from "@/components/checkout/PayPalPayment";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import ZiinaPayment from "@/components/checkout/ZiinaPayment";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export default function EnhancedCheckoutForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const { cart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const finalTotal = getTotalPrice();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setFormError("");

    try {
      // Simulate order submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart and set success state
      clearCart();
      setOrderSuccess(true);
      toast({
        title: "Order Submitted",
        description: "Your order has been successfully submitted!",
      });
      navigate('/order-success');
    } catch (error: any) {
      console.error("Order submission error:", error);
      setFormError("Failed to submit order. Please try again.");
      toast({
        title: "Order Submission Failed",
        description: "There was an error submitting your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    console.log("Payment successful:", paymentResult);
    toast({
      title: "Payment Successful",
      description: "Thank you for your order!",
    });
    clearCart();
    setOrderSuccess(true);
    navigate('/order-success');
  };

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error);
    setFormError("Payment failed. Please try again.");
    toast({
      title: "Payment Failed",
      description: "There was an error processing your payment. Please try again.",
      variant: "destructive",
    });
  };

  const renderPaymentMethods = () => {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <div className="grid gap-4">
          {/* Ziina Payment */}
          <div className="border rounded-lg p-4">
            <ZiinaPayment
              amount={finalTotal}
              orderData={{
                user_id: user?.id,
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                phone: formData.phone,
                shipping_address: formData,
                billing_address: formData,
                items: cart,
                notes: `Order from ${formData.email}`
              }}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>

          {/* PayPal Payment */}
          <div className="border rounded-lg p-4">
            <PayPalPayment
              total={finalTotal}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>

        {orderSuccess ? (
          <div className="text-center text-green-500">
            <CheckCircle2 className="mx-auto h-12 w-12 mb-4" />
            <p className="text-lg font-semibold">Order successfully placed!</p>
            {/* You can add more details or a link to order history here */}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {formError && (
              <div className="text-red-500 flex items-center gap-2 bg-red-100 border border-red-400 rounded-md p-3">
                <AlertTriangle className="h-4 w-4" />
                {formError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
            </div>

            <Separator />

            {renderPaymentMethods()}

            <Button disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Submitting Order..." : "Submit Order"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
