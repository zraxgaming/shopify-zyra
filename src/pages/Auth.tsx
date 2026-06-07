import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import EnhancedAuthPage from "@/components/auth/EnhancedAuthPage";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Auth = () => {
  const { user, loading } = useAuth();
  if (!loading && user) return <Navigate to="/account" replace />;
  return (
    <>
      <Navbar />
      <EnhancedAuthPage />
      <Footer />
    </>
  );
};

export default Auth;
