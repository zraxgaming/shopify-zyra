
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface CouponFormProps {
  onCouponApply: (coupon: any) => void;
  onCouponRemove: () => void;
  appliedCoupon: any;
  orderTotal: number;
}

const CouponForm: React.FC<CouponFormProps> = ({ 
  onCouponApply, 
  onCouponRemove, 
  appliedCoupon, 
  orderTotal 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsApplying(true);
    // Simulate coupon validation
    setTimeout(() => {
      if (couponCode.toUpperCase() === 'SAVE10') {
        onCouponApply({
          code: couponCode,
          discount: orderTotal * 0.1,
          type: 'percentage'
        });
        toast({
          title: "Coupon Applied",
          description: "10% discount applied to your order!"
        });
      } else {
        toast({
          title: "Invalid Coupon",
          description: "The coupon code you entered is not valid.",
          variant: "destructive"
        });
      }
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Label>Coupon Code</Label>
      {appliedCoupon ? (
        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
          <span className="text-green-700 font-medium">{appliedCoupon.code}</span>
          <Button variant="ghost" size="sm" onClick={onCouponRemove}>
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
          />
          <Button 
            onClick={handleApplyCoupon}
            disabled={isApplying}
            variant="outline"
          >
            {isApplying ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponForm;
