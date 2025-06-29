
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import RefundRequestActions from "@/components/admin/order/RefundRequestActions";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminRefunds = () => {
  const [refundRequests, setRefundRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const fetchRefundRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_refunds')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRefundRequests(data || []);
    } catch (error: any) {
      console.error('Error fetching refund requests:', error);
      toast({
        title: "Error",
        description: "Failed to load refund requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
          <div>
            <h1 className="text-3xl font-bold">Refund Management</h1>
            <p className="text-muted-foreground">
              Manage customer refund requests
            </p>
          </div>
          <Button onClick={fetchRefundRequests} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Pending Refund Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <RefundRequestActions
              refundRequests={refundRequests.filter(r => r.status === 'requested')}
              onRefreshRequests={fetchRefundRequests}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>All Refund Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <RefundRequestActions
              refundRequests={refundRequests}
              onRefreshRequests={fetchRefundRequests}
            />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminRefunds;
