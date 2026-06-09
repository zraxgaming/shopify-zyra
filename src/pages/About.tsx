import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Sparkles, Truck, Gift, Shield, Users, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: <Truck className="h-8 w-8 text-primary" />,
      title: "Fast Shipping",
      description: "Carefully packed and shipped quickly so your order arrives fresh and on time."
    },
    {
      icon: <Gift className="h-8 w-8 text-primary" />,
      title: "Gift Cards Available",
      description: "Send the perfect gift with a Zyra gift card — delivered straight to their inbox."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure Checkout",
      description: "Pay safely with trusted methods. Your information stays private and protected."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Customer First",
      description: "Real people behind every order, ready to help you with anything you need."
    }
  ];

  const stats = [
    { number: "5K+", label: "Products Shipped" },
    { number: "10K+", label: "Happy Customers" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" }
  ];

  return (
    <>
      <SEOHead
        title="About Zyra — Curated Products & Gift Cards"
        description="Learn about Zyra — a curated online shop for quality products and gift cards, with fast shipping and friendly support."
        url="https://www.shopzyra.site/about"
      />
      <Navbar />

      <div className="min-h-screen bg-background">
        <section className="relative py-20 bg-gradient-to-br from-primary/5 via-background to-purple-500/5">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              About Zyra
            </Badge>

            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Quality products, thoughtfully curated
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Zyra is an online shop offering a hand-picked selection of products and gift cards —
              built for people who care about quality, value, and a great unboxing experience.
            </p>
          </div>
        </section>

        <section className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-lg text-muted-foreground">A small shop with a big focus on quality</p>
            </div>

            <Card className="p-8">
              <CardContent className="prose prose-lg max-w-none">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Zyra started with a simple idea: make it easy to find products you'll actually love,
                  without wading through endless catalogs.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Every item in our shop is chosen for quality, value, and usefulness. We also offer
                  gift cards so you can share the experience with friends and family.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Today we serve customers around the world, backed by friendly support and a checkout
                  experience that just works.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Choose Zyra?</h2>
              <p className="text-lg text-muted-foreground">A shopping experience built around you</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">{feature.icon}</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="mb-8">
              <Award className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            </div>

            <Card className="p-8 bg-gradient-to-br from-primary/5 to-purple-500/5">
              <CardContent className="p-0">
                <p className="text-xl text-muted-foreground leading-relaxed">
                  To make great products accessible to everyone, backed by honest service and a
                  shopping experience that respects your time.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary/10 to-purple-500/10">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to shop?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Browse our latest products or send a gift card to someone special.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/shop" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-6 py-2">
                Shop Products
              </a>
              <a href="/gift-cards" className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 py-2">
                Gift Cards
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
