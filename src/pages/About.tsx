
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Award, Users, Palette, Truck } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";

const About = () => {
  const features = [
    {
      icon: <Palette className="h-8 w-8" />,
      title: "Custom Design",
      description: "Create unique products with our advanced customization tools and bring your vision to life."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Premium Quality",
      description: "We use only the finest materials and state-of-the-art printing technology for lasting results."
    },
    {
      icon: <Truck className="h-8 w-8" />,
      title: "Fast Delivery",
      description: "Quick processing and reliable shipping to get your custom products to you faster."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Support",
      description: "Our dedicated team is here to help you every step of the way, from design to delivery."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Happy Customers" },
    { number: "50,000+", label: "Products Created" },
    { number: "99%", label: "Satisfaction Rate" },
    { number: "3-5", label: "Days Delivery" }
  ];

  return (
    <>
      <SEOHead 
        title="About Zyra Custom Craft - Premium Custom Products & Personalized Gifts"
        description="Learn about Zyra Custom Craft's mission to create exceptional custom products and personalized gifts. Discover our story, values, and commitment to quality craftsmanship in the UAE."
        keywords="about zyra, custom craft company, personalized gifts UAE, custom products Dubai, premium quality, craftsmanship, custom printing services"
        url="https://shopzyra.vercel.app/about"
      />
      <div className="min-h-screen bg-background">
        <Navbar />
        
        {/* Hero Section */}
        <section className="relative py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5"></div>
          <Container className="relative z-10">
            <div className="text-center max-w-4xl mx-auto animate-fade-in">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
                    <Heart className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                About Zyra Custom Craft
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Crafting Dreams Into Reality
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                We're passionate about turning your ideas into beautiful, personalized products. 
                From custom phone cases to unique gifts, we bring creativity and quality together 
                to create something truly special for you.
              </p>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Our Story
                </Badge>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Building Something Beautiful Together
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Founded with a vision to make personalization accessible to everyone, Zyra Custom Craft 
                  has grown from a small startup to a trusted name in custom products. We believe that 
                  everyone deserves to own something unique that reflects their personality and style.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Our team of designers, craftspeople, and technology experts work together to ensure 
                  every product meets our high standards of quality and creativity. From the initial 
                  design to the final product, we're committed to excellence at every step.
                </p>
              </div>
              <div className="animate-slide-in-right">
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
                  <img
                    src="/placeholder-about.jpg"
                    alt="Zyra Custom Craft Workshop"
                    className="relative w-full h-96 object-cover rounded-2xl shadow-2xl"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=400&fit=crop';
                    }}
                  />
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-gradient-to-r from-primary to-purple-600 text-white">
                Why Choose Zyra
              </Badge>
              <h2 className="text-4xl font-bold mb-6 text-foreground">What Makes Us Different</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                We're not just another custom product company. We're your partners in creativity, 
                committed to bringing your unique ideas to life with exceptional quality and service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-3 text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <Container>
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-gradient-to-r from-pink-600 to-red-600 text-white">
                Our Mission
              </Badge>
              <h2 className="text-4xl font-bold mb-8 text-foreground">
                Empowering Your Creativity
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                Our mission is simple: to empower everyone to express their creativity through beautiful, 
                high-quality custom products. We believe that personalization shouldn't be a luxury – 
                it should be accessible, affordable, and absolutely amazing.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">Quality First</Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">Customer Focused</Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">Innovation Driven</Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">Sustainably Made</Badge>
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default About;
