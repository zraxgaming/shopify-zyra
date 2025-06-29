
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface RefundRequest {
  id: string;
  order_id: string;
  amount: number;
  reason: string;
  status: string;
  created_at: string;
  ziina_refund_id: string;
}

interface RefundRequestActionsProps {
  refundRequests: RefundRequest[];
  onRefreshRequests: () => void;
}

const RefundRequestActions: React.FC<RefundRequestActionsProps> = ({
  refundRequests,
  onRefreshRequests
}) => {
  const [processingRefunds, setProcessingRefunds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const handleRefundAction = async (refundId: string, action: 'approve' | 'decline') => {
    setProcessingRefunds(prev => new Set([...prev, refundId]));
    
    try {
      const newStatus = action === 'approve' ? 'approved' : 'declined';
      
      const { error } = await supabase
        .from('order_refunds')
        .update({ status: newStatus })
        .eq('id', refundId);

      if (error) throw error;

      toast({
        title: `Refund ${action === 'approve' ? 'Approved' : 'Declined'}`,
        description: `The refund request has been ${action === 'approve' ? 'approved' : 'declined'}.`,
      });

      onRefreshRequests();
    } catch (error: any) {
      console.error('Error processing refund:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} refund request.`,
        variant: "destructive",
      });
    } finally {
      setProcessingRefunds(prev => {
        const newSet = new Set(prev);
        newSet.delete(refundId);
        return newSet;
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'declined':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  if (refundRequests.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No refund requests found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Refund Requests</h3>
      {refundRequests.map((request) => (
        <Card key={request.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">
                Order #{request.order_id.slice(-8)}
              </CardTitle>
              <Badge className={getStatusColor(request.status)}>
                <div className="flex items-center gap-1">
                  {getStatusIcon(request.status)}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </div>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Amount:</span>
                  <span className="ml-2">AED {request.amount.toFixed(2)}</span>
                </div>
                <div>
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">
                    {new Date(request.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div>
                <span className="font-medium text-sm">Reason:</span>
                <p className="text-sm text-muted-foreground mt-1">{request.reason}</p>
              </div>

              {request.status === 'requested' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleRefundAction(request.id, 'approve')}
                    disabled={processingRefunds.has(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleRefundAction(request.id, 'decline')}
                    disabled={processingRefunds.has(request.id)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Decline
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RefundRequestActions;
