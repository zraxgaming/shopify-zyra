import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Loader2, ShoppingCart, ArrowLeft, Minus, Plus } from "lucide-react";
import { useShopifyProducts } from "@/hooks/use-shopify-products";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/hooks/use-toast";
import SEOHead from "@/components/seo/SEOHead";
import ShopifyProductCard from "@/components/shop/ShopifyProductCard";

const ShopifyProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [], isLoading } = useShopifyProducts();
  const product = products.find((p) => p.node.handle === slug);
  const variants = product?.node.variants.edges.map((e) => e.node) || [];
  const options = product?.node.options || [];

  // Track selected option per option name.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Initialize selection on first render of the product.
  React.useEffect(() => {
    if (product && Object.keys(selectedOptions).length === 0) {
      const first = variants.find((v) => v.availableForSale) || variants[0];
      if (first) {
        const initial: Record<string, string> = {};
        first.selectedOptions.forEach((o) => (initial[o.name] = o.value));
        setSelectedOptions(initial);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return undefined;
    return (
      variants.find((v) =>
        v.selectedOptions.every((o) => selectedOptions[o.name] === o.value)
      ) || variants[0]
    );
  }, [variants, selectedOptions]);

  const images = product?.node.images.edges.map((e) => e.node) || [];
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const { toast } = useToast();

  const related = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.node.id !== product.node.id).slice(0, 4);
  }, [products, product]);

  const handleAdd = async () => {
    if (!product || !selectedVariant) return;
    setAdding(true);
    try {
      await addItem({
        product,
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title,
        price: selectedVariant.price,
        quantity,
        selectedOptions: selectedVariant.selectedOptions,
      });
      toast({ title: "Added to cart", description: product.node.title });
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <SEOHead
        title={product ? `${product.node.title} | Zyra` : "Product | Zyra"}
        description={product?.node.description?.slice(0, 160) || "Shop this product on Zyra."}
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-10">
          <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-foreground">Shop</Link>
            {product && (
              <>
                <span>/</span>
                <span className="text-foreground truncate">{product.node.title}</span>
              </>
            )}
          </nav>

          <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to shop
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin" /></div>
          ) : !product ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold">Product not found</h1>
              <Button asChild className="mt-4"><Link to="/shop">Go to shop</Link></Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                    {images[activeImage] && (
                      <img
                        src={images[activeImage].url}
                        alt={images[activeImage].altText || product.node.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-5 gap-2">
                      {images.map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`aspect-square rounded-md overflow-hidden border-2 ${
                            activeImage === i ? "border-primary" : "border-transparent"
                          }`}
                        >
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  <h1 className="text-3xl font-bold">{product.node.title}</h1>
                  <p className="text-2xl font-semibold">
                    {selectedVariant?.price.currencyCode}{" "}
                    {selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(2) : ""}
                  </p>

                  {product.node.description && (
                    <p className="text-muted-foreground whitespace-pre-line">{product.node.description}</p>
                  )}

                  {options.map((opt) =>
                    opt.values.length > 1 ? (
                      <div key={opt.name} className="space-y-2">
                        <label className="text-sm font-medium">{opt.name}</label>
                        <div className="flex flex-wrap gap-2">
                          {opt.values.map((v) => {
                            const isSelected = selectedOptions[opt.name] === v;
                            return (
                              <button
                                key={v}
                                type="button"
                                onClick={() => setSelectedOptions((p) => ({ ...p, [opt.name]: v }))}
                                className={`px-4 py-2 rounded-md border text-sm transition-colors ${
                                  isSelected
                                    ? "border-primary bg-primary text-primary-foreground"
                                    : "border-border hover:border-primary"
                                }`}
                              >
                                {v}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center">{quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => setQuantity((q) => q + 1)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAdd}
                    disabled={adding || !selectedVariant?.availableForSale}
                    size="lg"
                    className="w-full"
                  >
                    {adding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {related.length > 0 && (
                <section className="mt-16">
                  <h2 className="text-2xl font-bold mb-6">You might also like</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {related.map((p) => (
                      <ShopifyProductCard key={p.node.id} product={p} />
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default ShopifyProductDetail;
