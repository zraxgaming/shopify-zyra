import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, ExternalLink, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const OrderTracking = () => {
  const { customer, orders } = useAuth();
  const [query, setQuery] = useState("");

  const filtered = orders.filter(
    (o) =>
      !query.trim() ||
      o.name.toLowerCase().includes(query.toLowerCase()) ||
      String(o.orderNumber).includes(query.trim())
  );

  return (
    <>
      <Navbar />
      <Container className="py-12 max-w-3xl">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-muted-foreground">
            {customer
              ? "Search by order number, or open Shopify tracking for live status."
              : "Sign in to view and track all your Shopify orders."}
          </p>
        </header>

        {!customer ? (
          <Card>
            <CardContent className="p-10 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <p className="mb-4 text-muted-foreground">
                Please sign in to view your orders.
              </p>
              <Button asChild>
                <Link to="/auth">Sign in</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" /> Find your order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="Search by order number, e.g. 1001 or #1001"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </CardContent>
            </Card>

            {filtered.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  No matching orders found.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filtered.map((o) => (
                  <Card key={o.id}>
                    <CardContent className="p-6 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{o.name}</span>
                          <Badge variant="outline">
                            {o.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(o.processedAt).toLocaleDateString()} •{" "}
                          {o.totalPrice.currencyCode} {parseFloat(o.totalPrice.amount).toFixed(2)}
                        </div>
                      </div>
                      <Button asChild variant="outline">
                        <a href={o.statusUrl} target="_blank" rel="noopener noreferrer">
                          Track <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default OrderTracking;
