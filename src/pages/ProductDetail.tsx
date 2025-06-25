
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product as ProductType } from "@/types/product";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/components/cart/CartProvider";
import { Separator } from "@/components/ui/separator";
import { Info, ChevronLeft, Star, ShoppingCart, Plus, Minus, Settings } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Skeleton } from "@/components/ui/skeleton";
import ProductReviews from "@/components/reviews/ProductReviews";

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { toast } = useToast();
  const { addToCart } = useCart();

  // Fetch product from Supabase
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .maybeSingle();
        if (error || !data) {
          setProduct(null);
        } else {
          // Ensure images type and a fallback
          const safeImages: string[] = Array.isArray(data.images)
            ? data.images.filter((img): img is string => typeof img === "string")
            : [];
          setProduct({ ...data, images: safeImages });
          setSelectedImage(safeImages[0] || "/placeholder-product.jpg");
        }
      } catch (e) {
        setProduct(null);
        toast({ title: "Error", description: "Could not load product.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchProduct();
  }, [slug, toast]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(
        {
          product_id: product.id,
          name: product.name,
          price: product.price,
          image_url: selectedImage ?? "/placeholder-product.jpg",
        },
        quantity
      );
      toast({ title: "Added to cart!", description: `${quantity} ${product.name} added!` });
    }
  };

  // Handle customize - navigate to customizer page
  const handleCustomize = () => {
    if (product) {
      navigate(`/customize/${product.id}`);
    }
  };

  // ----------- Layout Starts Here -----------
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-square rounded-lg" />
            <div>
              <Skeleton className="h-10 w-2/3 mb-4" />
              <Skeleton className="h-6 w-1/3 mb-4" />
              <Skeleton className="h-6 w-1/2" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-24 flex flex-col items-center text-center min-h-[40vh]">
          <Info className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-3xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">Sorry, we couldn't find the product you're looking for.</p>
          <Link to="/shop">
            <Button><ChevronLeft className="mr-2 h-4 w-4" />Back to Shop</Button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const productImages: string[] = Array.isArray(product.images)
    ? product.images
    : [];

  // ----------- Actual product detail layout -----------
  return (
    <>
      <SEOHead
        title={`${product.name} | Zyra Custom Craft`}
        description={product.meta_description || product.short_description || ""}
        url={`https://shopzyra.vercel.app/product/${product.slug}`}
        image={selectedImage || productImages[0]}
      />
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden shadow-lg bg-muted/20 rounded-2xl">
              <AspectRatio ratio={1}>
                <img
                  src={selectedImage || productImages[0] || "/placeholder-product.jpg"}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </AspectRatio>
            </Card>
            {productImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 focus:outline-none transition-all ${
                      selectedImage === img ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedImage(img)}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="object-cover w-full h-full rounded-md" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {product.is_new && <Badge className="bg-green-500 text-white">New</Badge>}
                {product.is_featured && <Badge className="bg-purple-600 text-white">Featured</Badge>}
                {!product.in_stock && <Badge variant="destructive">Out of Stock</Badge>}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gradient bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= (product.rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating?.toFixed(1)} ({product.review_count || 0} reviews)
                </span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-3xl lg:text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </span>
                {product.discount_percentage > 0 && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${(product.price / (1 - Number(product.discount_percentage) / 100)).toFixed(2)}
                  </span>
                )}
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.short_description}
              </p>
            </div>

            <Separator />

            {/* Customization Notice */}
            {product.is_customizable && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-purple-200 dark:border-purple-800">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <Settings className="h-6 w-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200">
                      Fully Customizable Product
                    </h3>
                  </div>
                  <p className="text-purple-700 dark:text-purple-300 mb-4">
                    Make this product uniquely yours! Add custom text, images, colors, and more.
                  </p>
                  <Button 
                    onClick={handleCustomize}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Start Customizing
                  </Button>
                </div>
              </Card>
            )}

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <label className="font-medium">Quantity:</label>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => q + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                {product.is_customizable ? (
                  <Button
                    size="lg"
                    onClick={handleCustomize}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold h-12"
                    disabled={!product.in_stock}
                  >
                    <Settings className="mr-2 h-5 w-5" />
                    {product.in_stock ? "Customize & Order" : "Out of Stock"}
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold h-12"
                    disabled={!product.in_stock}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.in_stock ? "Add to Cart" : "Out of Stock"}
                  </Button>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>SKU:</strong> {product.sku || "N/A"}</p>
              <p><strong>Category:</strong> {product.category || "Uncategorized"}</p>
              {product.stock_quantity && (
                <p><strong>In Stock:</strong> {product.stock_quantity} units available</p>
              )}
            </div>
          </div>
        </div>

        {/* Product Description */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Product Description</h2>
          <div
            className="prose dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: product.description || "No detailed description available.",
            }}
          />
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <ProductReviews productId={product.id} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
