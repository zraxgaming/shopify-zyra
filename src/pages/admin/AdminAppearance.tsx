import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminAppearance = () => {
  // Placeholder for appearance management logic
  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your store's appearance here. (Feature coming soon!)</p>
            <Button disabled>Customize Theme</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAppearance;
