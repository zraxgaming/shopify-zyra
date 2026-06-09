import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const FAQ = () => {
  const faqCategories = [
    {
      title: "Orders & Payment",
      items: [
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit and debit cards through our secure Shopify checkout, plus PayPal and Ziina where available.",
        },
        {
          question: "Is my payment information secure?",
          answer: "Yes. All payments are processed by Shopify and our supported providers using industry-standard encryption. We never store your card details on our servers.",
        },
        {
          question: "Can I track my order?",
          answer: "Once your order ships, you'll receive an email with a tracking link. You can also view your order status anytime from your account page.",
        },
        {
          question: "How long does processing take?",
          answer: "Most orders are processed within 1–2 business days. Gift cards are delivered to the recipient's email automatically.",
        },
      ],
    },
    {
      title: "Shipping & Delivery",
      items: [
        {
          question: "Do you offer international shipping?",
          answer: "Yes — shipping availability and rates depend on your destination and the products in your cart. You'll see exact costs at checkout.",
        },
        {
          question: "How much does shipping cost?",
          answer: "Shipping is calculated at checkout based on your location and the items in your order.",
        },
        {
          question: "Can I change my shipping address after ordering?",
          answer: "Contact us as soon as possible — we can update your address if the order hasn't shipped yet.",
        },
      ],
    },
    {
      title: "Gift Cards",
      items: [
        {
          question: "How do gift cards work?",
          answer: "Choose an amount, enter the recipient's email, and they'll receive a gift card code they can redeem at checkout. Gift cards never expire.",
        },
        {
          question: "Can I use a gift card on any product?",
          answer: "Yes — gift cards can be used toward any product in our shop.",
        },
      ],
    },
    {
      title: "Returns & Refunds",
      items: [
        {
          question: "What is your return policy?",
          answer: "We accept returns within 30 days of delivery for unused items in their original condition. See our refund policy for full details.",
        },
        {
          question: "How do I request a refund?",
          answer: "Contact our support team with your order number and reason for return, and we'll guide you through the process.",
        },
      ],
    },
    {
      title: "Account & Support",
      items: [
        {
          question: "Do I need an account to make a purchase?",
          answer: "No — you can check out as a guest. Creating an account makes it easier to track orders and reorder favorites.",
        },
        {
          question: "I forgot my password, how do I reset it?",
          answer: "Go to the Sign In page, choose 'Reset', and enter your email. You'll receive a reset link from Shopify.",
        },
        {
          question: "How can I contact customer support?",
          answer: "Use the contact form on our website. We typically respond within 24 hours on business days.",
        },
      ],
    },
  ];

  return (
    <>
      <SEOHead
        title="FAQ — Frequently Asked Questions | Zyra"
        description="Find answers to common questions about Zyra orders, shipping, gift cards, returns, and support."
        url="https://www.shopzyra.site/faq"
      />
      <Navbar />

      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about shopping at Zyra
            </p>
          </div>

          <div className="space-y-8">
            {faqCategories.map((category, categoryIndex) => (
              <Card key={categoryIndex}>
                <CardHeader>
                  <CardTitle className="text-2xl">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.items.map((faq, index) => (
                      <AccordionItem key={index} value={`${categoryIndex}-${index}`}>
                        <AccordionTrigger className="text-left font-medium">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="mt-12">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? We're here to help.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Contact Support
              </a>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FAQ;
