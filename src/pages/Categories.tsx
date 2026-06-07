import React from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Grid, ArrowRight } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { useShopifyCollections } from "@/hooks/use-shopify-collections";

const Categories = () => {
  const { data: collections = [], isLoading } = useShopifyCollections();

  return (
    <>
      <SEOHead
        title="Collections | Zyra"
        description="Browse all Shopify collections at Zyra."
      />
      <Navbar />
      <div className="min-h-screen bg-background">
        <Container className="py-16">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Collections</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse all of our collections, organized for easy discovery.
            </p>
          </header>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : collections.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No collections yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {collections.map((c) => (
                <Link key={c.id} to={`/category/${c.handle}`} className="group">
                  <Card className="overflow-hidden h-full transition-all group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="aspect-video bg-muted overflow-hidden">
                      {c.image?.url ? (
                        <img
                          src={c.image.url}
                          alt={c.image.altText || c.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Grid className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
                      {c.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.description}</p>
                      )}
                      <span className="inline-flex items-center text-primary font-medium text-sm">
                        Shop collection
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Categories;
