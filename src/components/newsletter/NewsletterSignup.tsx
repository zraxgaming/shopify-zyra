import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail } from "lucide-react";
import { shopifyNewsletterSubscribe } from "@/services/shopifyCustomer";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Email required", description: "Please enter your email.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await shopifyNewsletterSubscribe(email, name || undefined);
      toast({
        title: res.alreadySubscribed ? "Already subscribed" : "Subscribed!",
        description: res.alreadySubscribed
          ? "This email is already on our list."
          : "Thanks for joining the Zyra newsletter.",
      });
      setEmail("");
      setName("");
    } catch (err: any) {
      toast({
        title: "Subscription failed",
        description: err.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 text-primary">
        <Mail className="h-5 w-5" />
        <span className="font-semibold">Join the newsletter</span>
      </div>
      <div className="space-y-2">
        <Label htmlFor="ns-name">Name (optional)</Label>
        <Input id="ns-name" value={name} onChange={(e) => setName(e.target.value)} disabled={isLoading} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="ns-email">Email</Label>
        <Input id="ns-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
};

export default NewsletterSignup;
