import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import ShopifyProductCard from "@/components/shop/ShopifyProductCard";

interface FeaturedProductsProps {
  category?: string;
  limit?: number;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ limit = 4 }) => {
  const { data: products = [], isLoading, isError } = useShopifyProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(limit)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="aspect-square w-full" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isError) return <div className="text-destructive">Failed to load products.</div>;

  if (!products.length) {
    return <div className="text-muted-foreground text-center py-8">No products yet. Add products in your Shopify admin to display them here.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.slice(0, limit).map((p) => (
        <ShopifyProductCard key={p.node.id} product={p} />
      ))}
    </div>
  );
};

export default FeaturedProducts;
