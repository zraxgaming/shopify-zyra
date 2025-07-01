import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminBlogs = () => {
  const [blogs, setBlogs] = useState<any[]>([]);

  // Placeholder for blog management logic

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Blog Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your blog posts here. (Feature coming soon!)</p>
            <Button disabled>Add New Blog Post</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminBlogs;
