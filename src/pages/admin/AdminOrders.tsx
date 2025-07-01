import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Eye, Edit, Truck, CheckCircle, XCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_status: string;
  total_amount: number;
  currency: string;
  payment_method: string;
  delivery_type: string;
  created_at: string;
  updated_at: string;
  payment_intent_id?: string;
  profiles?: {
    id: string;
    email?: string;
    display_name?: string;
    first_name?: string;
    last_name?: string;
    full_name?: string;
  };
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profile data separately for each order
      const ordersWithProfiles = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, email, display_name, first_name, last_name')
            .eq('id', order.user_id)
            .single();

          return {
            ...order,
            profiles: profile ? {
              ...profile,
              full_name: profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
            } : undefined
          };
        })
      );

      setOrders(ordersWithProfiles);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      // Find the updated order and its user email
      const updatedOrder = orders.find(order => order.id === orderId);
      const userEmail = updatedOrder?.profiles?.email;
      const userName = updatedOrder?.profiles?.full_name || 'Customer';

      // Update local state
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      // Send email notification if user email exists
      if (userEmail) {
        fetch('/api/send-email-generic', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: userEmail,
            subject: `Your order status has changed to ${newStatus}`,
            text: `Hello ${userName}, your order status is now: ${newStatus}.`,
            html: `
              <div style="background: linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%); padding: 32px 0; min-height: 100vh; font-family: 'Segoe UI', Arial, sans-serif;">
                <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 16px; box-shadow: 0 4px 24px rgba(80,0,120,0.08); overflow: hidden;">
                  <div style="background: #7c3aed; padding: 24px 0; text-align: center;">
                    <img src='https://www.shopzyra.site/favicon.ico' alt='Zyra Logo' style='width:48px;height:48px;border-radius:8px;box-shadow:0 2px 8px #a18cd1;' />
                    <h1 style="color: #fff; font-size: 2rem; margin: 16px 0 0 0; letter-spacing: 1px;">Order Status Updated</h1>
                  </div>
                  <div style="padding: 32px 24px 24px 24px; text-align: center;">
                    <p style="font-size: 1.1rem; color: #6b21a8; margin-bottom: 16px;">Hello <b>${userName}</b>,</p>
                    <p style="color: #4b006e; margin-bottom: 16px;">Your order status is now: <b style='color:#7c3aed'>${newStatus}</b>.</p>
                    <a href="https://www.shopzyra.site/dashboard" style="display:inline-block;margin:24px 0 0 0;padding:12px 32px;background:#a18cd1;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;box-shadow:0 2px 8px #a18cd1;">View My Orders</a>
                  </div>
                  <div style="background: #f3e8ff; padding: 16px; text-align: center; color: #7c3aed; font-size: 0.95rem; border-top: 1px solid #e9d5ff;">
                    <p style="margin:0;">Thank you for shopping with us!<br/>Zyra Custom Craft</p>
                  </div>
                </div>
              </div>
            `
          })
        });
      }

      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'ready_for_pickup':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'ready_for_pickup':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Package className="h-8 w-8" />
            Orders Management
          </h1>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="ready_for_pickup">Ready for Pickup</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4">
          {filteredOrders.map((order, index) => (
            <Card key={order.id} className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg">Order #{order.id.slice(0, 8)}</h3>
                      <Badge className={getStatusColor(order.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(order.status)}
                          {order.status.replace('_', ' ')}
                        </span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium">Customer:</span>{' '}
                        {order.profiles?.full_name || order.profiles?.email || 'Unknown'}
                      </div>
                      <div>
                        <span className="font-medium">Total:</span>{' '}
                        ${order.total_amount} {order.currency}
                      </div>
                      <div>
                        <span className="font-medium">Payment:</span>{' '}
                        {order.payment_method} ({order.payment_status})
                      </div>
                      <div>
                        <span className="font-medium">Delivery:</span>{' '}
                        {order.delivery_type}
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{' '}
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Payment Intent:</span>{' '}
                      <span className="font-mono text-xs">{order.payment_intent_id || "—"}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="ready_for_pickup">Ready for Pickup</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/admin/orders/${order.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Orders Found</h3>
              <p className="text-muted-foreground">
                {statusFilter === 'all' 
                  ? "No orders have been placed yet." 
                  : `No orders with status "${statusFilter}" found.`
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
