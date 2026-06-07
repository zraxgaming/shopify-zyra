
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Categories from "@/components/home/Categories";
import Newsletter from "@/components/home/Newsletter";
import Footer from "@/components/layout/Footer";
import SEOHead from "@/components/seo/SEOHead";

const Home = () => {
  return (
    <>
      <SEOHead
        title="Zyra — Apparel, Accessories & Gifts"
        description="Shop Zyra for premium apparel, drinkware, bags, accessories and gift cards. Quality essentials, fast shipping."
        url="/"
        keywords="apparel, t-shirts, mugs, tote bags, hats, gift cards, Zyra"
      />
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Categories />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;
