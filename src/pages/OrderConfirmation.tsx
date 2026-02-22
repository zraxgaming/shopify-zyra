
import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Download, ExternalLink, Package, CheckCircle } from "lucide-react";

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    images: string[];
    is_digital: boolean;
    link: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  order_items: OrderItem[];
}

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const isDigital = searchParams.get('digital') === 'true';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            product:products (
              id,
              name,
              images,
              is_digital,
              link
            )
          )
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data as any);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast({
        title: "Error",
        description: "Could not load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDigitalDownload = (productLink: string, productName: string) => {
    if (productLink) {
      window.open(productLink, '_blank');
      toast({
        title: "Download Started",
        description: `Opening download for ${productName}`,
      });
    } else {
      toast({
        title: "Download Unavailable",
        description: "Download link is not available for this product",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">Order not found</p>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  const digitalItems = order.order_items.filter(item => item.product.is_digital);
  const physicalItems = order.order_items.filter(item => !item.product.is_digital);

  return (
    <>
      <SEOHead
        title={`Order Confirmation #${order.id.slice(0, 8)} - Zyra Digital Products`}
        description="Your order has been confirmed. Access your digital products and track your order status."
        url={`https://www.shopzyra.site/order-confirmation/${order.id}`}
      />
      <Navbar />
      
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your purchase. Your order #{order.id.slice(0, 8)} has been confirmed.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Order ID:</span>
                  <span className="font-mono">#{order.id.slice(0, 8)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <Badge variant="secondary">
                    {order.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Payment:</span>
                  <Badge variant="outline">
                    {order.payment_status}
                  </Badge>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>${order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Digital Downloads */}
            {digitalItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Digital Downloads
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your digital products are ready for download. Click the buttons below to access your files.
                  </p>
                  
                  {digitalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product.images?.[0] || '/placeholder.svg'} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleDigitalDownload(item.product.link, item.product.name)}
                        disabled={!item.product.link}
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Physical Items */}
          {physicalItems.length > 0 && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Physical Items</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Your physical items will be processed and shipped soon. You'll receive tracking information via email.
                </p>
                
                <div className="space-y-3">
                  {physicalItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={item.product.images?.[0] || '/placeholder.svg'} 
                          alt={item.product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} × ${item.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="mt-8 text-center space-x-4">
            <Button onClick={() => window.location.href = '/dashboard'}>
              View My Orders
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/shop'}>
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default OrderConfirmation;
