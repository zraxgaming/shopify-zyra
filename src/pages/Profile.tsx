import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shopifyUpdateCustomer } from "@/services/shopifyCustomer";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const { customer, accessToken, loading, refresh } = useAuth();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "" });

  useEffect(() => {
    if (customer) {
      setForm({
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Container className="py-20 flex justify-center"><Loader2 className="h-10 w-10 animate-spin" /></Container>
        <Footer />
      </>
    );
  }

  if (!customer || !accessToken) return <Navigate to="/auth" replace />;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await shopifyUpdateCustomer(accessToken, form);
      await refresh();
      toast({ title: "Profile updated" });
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container className="py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>
        <Card>
          <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Email</Label>
                <Input value={customer.email} disabled />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed from this page.</p>
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
            </form>
          </CardContent>
        </Card>
      </Container>
      <Footer />
    </>
  );
};

export default Profile;
