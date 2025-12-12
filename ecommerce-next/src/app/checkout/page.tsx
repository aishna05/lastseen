"use client";

import Script from "next/script";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface CartItem {
  id: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    imageUrls: string;
  };
}

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [cartTotal, setCartTotal] = useState(0);
  const [token, setToken] = useState<string | null>(null);

  const directProductId = searchParams.get("productId");
  const directQty = searchParams.get("quantity") || "1";

  // --- API FETCHERS ---

  const fetchAddresses = useCallback(async (authToken: string) => {
    try {
      const res = await fetch("/api/address", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data || []);
        if (data.length > 0) setSelectedAddressId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, []);

  // ✅ FIX 1: Single Product Calculation
async function fetchSingleProduct(id: string, qty: string) {
  try {
    const res = await fetch(`/api/product/${id}`);
    const data = await res.json();
    
    // Check if product is inside a wrapper like data.product
    const product = data.product || data; 

    if (product && product.price) {
      const singleItem = [{
        id: Number(id),
        quantity: Number(qty),
        product: product
      }];
      
      setCartItems(singleItem);
      // Ensure we use Number() to avoid string concatenation
      setCartTotal(Number(product.price) * Number(qty));
    } else {
      console.error("Price not found in product data:", product);
    }
  } catch (error) {
    console.error("Error fetching single product:", error);
  }
}

// ✅ FIX 2: Cart Total Calculation
async function fetchCartItems(authToken: string) {
  try {
    const res = await fetch("/api/cart", {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (res.ok) {
      const data = await res.json();
      // data should be an array of cart items
      const items = Array.isArray(data) ? data : (data.cartItems || []);
      
      setCartItems(items);
      
      const total = items.reduce((sum: number, item: any) => {
        const price = Number(item.product?.price || 0);
        const quantity = Number(item.quantity || 0);
        return sum + (price * quantity);
      }, 0);
      
      setCartTotal(total);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
}

  // --- LIFECYCLE ---

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
      
      // Load Data
      fetchAddresses(storedToken);
      if (directProductId) {
        fetchSingleProduct(directProductId, directQty);
      } else {
        fetchCartItems(storedToken);
      }
    }
  }, [router, directProductId, directQty, fetchAddresses, fetchCartItems, fetchSingleProduct]);

  // --- PAYMENT ---

  async function handlePay() {
    if (!selectedAddressId || cartItems.length === 0 || !token) {
      alert("Please select an address and ensure items are in your order.");
      return;
    };

    try {
      setLoading(true);
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          addressId: selectedAddressId,
          // Optional: send direct product info if needed by your backend
          directBuy: !!directProductId 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const options: any = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "LastSeen",
        description: "Luxe Purchase",
        order_id: data.orderId,
        theme: { color: "#B08B48" },
        handler: async function (response: any) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ...response,
              dbOrderId: data.dbOrderId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) router.push(`/order-success?orderId=${verifyData.orderId}`);
          else router.push("/order-failed");
        },
        modal: { ondismiss: () => setLoading(false) },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  }

  if (!token) return null;

  return (
    <div className="checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="checkout-container">
        <header className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Secure Payment — LastSeen Boutique</p>
        </header>

        <div className="checkout-grid">
          {/* LEFT: Address */}
          <main className="checkout-main">
            <section className="luxe-card">
              <h2 className="card-label">01. Shipping Details</h2>
              <div className="address-grid">
                {addresses.length === 0 ? (
                  <p className="text-muted text-sm">No addresses found. Please add one in profile.</p>
                ) : (
                  addresses.map((addr) => (
                    <label key={addr.id} className={`address-item ${selectedAddressId === addr.id ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="address"
                        className="hidden"
                        onChange={() => setSelectedAddressId(addr.id)}
                        checked={selectedAddressId === addr.id}
                      />
                      <div className="address-content">
                        <p className="addr-main">{addr.address}</p>
                        <p className="addr-sub">{addr.city}, {addr.state} {addr.zipcode}</p>
                      </div>
                      <div className="selection-indicator"></div>
                    </label>
                  ))
                )}
              </div>
            </section>
          </main>

          {/* RIGHT: Order Review */}
          <aside className="checkout-sidebar">
            <section className="luxe-card sticky-summary">
              <h2 className="card-label">02. Order Review</h2>
              <div className="summary-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span className="item-details">
                      <span className="item-name">{item.product.title}</span>
                      <span className="item-qty">x{item.quantity}</span>
                    </span>
                    <span className="item-price">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span className="free-tag">Complimentary</span>
                </div>
                <div className="total-row">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
              </div>

              <button className="pay-btn-luxe" onClick={handlePay} disabled={loading || cartItems.length === 0}>
                {loading ? "Authorizing..." : "Complete Purchase"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}