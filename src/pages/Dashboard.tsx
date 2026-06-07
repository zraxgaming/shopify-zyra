import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Legacy dashboard route — redirect everyone to the new Shopify-backed account page.
const Dashboard = () => {
  const { loading, customer } = useAuth();
  if (loading) return null;
  return <Navigate to={customer ? "/account" : "/auth"} replace />;
};

export default Dashboard;
