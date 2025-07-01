import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const AdminContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);

  // Placeholder for contact management logic

  return (
    <AdminLayout>
      <div className="space-y-8 p-8">
        <Card>
          <CardHeader>
            <CardTitle>Contact Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your contact submissions here. (Feature coming soon!)</p>
            <Button disabled>View Contacts</Button>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
