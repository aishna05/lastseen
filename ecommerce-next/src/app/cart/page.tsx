"use client";

import { useEffect, useState } from "react";

export default function CartPage() {
  const [items, setItems] = useState<any[]>([]);

  async function fetchCart() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setItems(data);
  }

  async function handleRemove(id: number) {
    await fetch(`/api/cart/${id}`, { method: "DELETE" });
    fetchCart();
  }

  async function handleCheckout() {
    const res = await fetch("/api/order/create", { method: "POST" });
    if (res.ok) {
      alert("Order placed!");
      fetchCart();
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity * (1 - (item.product.discount ?? 0) / 100),
    0
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold mb-4">Your Cart</h1>

      {items.length === 0 && <p>Your cart is empty</p>}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="border p-3 rounded flex justify-between">
            <div>
              <p className="font-medium">{item.product.title}</p>
              <p>Quantity: {item.quantity}</p>
            </div>
            <button
              className="text-red-500 underline"
              onClick={() => handleRemove(item.id)}
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <p className="text-lg font-semibold">Total: ₹{total.toFixed(2)}</p>
          <button
            onClick={handleCheckout}
            className="mt-3 bg-black text-white px-4 py-2 rounded"
          >
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}
