import React from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import { useShopifyCollection } from "@/hooks/use-shopify-collections";
import ShopifyProductCard from "@/components/shop/ShopifyProductCard";
import SEOHead from "@/components/seo/SEOHead";

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: collection, isLoading } = useShopifyCollection(slug);

  return (
    <>
      <SEOHead
        title={collection ? `${collection.title} | Zyra` : "Collection | Zyra"}
        description={collection?.description || "Browse this Shopify collection."}
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-10">
          <Link to="/categories" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" /> All collections
          </Link>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : !collection ? (
            <div className="text-center py-20">
              <h1 className="text-2xl font-bold mb-4">Collection not found</h1>
              <Button asChild>
                <Link to="/shop">Go to shop</Link>
              </Button>
            </div>
          ) : (
            <>
              <header className="mb-10">
                <h1 className="text-4xl font-bold mb-3">{collection.title}</h1>
                {collection.description && (
                  <p className="text-muted-foreground max-w-2xl">{collection.description}</p>
                )}
              </header>

              {collection.products.length === 0 ? (
                <p className="text-center text-muted-foreground py-10">
                  No products in this collection yet.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {collection.products.map((p: any) => (
                    <ShopifyProductCard key={p.node.id} product={p} />
                  ))}
                </div>
              )}
            </>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default CategoryPage;
