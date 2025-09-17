import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const NewsletterOptions: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Newsletter */}
      <Card>
        <CardHeader>
          <CardTitle>Email Newsletter</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Send updates and offers to your subscribers via email.</p>
          <Button asChild><Link href="/newsletter">Go to Newsletter</Link></Button>
        </CardContent>
      </Card>
      {/* SMS */}
      <Card>
        <CardHeader>
          <CardTitle>SMS Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Send SMS notifications and campaigns to your users.</p>
          <Button asChild><Link href="/admin/AdminSms">Go to SMS</Link></Button>
        </CardContent>
      </Card>
      {/* AI Phone Calls */}
      <Card>
        <CardHeader>
          <CardTitle>AI Phone Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Automate phone calls to your customers using AI.</p>
          <Button asChild><Link href="/admin/AdminAICalls">Go to AI Calls</Link></Button>
        </CardContent>
      </Card>
      {/* Web Push Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Web Push Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Send browser push notifications using PushAlert.</p>
          <Button asChild><Link href="/admin/AdminWebPush">Go to Web Push</Link></Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsletterOptions;
