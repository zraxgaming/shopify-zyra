import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowLeft } from "lucide-react";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";

const ShopifyProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading } = useShopifyProducts();
  const product = products.find((p) => p.node.handle === slug);
  const variants = product?.node.variants.edges.map((e) => e.node) || [];
  const [variantId, setVariantId] = useState<string>("");
  const selected = variants.find((v) => v.id === variantId) || variants[0];
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  const { toast } = useToast();

  const handleAdd = async () => {
    if (!product || !selected) return;
    setAdding(true);
    try {
      await addItem({
        product,
        variantId: selected.id,
        variantTitle: selected.title,
        price: selected.price,
        quantity: 1,
        selectedOptions: selected.selectedOptions || [],
      });
      toast({ title: "Added to cart", description: product.node.title });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-10">
          <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to shop
          </Link>
          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !product ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold">Product not found</h1>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-10">
              <div className="aspect-square rounded-lg overflow-hidden bg-secondary/20">
                {product.node.images.edges[0]?.node && (
                  <img
                    src={product.node.images.edges[0].node.url}
                    alt={product.node.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">{product.node.title}</h1>
                <p className="text-2xl font-semibold">
                  {selected?.price.currencyCode} {selected ? parseFloat(selected.price.amount).toFixed(2) : ""}
                </p>
                <p className="text-muted-foreground whitespace-pre-line">{product.node.description}</p>

                {variants.length > 1 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Variant</label>
                    <select
                      className="w-full border rounded-md px-3 py-2 bg-background"
                      value={selected?.id || ""}
                      onChange={(e) => setVariantId(e.target.value)}
                    >
                      {variants.map((v) => (
                        <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                          {v.title} {!v.availableForSale ? "(Sold out)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <Button onClick={handleAdd} disabled={adding || !selected?.availableForSale} size="lg" className="w-full">
                  {adding ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {selected?.availableForSale ? "Add to Cart" : "Sold Out"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ShopifyProductDetail;
