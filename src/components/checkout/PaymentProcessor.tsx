
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Smartphone, CreditCard } from "lucide-react";

interface PaymentProcessorProps {
  amount: number;
  orderData: any;
  onSuccess: (orderId: string) => void;
  onError: (error: string) => void;
  appliedCoupon?: any;
  appliedGiftCard?: any;
}

const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  orderData,
  onSuccess,
  onError,
  appliedCoupon,
  appliedGiftCard
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const finalAmount = Math.max(0, amount);

  const processZiinaPayment = async () => {
    setIsProcessing(true);
    try {
      // Get the current user's session token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('You must be logged in to complete payment');
      }

      // Call secure edge function for payment processing
      const { data, error } = await supabase.functions.invoke('process-ziina-payment', {
        body: {
          orderData: {
            ...orderData,
            origin: window.location.origin
          },
          amount: finalAmount,
          appliedCoupon,
          appliedGiftCard
        }
      });

      if (error) {
        throw new Error(error.message || 'Payment processing failed');
      }

      if (data.paymentUrl) {
        // Redirect to Ziina payment page
        window.location.href = data.paymentUrl;
      } else {
        throw new Error('No payment URL received');
      }
    } catch (error: any) {
      onError(error.message || 'Payment processing failed');
      toast({
        title: "Payment Error",
        description: error.message || 'Payment processing failed',
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-5 w-5 text-primary" />
          </div>
          Secure Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Total Amount</span>
            <span className="text-lg font-bold text-blue-900 dark:text-blue-100">
              {(finalAmount * 3.67).toFixed(2)} AED
            </span>
          </div>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Secure payment powered by Ziina
          </p>
        </div>
        
        <Button
          onClick={processZiinaPayment}
          disabled={isProcessing || finalAmount <= 0}
          className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Smartphone className="h-4 w-4 mr-2" />
              Pay {(finalAmount * 3.67).toFixed(2)} AED
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PaymentProcessor;
