"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

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

  const createAddress = async () => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not authenticated");

    const res = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(address),
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Server error: Invalid response");
    }

    if (!res.ok) throw new Error(data.message || "Address creation failed");

    return data.newAddress.id;
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    setCheckoutLoading(true);

    try {
      const addressId = await createAddress();

      const res = await fetch("/api/order/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ addressId }),
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        alert("Order API returned invalid response");
        return;
      }

      if (!res.ok) {
        alert(data.message || "Order failed");
        return;
      }

      alert("Order placed successfully!");
      window.dispatchEvent(new Event("cartChange"));
      router.push("/orders");
    } catch (err: any) {
      console.error("ORDER ERROR:", err);
      alert(err.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.product.price *
        item.quantity *
        (1 - (item.product.discount ?? 0) / 100),
    0
  );

  return (
    <div className="profile-container">
      <div className="profile-card">

        {/* ✅ HIDE CART HEADER WHEN ADDRESS FORM IS OPEN */}
        {!showAddressForm && (
          <>
            <h1 className="profile-title">Your Cart</h1>
            <p className="profile-subtitle">Review your items before checkout</p>
          </>
        )}

        {loading && <p className="profile-message">Loading cart...</p>}

        {!loading && items.length === 0 && !showAddressForm && (
          <p className="profile-message error">Your cart is empty</p>
        )}

        {/* ✅ Cart Items */}
        {!loading && items.length > 0 && !showAddressForm && (
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
                    {(
                      item.product.price *
                      (1 - (item.product.discount ?? 0) / 100)
                    ).toFixed(2)}
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
                onClick={() => setShowAddressForm(true)}
                disabled={checkoutLoading}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}

        {/* ✅ Only Address Form Shows Now */}
        {showAddressForm && (
          <form onSubmit={handleCheckout} className="w-full mt-4 space-y-3">
            <h3 className="font-semibold">Delivery Address</h3>

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

            <div className="flex gap-3 mt-6">

              <button
                type="submit"
                className="btn-primary"
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Confirm Order"}
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowAddressForm(false)}
                disabled={checkoutLoading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
