import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Grid, Loader2 } from "lucide-react";
import { useShopifyCollections } from "@/hooks/use-shopify-collections";

const Categories = () => {
  const { data: collections = [], isLoading } = useShopifyCollections();
  const display = collections.slice(0, 4);

  if (isLoading) {
    return (
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Shop By Collection</h2>
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
        </div>
      </section>
    );
  }

  if (display.length === 0) return null;

  return (
    <section className="bg-muted/30 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Shop By Collection</h2>
          <p className="mt-2 text-muted-foreground">Find your favorites by category</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {display.map((c, i) => (
            <Link
              key={c.id}
              to={`/category/${c.handle}`}
              className="group bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="aspect-square overflow-hidden bg-muted">
                {c.image?.url ? (
                  <img
                    src={c.image.url}
                    alt={c.image.altText || c.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Grid className="h-12 w-12 text-muted-foreground/40" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold">{c.title}</h3>
                {c.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                )}
                <div className="mt-4 inline-flex items-center text-primary font-medium text-sm">
                  Shop now
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
