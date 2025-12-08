// /src/components/products/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// Define the expected structure for a product item
interface Product {
  id: number;
  title: string;
  price: number;
  // You would typically include imageUrls, description, etc., here too
  imageUrls: string; // Assuming this holds a single primary image URL for the card
}

interface ProductCardProps {
  product: Product;
  // Handler for adding the product to the cart
  onAddToCart: (productId: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  // Simple handler to simulate adding to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent accidental navigation if card is a link
    e.stopPropagation(); // Stop click from propagating to the parent card link
    
    // Call the provided function with the product ID
    onAddToCart(product.id);
    
    // Optional: Provide user feedback
    console.log(`Added product ${product.id} to cart.`);
    alert(`"${product.title}" added to cart!`); 
  };
  
  // Format the price for display
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(product.price);
  
  return (
    // Wrap the entire card in a Link to the product's detail page
    <Link href={`/products/${product.id}`} passHref>
      <div className="card product-card group hover:shadow-lg hover:border-strong transition-all duration-300">
        
        {/* Product Image Area */}
        <div className="relative w-full aspect-square overflow-hidden rounded-md mb-4 bg-gray-900">
            {/* Replace this placeholder with an actual Image component using product.imageUrls[0] */}
            <div 
                style={{ 
                    // Using a placeholder image/color for demonstration
                    backgroundImage: `url(${product.imageUrls})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '200px'
                }}
                className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105 flex items-center justify-center"
            >
                {/* Fallback Text for Image */}
                <span className="text-xs" style={{ color: 'var(--text-soft)' }}>
                    [Image Placeholder]
                </span>
            </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col space-y-2">
          {/* Product Name */}
          <h4 
            className="text-lg font-semibold truncate" 
            style={{ color: 'var(--text-main)', letterSpacing: '0.01em' }}
          >
            {product.title}
          </h4>
          
          {/* Price */}
          <p className="text-xl font-bold" style={{ color: 'var(--primary)' }}>
            {formattedPrice}
          </p>
          
          {/* Add to Cart Button */}
          <button 
            className="btn-primary w-full mt-3" 
            onClick={handleAddToCart}
            style={{ 
                padding: '0.6rem', 
                fontSize: '0.9rem', 
                letterSpacing: '0.08em' 
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;