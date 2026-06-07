import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart } from "lucide-react";
import type { ShopifyProduct } from "@/services/shopifyService";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";

interface Props {
  product: ShopifyProduct;
}

const ShopifyProductCard: React.FC<Props> = ({ product }) => {
  const node = product.node;
  const image = node.images.edges[0]?.node;
  const variant = node.variants.edges[0]?.node;
  const price = node.priceRange.minVariantPrice;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!variant) return;
    setAdding(true);
    try {
      await addItem({
        product,
        variantId: variant.id,
        variantTitle: variant.title,
        price: variant.price,
        quantity: 1,
        selectedOptions: variant.selectedOptions || [],
      });
      toast({ title: "Added to cart", description: node.title });
    } finally {
      setAdding(false);
    }
  };

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
      <Link to={`/product/${node.handle}`} className="block">
        <div className="aspect-square bg-secondary/20 overflow-hidden">
          {image && (
            <img
              src={image.url}
              alt={image.altText || node.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
        </div>
      </Link>
      <CardContent className="p-4 space-y-3">
        <Link to={`/product/${node.handle}`}>
          <h3 className="font-semibold truncate hover:text-primary">{node.title}</h3>
        </Link>
        <p className="text-lg font-bold">
          {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
        </p>
        <Button onClick={handleAdd} disabled={adding || isLoading || !variant?.availableForSale} className="w-full">
          {adding ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <ShoppingCart className="w-4 h-4 mr-2" />
              {variant?.availableForSale ? "Add to Cart" : "Sold Out"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ShopifyProductCard;
