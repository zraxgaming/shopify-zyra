import React from "react";
import Head from "next/head";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const AdminWebPush: React.FC = () => {
  // Placeholder for pushweb integration logic
  // You would add your pushweb setup and notification sending logic here

  return (
    <>
      <Head>
        <title>Admin Web Push Notifications | Zyra Custom Craft</title>
        <meta name="description" content="Send web push notifications to your users from the admin dashboard. Engage your audience instantly!" />
      </Head>
      <AdminLayout>
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Web Push Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              Use this dashboard to send web push notifications to your users. This feature uses <b>pushweb</b> for instant browser notifications.
            </p>
            <Button className="bg-zyra-purple hover:bg-zyra-dark-purple text-white" disabled>
              Send Test Notification (Coming Soon)
            </Button>
          </CardContent>
        </Card>
      </AdminLayout>
    </>
  );
};

export default AdminWebPush;
