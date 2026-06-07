import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Sparkles, ArrowRight, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { shopifyRecoverPassword } from "@/services/shopifyCustomer";

const EnhancedAuthPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [resetEmail, setResetEmail] = useState("");

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signIn(signInData.email, signInData.password);
      toast({ title: "Welcome back!" });
      navigate("/account");
    } catch (error: any) {
      toast({
        title: "Sign In Failed",
        description: error.message || "Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      toast({ title: "Password Mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await signUp(signUpData.email, signUpData.password, {
        first_name: signUpData.firstName,
        last_name: signUpData.lastName,
      });
      toast({ title: "Account created!", description: "You're now signed in." });
      navigate("/account");
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Try again with different credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({ title: "Email required", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await shopifyRecoverPassword(resetEmail);
      toast({
        title: "Recovery email sent",
        description: "Check your email for password reset instructions from Shopify.",
      });
      setResetEmail("");
    } catch (error: any) {
      toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl">
          <CardHeader className="text-center space-y-4 pb-8">
            <div className="mx-auto bg-primary/10 p-4 rounded-2xl border border-primary/20 w-fit">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-3xl font-bold">Welcome to Zyra</CardTitle>
            <p className="text-muted-foreground">Sign in or create your Shopify account</p>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email"><Mail className="inline h-4 w-4 mr-1" />Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      required
                      value={signInData.email}
                      onChange={(e) => setSignInData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password"><Lock className="inline h-4 w-4 mr-1" />Password</Label>
                    <div className="relative">
                      <Input
                        id="signin-password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={signInData.password}
                        onChange={(e) => setSignInData((p) => ({ ...p, password: e.target.value }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                        onClick={() => setShowPassword((s) => !s)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : (<><Shield className="h-4 w-4 mr-2" />Sign In<ArrowRight className="h-4 w-4 ml-2" /></>)}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="first-name"><User className="inline h-4 w-4 mr-1" />First</Label>
                      <Input
                        id="first-name"
                        required
                        value={signUpData.firstName}
                        onChange={(e) => setSignUpData((p) => ({ ...p, firstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last</Label>
                      <Input
                        id="last-name"
                        required
                        value={signUpData.lastName}
                        onChange={(e) => setSignUpData((p) => ({ ...p, lastName: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email"><Mail className="inline h-4 w-4 mr-1" />Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      required
                      value={signUpData.email}
                      onChange={(e) => setSignUpData((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password"><Lock className="inline h-4 w-4 mr-1" />Password</Label>
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={signUpData.password}
                      onChange={(e) => setSignUpData((p) => ({ ...p, password: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={signUpData.confirmPassword}
                      onChange={(e) => setSignUpData((p) => ({ ...p, confirmPassword: e.target.value }))}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : (<><Sparkles className="h-4 w-4 mr-2" />Create Account</>)}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="reset">
                <form onSubmit={handleReset} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    We'll email you a password reset link from Shopify.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="reset-email"><Mail className="inline h-4 w-4 mr-1" />Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Reset Email"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedAuthPage;
