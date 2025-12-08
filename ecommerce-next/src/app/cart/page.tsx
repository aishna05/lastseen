"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setItems([]);
      setLoading(false);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("CART FETCH ERROR:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const handleRemove = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/cart/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchCart();
        window.dispatchEvent(new Event("cartChange"));
      }
    } catch (err) {
      console.error("REMOVE ERROR:", err);
    }
  };

  // Checkout and redirect to order/[id]
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setCheckoutLoading(true);

    try {
      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch (err) {
        console.warn("No JSON returned from order API");
      }

      if (!res.ok) {
        console.error("ORDER ERROR:", data || res.statusText);
        alert(data?.message || "Failed to place order");
        return;
      }

      const orderId = data?.id;
      if (orderId) {
        router.push(`/order/${orderId}`);
      } else {
        alert("Order created but no order ID returned");
      }
    } catch (err) {
      console.error("ORDER ERROR:", err);
      alert("Something went wrong while placing the order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity * (1 - (item.product.discount ?? 0) / 100),
    0
  );

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Your Cart</h1>
        <p className="profile-subtitle">Review your items before checkout</p>

        {loading && <p className="profile-message">Loading cart...</p>}

        {!loading && items.length === 0 && (
          <p className="profile-message error">Your cart is empty</p>
        )}

        {!loading && items.length > 0 && (
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="profile-field flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>
                    Price: ₹
                    {(item.product.price * (1 - (item.product.discount ?? 0) / 100)).toFixed(2)}
                  </p>
                </div>
                <button
                  className="btn-primary"
                  onClick={() => handleRemove(item.id)}
                  disabled={checkoutLoading}
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="mt-4 flex flex-col items-start gap-2">
              <p className="font-semibold">Total: ₹{total.toFixed(2)}</p>
              <button
                className="btn-primary"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Proceed to Checkout"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
