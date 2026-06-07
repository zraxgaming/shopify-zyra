import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { Badge } from "@/components/ui/badge";
import ShopifyProductGrid from "@/components/shop/ShopifyProductGrid";

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("featured");

  useEffect(() => {
    const urlSearch = searchParams.get("search");
    if (urlSearch) setSearchTerm(urlSearch);
  }, [searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) setSearchParams({ search: value.trim() });
    else setSearchParams({});
  };

  return (
    <>
      <SEOHead
        title="Shop | Zyra"
        description="Browse our latest products powered by Shopify."
        url="https://www.shopzyra.site/shop"
        image="https://www.shopzyra.site/icon-512.png"
        type="website"
      />
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-purple-500/10">
        <section className="relative py-16">
          <Container>
            <div className="text-center mb-12">
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-lg px-6 py-3" variant="outline">
                <Sparkles className="h-5 w-5 mr-3" />
                Shop Collection
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Shop All Products
              </h1>
            </div>
          </Container>
        </section>

        <Container className="py-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ShopifyProductGrid searchTerm={searchTerm} sortBy={sortBy} />
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default Shop;
