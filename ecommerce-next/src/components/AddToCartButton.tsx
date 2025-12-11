"use client";

import { useState } from "react";

interface AddToCartButtonProps {
  productId: number;
}

export default function AddToCartButton({ productId }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
      body: JSON.stringify({ productId, quantity: 1 }),
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
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="btn-primary w-full"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  );
}
