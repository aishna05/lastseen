// /src/components/products/ProductListingClient.tsx
'use client';

import React from 'react';
import ProductCard from './ProductCard'; // Assuming ProductCard is in the same directory

// Define the expected prop type based on what the server component passes
interface ProductListingClientProps {
    products: Array<{
        id: number;
        title: string;
        price: number;
        imageUrls: string;
        // ... any other static data
    }>;
}

// Define the client-side event handler here
const handleAddToCart = async (productId: number) => {
    // 1. Get the Auth Token (Crucial for your API's JWT check)
    const token = localStorage.getItem('auth_token'); // Assuming token is stored here
    
    if (!token) {
        alert("Please log in to add items to your cart.");
        // Redirect to login page
        window.location.href = '/login'; 
        return;
    }

    try {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 2. Pass the token in the Authorization header
                'Authorization': `Bearer ${token}`, 
            },
            // 3. Send the necessary data in the request body
            body: JSON.stringify({ productId: productId, quantity: 1 }), 
        });

        const data = await response.json();

        if (response.ok) {
            // Success: Item was created or quantity was updated
            alert(`Success! "${data.item.product?.title || 'Item'}" added to cart.`);
            
            // Optional: You may want to trigger a cart icon refresh here 
            // via a global context or state management solution.
        } else {
            // Failure (e.g., 403 Forbidden, 401 Unauthorized, 400 Bad Request)
            alert(`Failed to add item: ${data.message || data.error}`);
        }
    } catch (error) {
        console.error('Network or system error adding to cart:', error);
        alert('An unexpected error occurred. Please try again.');
    }
};

const ProductListingClient: React.FC<ProductListingClientProps> = ({ products }) => {
    return (
        <div className="py-12">
            <h1 className="text-4xl mb-10" style={{color: 'var(--primary)'}}>
                All Discoveries
            </h1>
            
            {products.length === 0 ? (
                <p className="text-center mt-10" style={{color: 'var(--text-muted)'}}>
                    No products found at this time. Check back soon!
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {products.map((p) => (
                        <ProductCard
                            key={p.id}
                            product={p}
                            onAddToCart={handleAddToCart} // Now, this function is defined within a Client Component!
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductListingClient;