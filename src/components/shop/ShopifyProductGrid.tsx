import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Package } from "lucide-react";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import ShopifyProductCard from "./ShopifyProductCard";

interface Props {
  searchTerm?: string;
  sortBy?: string;
  priceRange?: [number, number];
}

const ShopifyProductGrid: React.FC<Props> = ({ searchTerm = "", sortBy = "featured", priceRange }) => {
  const { data: products = [], isLoading, isError } = useShopifyProducts();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-square rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return <div className="text-center py-12 text-muted-foreground">Failed to load products.</div>;
  }

  let filtered = products.filter((p) => {
    const matchesSearch =
      !searchTerm ||
      p.node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.node.description.toLowerCase().includes(searchTerm.toLowerCase());
    const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
    const matchesPrice = !priceRange || (price >= priceRange[0] && price <= priceRange[1]);
    return matchesSearch && matchesPrice;
  });

  filtered = [...filtered].sort((a, b) => {
    const pa = parseFloat(a.node.priceRange.minVariantPrice.amount);
    const pb = parseFloat(b.node.priceRange.minVariantPrice.amount);
    switch (sortBy) {
      case "price-low": return pa - pb;
      case "price-high": return pb - pa;
      case "name": return a.node.title.localeCompare(b.node.title);
      default: return 0;
    }
  });

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Package className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">No products found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filtered.map((p) => (
        <ShopifyProductCard key={p.node.id} product={p} />
      ))}
    </div>
  );
};

export default ShopifyProductGrid;
