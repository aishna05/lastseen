'use client';

import React from 'react';
import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  price: number;
  imageUrls: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => void | Promise<void>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <div
          className="product-image"
          style={{ backgroundImage: `url(${product.imageUrls})` }}
        ></div>
      </div>

      <div className="product-details">
        <h4 className="product-title">{product.title}</h4>
        <p className="product-price">{formattedPrice}</p>

        {/* Center CTA Button */}
        {/* <Link href={`/product/${product.id}`}>
  <button className="product-view-btn">
    View Product
  </button>
        </Link> */}
      </div>
    </Link>
  );
};

export default ProductCard;
