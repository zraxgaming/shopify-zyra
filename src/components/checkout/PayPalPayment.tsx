
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";

interface PayPalPaymentProps {
  total: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

export const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  total,
  onSuccess,
  onError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalPayment = () => {
    setIsProcessing(true);
    // Simulate PayPal payment processing
    setTimeout(() => {
      onSuccess({ paymentId: 'paypal_' + Date.now(), amount: total });
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 border-blue-200 dark:border-blue-800">
      <CardContent className="p-6">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
            <CreditCard className="h-6 w-6" />
            <span className="font-semibold text-lg">PayPal</span>
          </div>

          <p className="text-gray-600 dark:text-gray-300">
            Pay securely with PayPal
          </p>

          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            ${total.toFixed(2)}
          </div>

          <Button
            onClick={handlePayPalPayment}
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with PayPal
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
