
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/components/cart/CartProvider';
import { Separator } from '@/components/ui/separator';

const OrderSummary: React.FC = () => {
  const { subtotal, discount, giftCardAmount, totalPrice } = useCart();
  
  const total = Math.max(0, subtotal - discount - giftCardAmount);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>AED {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-AED {discount.toFixed(2)}</span>
            </div>
          )}
          {giftCardAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Gift Card</span>
              <span>-AED {giftCardAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>AED {total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
