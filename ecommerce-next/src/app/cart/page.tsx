"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Buffer } from "buffer";

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

      // Redirect to checkout and let checkout initiate the payment and create the order
      // Pass the newly created addressId so checkout can preselect it
      router.push(`/checkout?addressId=${addressId}`);
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
          <div className="cart-advanced-container">
            {/* Cart Items Grid */}
            <div className="cart-items-grid">
              {items.map((item) => {
                // Decode images from base64
                let images: string[] = [];
                try {
                  const jsonString = Buffer.from(item.product.imageUrls, "base64").toString();
                  images = JSON.parse(jsonString);
                } catch {
                  images = [];
                }
                const mainImage = images[0] || "";

                const itemPrice = item.product.price * (1 - (item.product.discount ?? 0) / 100);
                const itemTotal = itemPrice * item.quantity;

                return (
                  <div key={item.id} className="cart-item-card">
                    {/* Product Image - Clickable */}
                    <Link href={`/product/${item.product.id}`}>
                      <div className="cart-item-image-wrapper">
                        {mainImage ? (
                          <div
                            className="cart-item-image"
                            style={{
                              backgroundImage: `url(${mainImage})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                        ) : (
                          <div className="cart-item-image-placeholder">
                            No Image
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Product Details */}
                    <div className="cart-item-details">
                      <Link href={`/product/${item.product.id}`}>
                        <h3 className="cart-item-title">{item.product.title}</h3>
                      </Link>

                      {item.size && (
                        <p className="cart-item-size">Size: <strong>{item.size}</strong></p>
                      )}

                      <p className="cart-item-price">
                        ₹{itemPrice.toFixed(2)} x {item.quantity} = <strong>₹{itemTotal.toFixed(2)}</strong>
                      </p>

                      {item.product.discount > 0 && (
                        <p className="cart-item-discount">
                          {item.product.discount}% OFF
                        </p>
                      )}

                      <button
                        className="cart-item-remove-btn"
                        onClick={() => handleRemove(item.id)}
                        disabled={checkoutLoading}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="cart-summary-section">
              <h2>Order Summary</h2>
              <div className="cart-summary-details">
                <div className="summary-row">
                  <span>Subtotal:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className="summary-divider"></div>
                <div className="summary-row summary-total">
                  <span>Total:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="btn-primary w-full cart-checkout-btn"
                onClick={() => setShowAddressForm(true)}
                disabled={checkoutLoading}
              >
                Proceed to Checkout
              </button>

              <Link href="/products">
                <button className="btn-secondary w-full" style={{ marginTop: "0.5rem" }}>
                  Continue Shopping
                </button>
              </Link>
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
