import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import NewsletterSignup from "@/components/newsletter/NewsletterSignup";

const Newsletter: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Newsletter | Zyra"
        description="Subscribe to the Zyra newsletter for new drops, restocks, and exclusive offers."
        url="/newsletter"
      />
      <Navbar />
      <div className="max-w-lg mx-auto my-16 px-4">
        <Card>
          <CardHeader>
            <CardTitle>Subscribe to our Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
            <NewsletterSignup />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default Newsletter;
