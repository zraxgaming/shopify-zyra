import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState<any[]>([]);

  // Placeholder for FAQ management logic

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle>FAQ Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your FAQs here. (Feature coming soon!)</p>
            <Button disabled>Add New FAQ</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFaqs;
