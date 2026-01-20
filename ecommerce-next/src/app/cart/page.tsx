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
  
  // Address State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "", // Added phone
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

  const fetchAddresses = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/address", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        setSavedAddresses(data);
        // Default to first address if exists
        if (data.length > 0) {
            setSelectedAddressId(data[0].id);
            setUseNewAddress(false);
        } else {
            setUseNewAddress(true);
        }
      }
    } catch (err) {
      console.error("ADDRESS FETCH ERROR:", err);
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
      let finalAddressId = selectedAddressId;

      // If creating new address
      if (useNewAddress) {
         if(!address.phone) throw new Error("Phone number is required");
         finalAddressId = await createAddress();
      }

      if (!finalAddressId) throw new Error("Please select or add an address");

      // Redirect to checkout
      router.push(`/checkout?addressId=${finalAddressId}`);
    } catch (err: any) {
      console.error("ORDER ERROR:", err);
      alert(err.message || "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  };

  // Initial Fetch
  useEffect(() => {
    fetchCart();
  }, []);

  // Fetch addresses when form opens
  useEffect(() => {
    if (showAddressForm) {
      fetchAddresses();
    }
  }, [showAddressForm]);

  const total = items.reduce(
    (sum, item) =>
      sum +
      item.product.price *
        item.quantity *
        (1 - (item.product.discount ?? 0) / 100),
    0
  );

  return (
    <div className="page-shell" style={{ paddingBlock: "4rem", minHeight: "80vh" }}>
      
        {/* ✅ HIDE CART HEADER WHEN ADDRESS FORM IS OPEN */}
        {!showAddressForm && (
          <div style={{ marginBottom: "2rem", textAlign: "center" }}>
            <h1 className="profile-title" style={{ fontSize: "2.5rem" }}>Your Cart</h1>
            <p className="profile-subtitle">Review your items before checkout</p>
          </div>
        )}

        {loading && <p className="profile-message">Loading cart...</p>}

        {!loading && items.length === 0 && !showAddressForm && (
          <div className="order-empty">
            <p>Your cart is empty</p>
            <Link href="/products" className="btn-primary" style={{ marginTop: "1rem" }}>
              Continue Shopping
            </Link>
          </div>
        )}

        {/* ✅ Cart Items */}
        {!loading && items.length > 0 && !showAddressForm && (
          <div className="cart-advanced-container">
            {/* Cart Items Grid */}
            <div className="cart-items-grid">
              {items.map((item) => {
                // Decode images: Parse JSON string directly
                let images: string[] = [];
                try {
                  // If it's already an array, use it; otherwise parse it
                  if (Array.isArray(item.product.imageUrls)) {
                    images = item.product.imageUrls;
                  } else if (typeof item.product.imageUrls === "string") {
                     // Check if it looks like JSON
                     if (item.product.imageUrls.startsWith("[")) {
                         images = JSON.parse(item.product.imageUrls);
                     } else {
                         images = [item.product.imageUrls];
                     }
                  }
                } catch (e) {
                  console.error("Image parse error", e);
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
                          <img
                            src={mainImage}
                            alt={item.product.title}
                            className="cart-item-image"
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

        {/* ✅ Address & Checkout Form */}
        {showAddressForm && (
          <div className="max-w-md mx-auto">
          <div className="profile-card">
          <form onSubmit={handleCheckout} className="w-full space-y-4">
            <h3 className="font-semibold text-center mb-4" style={{fontSize: "1.5rem"}}>Delivery Details</h3>

            {/* 🔥 Toggle: Saved vs New */}
            {savedAddresses.length > 0 && (
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <button 
                        type="button"
                        className={!useNewAddress ? "btn-primary" : "btn-secondary"}
                        onClick={() => setUseNewAddress(false)}
                    >
                        Saved Address
                    </button>
                    <button 
                        type="button"
                        className={useNewAddress ? "btn-primary" : "btn-secondary"}
                        onClick={() => setUseNewAddress(true)}
                    >
                        New Address
                    </button>
                </div>
            )}

            {/* SCENARIO 1: Select Existing Address */}
            {!useNewAddress && savedAddresses.length > 0 && (
               <div className="space-y-3">
                    <p className="text-sm text-gray-400 mb-2">Select a saved address:</p>
                    {savedAddresses.map((addr) => (
                        <div 
                            key={addr.id} 
                            onClick={() => setSelectedAddressId(addr.id)}
                            style={{
                                border: selectedAddressId === addr.id ? '2px solid var(--primary)' : '1px solid var(--border-subtle)',
                                padding: '1rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                background: selectedAddressId === addr.id ? 'var(--bg-soft)' : 'transparent'
                            }}
                        >
                            <p style={{fontWeight: 600}}>{addr.address}</p>
                            <p className="text-sm">{addr.city}, {addr.state} - {addr.zipcode}</p>
                            {addr.phone && <p className="text-sm text-gray-500">📞 {addr.phone}</p>}
                        </div>
                    ))}
               </div>
            )}

            {/* SCENARIO 2: Create New Address */}
            {useNewAddress && (
                <div className="space-y-3 animation-fade-in">
                    <div className="auth-field">
                    <label>Address</label>
                    <input
                        value={address.address}
                        onChange={(e) => setAddress({ ...address, address: e.target.value })}
                        required
                    />
                    </div>

                    <div className="auth-field">
                    <label>City</label>
                    <input
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        required
                    />
                    </div>

                    <div className="auth-field">
                    <label>State</label>
                    <input
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        required
                    />
                    </div>

                    <div className="auth-field">
                    <label>Country</label>
                    <input
                        value={address.country}
                        onChange={(e) => setAddress({ ...address, country: e.target.value })}
                        required
                    />
                    </div>

                    <div className="auth-field">
                    <label>Zipcode</label>
                    <input
                        value={address.zipcode}
                        onChange={(e) => setAddress({ ...address, zipcode: e.target.value })}
                        required
                    />
                    </div>
                    
                    {/* ✅ New Phone Number Field */}
                    <div className="auth-field">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        required
                        placeholder="+91 XXXXX XXXXX"
                    />
                    </div>
                </div>
            )}

            {/* Actions with fixed spacing */}
            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-700" style={{ display: 'flex', gap: '1.5rem', marginTop: "2rem" }}>
              <button
                type="submit"
                className="btn-primary flex-1"
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Processing..." : "Confirm & Pay"}
              </button>

              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setShowAddressForm(false)}
                disabled={checkoutLoading}
              >
                Cancel
              </button>
            </div>
          </form>
          </div>
          </div>
        )}
    </div>
  );
}
