
import React from "react";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/components/cart/CartProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (item: any) => {
    addToCart({
      product_id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.images?.[0] || '/placeholder-product.jpg'
    }, 1);
    
    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  return (
    <>
      <Navbar />
      <Container className="py-12">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500" />
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500">Start adding products you love!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={item.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  
                  <h3 className="font-semibold mb-2">{item.name}</h3>
                  <p className="text-lg font-bold text-primary mb-4">${item.price}</p>
                  
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1"
                      size="sm"
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFromWishlist(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default Wishlist;
