import React from "react";
import { Navigate } from "react-router-dom";

// Gift cards are now a real Shopify product. Redirect to the product page.
const GiftCards = () => <Navigate to="/product/zyra-gift-card" replace />;

export default GiftCards;
