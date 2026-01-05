"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  productId: number;
  availableSizes?: string[];
  sizeStock?: Record<string, number>;
}

export default function AddToCartButton({ productId, availableSizes = [], sizeStock = {} }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  async function handleAddToCart() {
  if (!token) {
    setMessage("You must be logged in to add items to cart");
    return;
  }

  try {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId, quantity: 1, size: selectedSize }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to add to cart");

    setMessage("Item added to cart!");

    //  THIS LINE UPDATES NAVBAR COUNT
    window.dispatchEvent(new Event("cartChange"));

  } catch (err: any) {
    setMessage(err.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <div className="w-full mb-2">
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {availableSizes && availableSizes.length > 0 && (
        <div className="mb-2">
          <div className="size-checkbox-group">
            {availableSizes.map((size) => {
              const qty = sizeStock?.[size] ?? 0;
              const disabled = qty <= 0;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => !disabled && setSelectedSize(size)}
                  className={`mr-2 mb-2 btn-primary ${selectedSize === size ? 'opacity-90' : ''}`}
                  disabled={disabled}
                  aria-pressed={selectedSize === size}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}
      <button
        onClick={handleAddToCart}
        disabled={loading || (availableSizes.length > 0 && !selectedSize)}
        className="btn-primary w-full"
      >
        {loading ? "Adding..." : availableSizes.length > 0 && !selectedSize ? "Select size" : "Add to Cart"}
      </button>
    </div>
  );
}
