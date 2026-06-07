import React from "react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { ExternalLink, Loader2, Package, User } from "lucide-react";

const Account = () => {
  const { customer, orders, loading, signOut } = useAuth();

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-20 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </Container>
        <Footer />
      </>
    );
  }

  if (!customer) return <Navigate to="/auth" replace />;

  return (
    <>
      <Navbar />
      <Container className="py-12 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">Welcome back, {customer.firstName || customer.email}</p>
          </div>
          <Button variant="outline" onClick={signOut}>Sign out</Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div><span className="text-muted-foreground">Name:</span> {customer.displayName}</div>
              <div><span className="text-muted-foreground">Email:</span> {customer.email}</div>
              {customer.phone && <div><span className="text-muted-foreground">Phone:</span> {customer.phone}</div>}
              <Button asChild variant="link" className="px-0">
                <Link to="/profile">Edit profile</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center gap-3">
              <Package className="h-5 w-5 text-primary" />
              <CardTitle>Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                You have <strong>{orders.length}</strong> {orders.length === 1 ? "order" : "orders"} from Shopify.
              </p>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Order history</h2>
        {orders.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">
              No orders yet. <Link to="/shop" className="text-primary hover:underline">Start shopping</Link>.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Card key={o.id}>
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{o.name}</span>
                      <Badge variant="outline">{o.fulfillmentStatus.replace(/_/g, " ").toLowerCase()}</Badge>
                      {o.financialStatus && (
                        <Badge variant="secondary">{o.financialStatus.toLowerCase()}</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(o.processedAt).toLocaleDateString()} •{" "}
                      {o.totalPrice.currencyCode} {parseFloat(o.totalPrice.amount).toFixed(2)} •{" "}
                      {o.lineItems.length} item{o.lineItems.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <a href={o.statusUrl} target="_blank" rel="noopener noreferrer">
                      Track <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Account;
