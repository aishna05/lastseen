'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrls: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {

  // ✅ Convert string-array to actual image URL
  let imageUrl = "";
  try {
    const parsed = JSON.parse(product.imageUrls); // convert string → array
    imageUrl = Array.isArray(parsed) ? parsed[0] : parsed;
  } catch {
    imageUrl = product.imageUrls;
  }

  useEffect(() => {
    console.log("FINAL IMAGE USED 👉", imageUrl);
  }, [imageUrl]);

  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <div
          className="product-image"
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </div>

      <div className="product-details">
        <h4 className="product-title">{product.title}</h4>
        <p className="product-price">{formattedPrice}</p>
      </div>
    </Link>
  );
};

export default ProductCard;
