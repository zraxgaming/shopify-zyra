
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
        title="Zyra - Premium Digital Products, Templates & Creative Resources"
        description="Discover thousands of high-quality digital products at Zyra. Download premium templates, graphics, fonts, stock photos, and creative resources instantly. Perfect for designers, businesses, and creators."
        url="https://www.shopzyra.site"
        keywords="digital products, templates, graphics, fonts, stock photos, design resources, instant download, creative assets, Zyra"
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
