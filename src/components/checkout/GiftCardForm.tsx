
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface GiftCardFormProps {
  onGiftCardApply: (giftCard: any) => void;
  onGiftCardRemove: () => void;
  appliedGiftCard: any;
  orderTotal: number;
}

const GiftCardForm: React.FC<GiftCardFormProps> = ({ 
  onGiftCardApply, 
  onGiftCardRemove, 
  appliedGiftCard, 
  orderTotal 
}) => {
  const [giftCardCode, setGiftCardCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const { toast } = useToast();

  const handleApplyGiftCard = async () => {
    if (!giftCardCode.trim()) return;

    setIsApplying(true);
    // Simulate gift card validation
    setTimeout(() => {
      if (giftCardCode.toUpperCase() === 'GIFT50') {
        onGiftCardApply({
          code: giftCardCode,
          amount: Math.min(50, orderTotal)
        });
        toast({
          title: "Gift Card Applied",
          description: `AED ${Math.min(50, orderTotal)} gift card applied!`
        });
      } else {
        toast({
          title: "Invalid Gift Card",
          description: "The gift card code you entered is not valid.",
          variant: "destructive"
        });
      }
      setIsApplying(false);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      <Label>Gift Card</Label>
      {appliedGiftCard ? (
        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
          <span className="text-blue-700 font-medium">{appliedGiftCard.code}</span>
          <Button variant="ghost" size="sm" onClick={onGiftCardRemove}>
            Remove
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            value={giftCardCode}
            onChange={(e) => setGiftCardCode(e.target.value)}
            placeholder="Enter gift card code"
          />
          <Button 
            onClick={handleApplyGiftCard}
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

export default GiftCardForm;
