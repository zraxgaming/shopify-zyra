
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Download, Zap, Shield, Users, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Download className="h-8 w-8 text-primary" />,
      title: "Instant Downloads",
      description: "Get your digital products immediately after purchase with secure download links."
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "High Quality",
      description: "All our digital products are professionally crafted and thoroughly tested."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Payments",
      description: "Safe and secure transactions with PayPal and Ziina payment processing."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community Driven",
      description: "Built by creators, for creators. Join our growing community of digital enthusiasts."
    }
  ];

  const stats = [
    { number: "10K+", label: "Digital Products" },
    { number: "25K+", label: "Happy Customers" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <>
      <SEOHead
        title="About Zyra Digital Products - Premium Digital Resources"
        description="Learn about Zyra Digital Products - your trusted source for high-quality digital templates, graphics, fonts, and creative resources for designers and businesses."
        url="https://www.shopzyra.site/about"
      />
      <Navbar />
      
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              About Zyra Digital Products
            </Badge>
            
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Empowering Creativity Through Digital Innovation
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              At Zyra Digital Products, we're passionate about providing creators, designers, and businesses 
              with premium digital resources that inspire and accelerate their projects.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">
                Born from a passion for digital creativity and innovation
              </p>
            </div>
            
            <Card className="p-8">
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Zyra Digital Products was founded with a simple yet powerful mission: to democratize access 
                  to high-quality digital resources. We believe that creativity shouldn't be limited by budget 
                  or access to expensive tools.
                </p>
                
                <p className="text-muted-foreground leading-relaxed mb-6">
                  What started as a small collection of templates has grown into a comprehensive marketplace 
                  featuring thousands of digital products including graphics, fonts, templates, stock photos, 
                  educational resources, and creative tools.
                </p>
                
                <p className="text-muted-foreground leading-relaxed">
                  Today, we're proud to serve a global community of creators, from individual freelancers 
                  to major corporations, helping them bring their visions to life with our carefully curated 
                  digital products.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Zyra?</h2>
              <p className="text-lg text-muted-foreground">
                We're committed to providing the best digital product experience
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-8">
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            </div>
            
            <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-0">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To empower creators worldwide by providing instant access to premium digital resources 
                  that inspire innovation, enhance productivity, and bring creative visions to life. 
                  We're building the future of digital creativity, one download at a time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of creators who trust Zyra for their digital product needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/shop" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2"
              >
                Explore Products
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </>
  );
};

export default About;
