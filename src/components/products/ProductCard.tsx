
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Heart, Settings } from "lucide-react";
import AddToCartButton from "@/components/cart/AddToCartButton";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    description?: string;
    rating?: number;
    review_count?: number;
    is_featured?: boolean;
    is_customizable?: boolean;
    stock_quantity?: number;
    in_stock?: boolean;
    is_digital?: boolean;
    customization_options?: {
      allow_text: boolean;
      allow_image: boolean;
    };
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const inStock = product.in_stock ?? (product.stock_quantity || 0) > 0;
  const imageUrl = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-product.jpg';

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-105 overflow-hidden bg-gradient-to-br from-card/80 to-card border-border/50">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.slug}`}>
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.jpg';
            }}
          />
        </Link>
        
        {product.is_featured && (
          <Badge className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            Featured
          </Badge>
        )}
        
        {product.is_customizable && (
          <Badge className="absolute top-2 right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
            <Settings className="h-3 w-3 mr-1" />
            Custom
          </Badge>
        )}

        {!inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-lg">Out of Stock</Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4 space-y-3">
        <div>
          <Link to={`/product/${product.slug}`}>
            <h3 className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
          
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>

        {(product.rating || product.review_count) && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= (product.rating || 0)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating?.toFixed(1)} ({product.review_count || 0})
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-2xl font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
            {!inStock && (
              <p className="text-sm text-red-500 font-medium">Out of Stock</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {product.is_customizable ? (
            <Link to={`/product/${product.slug}`} className="flex-1">
              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                disabled={!inStock}
              >
                <Settings className="h-4 w-4 mr-2" />
                Customize
              </Button>
            </Link>
          ) : (
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price,
                images: product.images,
                stock_quantity: product.stock_quantity
              }}
              disabled={!inStock}
              className="flex-1"
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
