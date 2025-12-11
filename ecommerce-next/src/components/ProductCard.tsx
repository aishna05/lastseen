'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { Buffer } from "buffer";

interface ProductCardProps {
  product: {
    id: number;
    title: string;
    price: number;
    imageUrls: string;
  };
  onAddToCart?: (productId: number) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {

  // Decode base64 JSON array safely
  let images: string[] = [];
  try {
      const jsonString = Buffer.from(product.imageUrls, "base64").toString();
      images = JSON.parse(jsonString);
  } catch {
      images = [];
  }

  const mainImage = images[0] || "";
  console.log("DECODED IMAGES ARRAY →", mainImage);

  useEffect(() => {
    console.log("FINAL DECODED IMAGE →", mainImage);
  }, [mainImage]);

  const imageBackgroundStyle = mainImage
    ? {
        backgroundImage: `url(${mainImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }
    : {
        backgroundColor: "transparent",
      };

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <div className="product-image" style={imageBackgroundStyle} />
      </div>

      <div className="product-details">
        <h4 className="product-title">{product.title}</h4>
        <p className="product-price">₹{product.price}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
