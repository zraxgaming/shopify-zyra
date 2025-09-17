
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { requestZiinaRefund } from '@/services/ziinaService';
import type { Order } from '@/types/order';

const OrderTracking = () => {
  // SEO structured data for order tracking page
  const seoJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Track Your Order',
    'description': 'Track your order status, request refunds, and get real-time updates. Zyra Custom Craft - customer-first, fast, and secure.',
    'url': 'https://www.shopzyra.site/order-tracking',
    'publisher': {
      '@type': 'Organization',
      'name': 'Zyra Custom Craft',
      'url': 'https://www.shopzyra.site',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://www.shopzyra.site/favicon.ico',
        'width': 512,
        'height': 512
      }
    }
  };
  const [searchValue, setSearchValue] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();
  const [searchType, setSearchType] = useState<'tracking' | 'orderId' | 'email'>("tracking");
  const [ordersByEmail, setOrdersByEmail] = useState<Order[]>([]);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (!order || !order.id) return;
    // Subscribe to order updates
    const channel = supabase
      .channel('order-tracking')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${order.id}`
      }, (payload) => {
        if (payload.new) {
          setOrder((prev: any) => ({ ...prev, ...payload.new }));
        }
      })
      .subscribe();
    subscriptionRef.current = channel;
    return () => {
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [order?.id]);

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast({
        title: "Please enter a value to search",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    setHasSearched(true);
    setOrder(null);
    setOrdersByEmail([]);
    try {
      let data: any = null, error: any = null;
      if (searchType === 'tracking') {
        ({ data, error } = await supabase
          .from<any, any>("orders")
          .select(`*, order_items:order_items_order_id_fkey ( id, quantity, price, products!order_items_product_id_fkey ( id, name, images ) )`)
          .eq("tracking_number", searchValue.trim())
          .maybeSingle());
      } else if (searchType === 'orderId') {
        // Support both raw UUID start and patterns like 'this-7cdcc6c7'
        let idPart = searchValue.trim();
        const dashIdx = idPart.indexOf('-');
        if (dashIdx !== -1 && dashIdx !== 0) {
          idPart = idPart.slice(dashIdx + 1);
        }
        ({ data, error } = await supabase
          .from<any, any>("orders")
          .select(`*, order_items:order_items_order_id_fkey ( id, quantity, price, products!order_items_product_id_fkey ( id, name, images ) )`)
          .ilike("id", `${idPart}%`)
          .maybeSingle());
      } else if (searchType === 'email') {
        ({ data, error } = await supabase
          .from<any, any>("orders")
          .select(`*, order_items:order_items_order_id_fkey ( id, quantity, price, products!order_items_product_id_fkey ( id, name, images ) )`)
          .eq("email", searchValue.trim())); // no maybeSingle here
      }
      if (error) {
        console.error('Supabase error:', error);
        setOrder(null);
        setOrdersByEmail([]);
        toast({
          title: searchType === 'email' ? "No orders found for this email." : "Order not found",
          description: error.message || "Please check your input and try again.",
          variant: "destructive"
        });
      } else if (!data || (searchType !== 'email' && Object.keys(data).length === 0) || (searchType === 'email' && Array.isArray(data) && data.length === 0)) {
        setOrder(null);
        setOrdersByEmail([]);
        toast({
          title: "Order not found",
          description: "No matching order found. Please check your input and try again.",
          variant: "destructive"
        });
      } else {
        if (searchType === 'email') {
          if (data && Array.isArray(data) && data.length > 0) {
            setOrdersByEmail(data as Order[]);
          } else {
            setOrdersByEmail([]);
            toast({
              title: "No orders found for this email.",
              variant: "destructive"
            });
          }
        } else {
          setOrder(data as Order);
        }
      }
    } catch (error: any) {
      console.error("Error tracking order:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to track order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <>
      <Head>
        <title>Track Your Order | Zyra Custom Craft</title>
        <meta name="description" content="Track your order status, request refunds, and get real-time updates. Zyra Custom Craft - customer-first, fast, and secure." />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Track Your Order | Zyra Custom Craft" />
        <meta property="og:description" content="Track your order status, request refunds, and get real-time updates. Zyra Custom Craft - customer-first, fast, and secure." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.shopzyra.site/order-tracking" />
        <meta property="og:image" content="https://www.shopzyra.site/favicon.ico" />
        <meta property="og:site_name" content="Zyra Custom Craft" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Track Your Order | Zyra Custom Craft" />
        <meta name="twitter:description" content="Track your order status, request refunds, and get real-time updates. Zyra Custom Craft - customer-first, fast, and secure." />
        <meta name="twitter:image" content="https://www.shopzyra.site/favicon.ico" />
        <link rel="canonical" href="https://www.shopzyra.site/order-tracking" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(seoJsonLd) }} />
      </Head>
      <Navbar />
      <Container className="py-12">
        <main className="max-w-2xl mx-auto" aria-label="Order Tracking">
          <header className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Track Your Order</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Enter your tracking number, order ID, or email to see the current status of your order.
            </p>
          </header>
          <Card className="mb-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700" aria-label="Order Tracking Form">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <Search className="h-5 w-5" aria-hidden="true" />
                <span>Order Tracking</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4 md:flex-row md:gap-4" onSubmit={e => { e.preventDefault(); handleSearch(); }} role="search">
                <label htmlFor="searchType" className="sr-only">Search Type</label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={e => setSearchType(e.target.value as any)}
                  className="border rounded px-2 py-1 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  aria-label="Search by"
                >
                  <option value="tracking">Tracking Number</option>
                  <option value="orderId">Order ID</option>
                  <option value="email">Email</option>
                </select>
                <label htmlFor="order-search" className="sr-only">{searchType === 'tracking' ? 'Tracking Number' : searchType === 'orderId' ? 'Order ID' : 'Email'}</label>
                <Input
                  id="order-search"
                  placeholder={searchType === 'tracking' ? "Enter your tracking number..." : searchType === 'orderId' ? "Enter your order ID..." : "Enter your email..."}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
                  aria-label={searchType === 'tracking' ? 'Tracking Number' : searchType === 'orderId' ? 'Order ID' : 'Email'}
                  autoComplete="off"
                />
                <Button 
                  type="submit"
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-zyra-purple hover:bg-zyra-dark-purple text-white"
                  aria-label="Track Order"
                >
                  {isLoading ? "Searching..." : "Track"}
                </Button>
              </form>
            </CardContent>
          </Card>
          {hasSearched && !order && !isLoading && ordersByEmail.length === 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-8 text-center">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Order Not Found</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  We couldn't find an order with that information. Please check and try again.
                </p>
              </CardContent>
            </Card>
          )}
          {ordersByEmail.length > 0 && (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Orders for {searchValue}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {ordersByEmail.map((o) => (
                    <div key={o.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">Order #{o.id.slice(0,8)}</span>
                        <span className={`ml-2 ${getStatusColor(o.status)} px-2 py-1 rounded text-xs`}>{o.status.charAt(0).toUpperCase() + o.status.slice(1)}</span>
                        <div className="text-gray-600 dark:text-gray-400 text-sm">{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'Unknown'}</div>
                      </div>
                      <Button size="sm" className="mt-2 md:mt-0" onClick={() => { setOrder(o); setOrdersByEmail([]); }}>View Details</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          {order && (
            <div className="space-y-6">
              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-gray-900 dark:text-gray-100">
                    <span>Order #{order.id.slice(0, 8)}</span>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Order Date</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Total Amount</h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.tracking_number && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Tracking Number</h4>
                      <p className="text-gray-600 dark:text-gray-400 font-mono">
                        {order.tracking_number}
                      </p>
                    </div>
                  )}

                  {order.shipping_address && (
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Shipping Address</h4>
                      <div className="text-gray-600 dark:text-gray-400">
                        <p>{order.shipping_address.street}</p>
                        <p>
                          {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                        </p>
                        <p>{order.shipping_address.country}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <CardHeader>
                  <CardTitle className="text-gray-900 dark:text-gray-100">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['pending', 'processing', 'shipped', 'delivered'].map((status, index) => {
                      const isActive = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= index;
                      const isCurrent = order.status === status;
                      
                      return (
                        <div key={status} className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${isActive ? 'bg-zyra-purple' : 'bg-gray-200 dark:bg-gray-700'}`}>
                            {getStatusIcon(status)}
                          </div>
                          <div className="flex-1">
                            <h4 className={`font-medium ${isCurrent ? 'text-zyra-purple' : 'text-gray-900 dark:text-gray-100'}`}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {status === 'pending' && 'Your order has been received and is being prepared'}
                              {status === 'processing' && 'Your order is being processed and prepared for shipment'}
                              {status === 'shipped' && 'Your order has been shipped and is on its way'}
                              {status === 'delivered' && 'Your order has been delivered'}
                            </p>
                          </div>
                          {isCurrent && (
                            <Badge variant="outline" className="text-zyra-purple border-zyra-purple">
                              Current
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {order.order_items && order.order_items.length > 0 && (
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-gray-900 dark:text-gray-100">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">
                              {item.products?.name || `Item #${item.id.slice(0, 8)}`}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Quantity: {item.quantity}
                            </p>
                          </div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </Container>
      <Footer />
    </>
  );
};

export default OrderTracking;
