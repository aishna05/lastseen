"use client";

import Script from "next/script";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// --- INTERFACES ---
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

// --- INNER CONTENT COMPONENT ---
function CheckoutContent() {
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
        const list = Array.isArray(data) ? data : (data.addresses || []);
        setAddresses(list);
        if (list.length > 0) setSelectedAddressId(list[0].id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    }
  }, []);

  const fetchSingleProduct = useCallback(async (id: string, qty: string) => {
    try {
      const res = await fetch(`/api/product/${id}`);
      const data = await res.json();
      const product = data.product || data; 

      if (product && (product.price || product.amount)) {
        const price = Number(product.price || product.amount);
        const quantity = Number(qty);
        setCartItems([{ id: Number(id), quantity, product }]);
        setCartTotal(price * quantity);
      }
    } catch (error) {
      console.error("Error fetching single product:", error);
    }
  }, []);

  const fetchCartItems = useCallback(async (authToken: string) => {
    try {
      const res = await fetch("/api/cart", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        const items = Array.isArray(data) ? data : (data.cartItems || []);
        setCartItems(items);
        
        const total = items.reduce((sum: number, item: any) => {
          const p = Number(item.product?.price || 0);
          const q = Number(item.quantity || 0);
          return sum + (p * q);
        }, 0);
        setCartTotal(total);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  }, []);

  // --- LIFECYCLE ---

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      router.push("/login");
    } else {
      setToken(storedToken);
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
      alert("Please ensure an address is selected and your order is not empty.");
      return;
    }

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
          directBuy: !!directProductId,
          productId: directProductId,
          quantity: directQty
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const options: any = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "LastSeen",
        description: "Boutique Purchase",
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
          if (verifyData.success) {
            router.push(`/order-success?orderId=${verifyData.orderId}`);
          } else {
            router.push("/order-failed");
          }
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

  if (!token) return <div className="checkout-loading">Authenticating Boutique Access...</div>;

  return (
    <div className="checkout-page">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      
      <div className="checkout-container">
        <header className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Secure Selection — LastSeen Boutique</p>
        </header>

        <div className="checkout-grid">
          {/* LEFT: Shipping */}
          <main className="checkout-main">
            <section className="luxe-card">
              <h2 className="card-label">01. Delivery Destination</h2>
              <div className="address-grid">
                {addresses.length === 0 ? (
                  <div className="empty-addresses">
                    <p>No addresses found.</p>
                    <button onClick={() => router.push("/profile/addresses")}>Add Address</button>
                  </div>
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

          {/* RIGHT: Summary */}
          <aside className="checkout-sidebar">
            <section className="luxe-card sticky-summary">
              <h2 className="card-label">02. Order Review</h2>
              <div className="summary-list">
                {cartItems.map((item) => (
                  <div key={item.id} className="summary-row">
                    <span className="item-details">
                      <span className="item-name">{item.product.title}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </span>
                    <span className="item-price">₹{Number(item.product.price * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="price-breakdown">
                <div className="breakdown-row">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
                </div>
                <div className="breakdown-row">
                  <span>Shipping</span>
                  <span className="free-tag">Complimentary</span>
                </div>
                <div className="total-row">
                  <span>Total Amount</span>
                  <span>₹{cartTotal.toFixed(0)}</span>
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

// ✅ EXPORT WITH SUSPENSE BOUNDARY
export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="checkout-loading">Preparing your checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}