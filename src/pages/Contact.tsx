
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, MessageCircle, Clock, Sparkles } from "lucide-react";
import SEOHead from "@/components/seo/SEOHead";
import ContactForm from "@/components/contact/ContactForm";

const Contact = () => {
  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Us",
      description: "Get in touch via email",
      value: "hello@zyracustomcraft.com",
      action: "mailto:hello@zyracustomcraft.com"
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Call Us",
      description: "Speak with our team",
      value: "+971 50 123 4567",
      action: "tel:+971501234567"
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: "Visit Us",
      description: "Come see our workshop",
      value: "Dubai, UAE",
      action: "https://maps.google.com"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Business Hours",
      description: "When we're available",
      value: "Sun-Thu: 9AM-6PM",
      action: null
    }
  ];

  return (
    <>
      <SEOHead 
        title="Contact Zyra Custom Craft - Get in Touch for Custom Products & Support"
        description="Contact Zyra Custom Craft for custom product inquiries, support, or collaboration opportunities. We're here to help bring your creative ideas to life in the UAE."
        keywords="contact zyra, custom products support, UAE contact, Dubai custom craft, get in touch, customer service, custom product inquiries"
        url="https://shopzyra.vercel.app/contact"
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
                    <MessageCircle className="h-10 w-10 text-primary animate-pulse" />
                  </div>
                </div>
              </div>
              <Badge className="mb-6 bg-gradient-to-r from-primary to-purple-600 text-white">
                <Sparkles className="h-4 w-4 mr-2" />
                Get In Touch
              </Badge>
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 animate-scale-in">
                Let's Create Together
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed animate-slide-in-right">
                Have a question, need support, or want to discuss a custom project? 
                We'd love to hear from you. Our team is here to help bring your ideas to life.
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 bg-muted/30">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {contactInfo.map((info, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 text-primary group-hover:scale-110 transition-transform duration-300">
                      {info.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">
                      {info.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {info.description}
                    </p>
                    {info.action ? (
                      <a
                        href={info.action}
                        className="text-primary font-medium hover:text-primary/80 transition-colors"
                      >
                        {info.value}
                      </a>
                    ) : (
                      <span className="text-foreground font-medium">
                        {info.value}
                      </span>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* Contact Form Section */}
        <section className="py-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="animate-slide-in-left">
                <Badge className="mb-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  Send Message
                </Badge>
                <h2 className="text-4xl font-bold mb-6 text-foreground">
                  Ready to Start Your Project?
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Fill out the form and we'll get back to you within 24 hours. Whether you have 
                  questions about our products, need help with customization, or want to discuss 
                  bulk orders, we're here to help.
                </p>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Quick Response</h3>
                      <p className="text-muted-foreground text-sm">We typically respond within 2-4 hours during business hours.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone Support</h3>
                      <p className="text-muted-foreground text-sm">Need immediate help? Call us during business hours.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                      <p className="text-muted-foreground text-sm">Detailed inquiries? Email us for comprehensive support.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="animate-slide-in-right">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-8">
                    <ContactForm />
                  </CardContent>
                </Card>
              </div>
            </div>
          </Container>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
