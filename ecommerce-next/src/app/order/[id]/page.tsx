"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function OrderPage() {
  const params = useParams();
  const productId = Number(params.id); // ✅ FIXED
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // ✅ 1. CREATE ADDRESS
async function createAddress() {
  const res = await fetch("/api/address", { // ← changed URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(address),
  });

  const text = await res.text();
  console.log("Raw API response:", text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error("Server is not returning JSON. Check API route.");
  }

  if (!res.ok) throw new Error(data.message || "Address failed");

  return data.newAddress.id;
}


  // ✅ 2. ADD TO CART
  async function addToCart() {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId,
        quantity,
      }),
    });

    if (!res.ok) throw new Error("Failed to add to cart");
  }

  // ✅ 3. PLACE ORDER
  async function placeOrder(addressId: number) {
    const res = await fetch("/api/order/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ addressId }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order failed");
  }

  // ✅ FINAL SUBMIT
  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const addressId = await createAddress();
      await addToCart();
      await placeOrder(addressId);

      router.push("/orders");
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Place Your Order</h2>
        <p className="auth-subtitle">Confirm your delivery details</p>

        {message && <p className="auth-error">{message}</p>}

        <form onSubmit={handlePlaceOrder} className="auth-form">
          {/* ✅ Quantity */}
          <div className="auth-field">
            <label>Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          {/* ✅ Address Fields */}
          <div className="auth-field">
            <label>Address</label>
            <input
              value={address.address}
              onChange={(e) =>
                setAddress({ ...address, address: e.target.value })
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>City</label>
            <input
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>State</label>
            <input
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Country</label>
            <input
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
              required
            />
          </div>

          <div className="auth-field">
            <label>Zipcode</label>
            <input
              value={address.zipcode}
              onChange={(e) =>
                setAddress({ ...address, zipcode: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? "Placing Order..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}
