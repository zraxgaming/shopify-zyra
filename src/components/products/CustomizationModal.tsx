
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/components/cart/CartProvider';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  slug: string;
}

interface CustomizationModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  product,
  isOpen,
  onClose
}) => {
  const [customText, setCustomText] = useState('');
  const [customColor, setCustomColor] = useState('#000000');
  const [notes, setNotes] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const customizationData = {
      text: customText,
      color: customColor,
      notes: notes
    };

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.images[0] || '/placeholder-product.jpg',
      customization: customizationData
    }, 1);

    toast({
      title: "Custom Product Added",
      description: "Your customized product has been added to cart!",
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Customize {product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customText">Custom Text</Label>
              <Input
                id="customText"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                placeholder="Enter your custom text..."
                maxLength={50}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {customText.length}/50 characters
              </p>
            </div>

            <div>
              <Label htmlFor="customColor">Text Color</Label>
              <div className="flex gap-2 items-center">
                <Input
                  id="customColor"
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions..."
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">Preview</h3>
              <div className="relative">
                <img
                  src={product.images[0] || '/placeholder-product.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded"
                />
                {customText && (
                  <div
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ color: customColor }}
                  >
                    <span className="font-bold text-lg bg-white/80 px-2 py-1 rounded">
                      {customText}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={handleAddToCart} className="flex-1">
            Add to Cart
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
