
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CreditCard, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface DigitalPaymentMethodsProps {
  total: number;
  onPaymentSuccess: (orderId: string) => void;
  orderData: any;
  appliedCoupon?: any;
  appliedGiftCard?: any;
}

const DigitalPaymentMethods: React.FC<DigitalPaymentMethodsProps> = ({ 
  total, 
  onPaymentSuccess, 
  orderData,
  appliedCoupon,
  appliedGiftCard
}) => {
  const [selectedMethod, setSelectedMethod] = useState("ziina");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const finalTotal = Math.max(0, total || 0);

  const processPayment = async (method: string) => {
    setIsProcessing(true);
    try {
      // Create the order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: orderData.user_id,
          total_amount: finalTotal,
          status: 'pending',
          payment_status: 'pending',
          payment_method: method,
          shipping_address: orderData,
          billing_address: orderData
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Add order items
      if (orderData.items && orderData.items.length > 0) {
        const orderItems = orderData.items.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          customization: item.customization || null
        }));

        await supabase.from('order_items').insert(orderItems);
      }

      // Update coupon usage if applied
      if (appliedCoupon) {
        await supabase
          .from('coupons')
          .update({ used_count: appliedCoupon.used_count + 1 })
          .eq('id', appliedCoupon.id);
      }

      // Update gift card balance if applied
      if (appliedGiftCard) {
        const usedAmount = Math.min(appliedGiftCard.current_amount, finalTotal);
        await supabase
          .from('gift_cards')
          .update({ current_amount: appliedGiftCard.current_amount - usedAmount })
          .eq('id', appliedGiftCard.id);
      }

      // Process payment based on method
      if (method === 'ziina') {
        await processZiinaPayment(order.id);
      } else if (method === 'paypal') {
        await processPayPalPayment(order.id);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment failed",
        description: error.message || "Unable to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const processZiinaPayment = async (orderId: string) => {
    try {
      const { data: configData, error: configError } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'ziina_api_key')
        .single();

      if (configError || !configData?.value) {
        throw new Error('Ziina API configuration not found');
      }

      const payload = {
        amount: Math.round(finalTotal * 100),
        currency_code: 'AED',
        metadata: { order_id: orderId },
        success_url: `${window.location.origin}/order-success/${orderId}`,
        cancel_url: `${window.location.origin}/checkout`,
        failure_url: `${window.location.origin}/checkout`
      };

      const response = await fetch('https://api-v2.ziina.com/api/payment_intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${configData.value}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Ziina payment failed');
      }

      const ziinaData = await response.json();

      if (ziinaData.id) {
        await supabase
          .from('orders')
          .update({ payment_intent_id: ziinaData.id })
          .eq('id', orderId);
      }

      if (ziinaData.payment_url || ziinaData.redirect_url) {
        window.location.href = ziinaData.payment_url || ziinaData.redirect_url;
      } else {
        throw new Error('No redirect URL received from Ziina');
      }
    } catch (error: any) {
      throw error;
    }
  };

  const processPayPalPayment = async (orderId: string) => {
    try {
      const paypalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      
      if (!paypalClientId) {
        throw new Error('PayPal configuration not found');
      }

      // Simulate PayPal payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          payment_status: 'paid'
        })
        .eq('id', orderId);

      toast({
        title: "Payment Successful",
        description: "Your PayPal payment has been processed successfully",
      });

      onPaymentSuccess(orderId);
    } catch (error: any) {
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Digital Product Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
          Digital products require online payment only. Cash on delivery is not available.
        </div>

        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="ziina" id="ziina" />
            <Label htmlFor="ziina" className="flex items-center gap-2 cursor-pointer flex-1">
              <Smartphone className="h-4 w-4" />
              Ziina Payment (AED {(finalTotal * 3.67).toFixed(2)})
            </Label>
          </div>

          <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2 cursor-pointer flex-1">
              <CreditCard className="h-4 w-4" />
              PayPal (${finalTotal.toFixed(2)} USD)
            </Label>
          </div>
        </RadioGroup>

        <Button 
          onClick={() => processPayment(selectedMethod)}
          disabled={isProcessing}
          className="w-full"
          size="lg"
        >
          {isProcessing ? "Processing Payment..." : 
            `Pay ${selectedMethod === 'ziina' 
              ? `AED ${(finalTotal * 3.67).toFixed(2)}` 
              : `$${finalTotal.toFixed(2)}`} with ${selectedMethod === 'ziina' ? 'Ziina' : 'PayPal'}`
          }
        </Button>

        <div className="pt-4 border-t">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>AED {(finalTotal * 3.67).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalPaymentMethods;
