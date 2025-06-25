
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";

const NewsletterUnsubscribe = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    handleUnsubscribe();
  }, [email]);

  const handleUnsubscribe = async () => {
    if (!email) {
      setError("No email provided");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('newsletter_subscriptions')
        .update({ 
          is_active: false, 
          unsubscribed_at: new Date().toISOString() 
        })
        .eq('email', email);

      if (error) throw error;

      setIsUnsubscribed(true);
      toast({
        title: "Successfully Unsubscribed",
        description: "You have been removed from our newsletter.",
      });

    } catch (error: any) {
      console.error('Unsubscribe error:', error);
      setError(error.message || "Failed to unsubscribe");
      toast({
        title: "Unsubscribe Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEOHead 
        title="Newsletter Unsubscribe - Zyra Custom Craft"
        description="Unsubscribe from Zyra Custom Craft newsletter"
        url="https://shopzyra.vercel.app/newsletter-unsubscribe"
      />
      <Navbar />
      <div className="min-h-screen bg-background py-16">
        <Container>
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg border-0">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4">
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  ) : isUnsubscribed ? (
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  ) : (
                    <XCircle className="h-12 w-12 text-red-500" />
                  )}
                </div>
                <CardTitle className="text-2xl">
                  {isLoading 
                    ? "Processing..." 
                    : isUnsubscribed 
                      ? "Successfully Unsubscribed" 
                      : "Unsubscribe Failed"
                  }
                </CardTitle>
              </CardHeader>
              
              <CardContent className="text-center space-y-6">
                {isLoading ? (
                  <p className="text-muted-foreground">
                    We're processing your unsubscribe request...
                  </p>
                ) : isUnsubscribed ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-2 text-green-600">
                      <Mail className="h-5 w-5" />
                      <span>You've been removed from our newsletter</span>
                    </div>
                    <p className="text-muted-foreground">
                      We're sorry to see you go! You will no longer receive marketing emails from Zyra Custom Craft.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-red-600 font-medium">
                      {error || "Unable to process unsubscribe request"}
                    </p>
                    <p className="text-muted-foreground">
                      Please contact our support team if you continue to have issues.
                    </p>
                  </div>
                )}

                <div className="pt-6 border-t border-border">
                  <Link to="/">
                    <Button variant="ghost" className="text-muted-foreground">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Return to Homepage
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
};

export default NewsletterUnsubscribe;
