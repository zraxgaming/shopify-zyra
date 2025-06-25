
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, HelpCircle } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import { FAQSection } from "@/components/faq/FAQSection";

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <SEOHead 
        title="FAQ - Frequently Asked Questions | Zyra Custom Craft"
        description="Find answers to common questions about Zyra's custom products, shipping, returns, and more. Get help with your order today."
        keywords="faq, help, support, questions, shipping, returns, customization, zyra custom craft"
        url="https://shopzyra.vercel.app/faq"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-3xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <HelpCircle className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Frequently Asked Questions
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                Find quick answers to common questions about our products, shipping, returns, and more. 
                Can't find what you're looking for? Contact our support team.
              </p>
            </div>
          </Container>
        </section>

        {/* Search Section */}
        <section className="py-8 bg-muted/30">
          <Container>
            <div className="max-w-2xl mx-auto animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search frequently asked questions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-3 text-lg bg-background/80 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 transition-all duration-300 focus:scale-[1.02]"
                />
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Content */}
        <section className="py-16">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
                  Support Center
                </Badge>
                <h2 className="text-3xl font-bold text-foreground">Common Questions</h2>
              </div>
              
              <FAQSection />
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default FAQ;
