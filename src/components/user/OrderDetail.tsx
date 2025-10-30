
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Package, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { OrderDetail as OrderDetailType } from "@/types/order";
import { format } from "date-fns";
import OrderRefundRequest from "./OrderRefundRequest";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && user) {
      fetchOrderDetails();
    }
  }, [id, user]);

  const fetchOrderDetails = async () => {
    try {
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products:product_id (
              id,
              name,
              images,
              slug
            )
          )
        `)
        .eq('id', id)
        .eq('user_id', user?.id)
        .single();

      if (orderError) throw orderError;

      setOrder(orderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error",
        description: "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDigitalDownload = (downloadUrl: string) => {
    window.open(downloadUrl, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-500';
      case 'shipped': return 'bg-blue-500';
      case 'processing': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <Button onClick={() => navigate('/account/orders')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/account/orders')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            Order #{order.id.slice(-8)} • {format(new Date(order.created_at), "MMMM d, yyyy")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items
                </span>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity} × AED {item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        AED {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Payment Method</span>
                  <span className="capitalize">{order.payment_method || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Status</span>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'}>
                    {order.payment_status}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>AED {order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.payment_status === 'paid' && (
            <OrderRefundRequest
              orderId={order.id}
              totalAmount={order.total_amount}
              paymentIntentId={order.payment_intent_id}
              hasRefundRequest={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
