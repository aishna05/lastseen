"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface SavedAddress {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
}

export default function OrderPage() {
  const params = useParams();
  const productId = Number(params.id);
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [newAddress, setNewAddress] = useState({
    phone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch saved addresses on mount
  useEffect(() => {
    if (!token) {
      setLoadingAddresses(false);
      return;
    }

    const fetchAddresses = async () => {
      try {
        const res = await fetch("/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const addresses = Array.isArray(data) ? data : data.addresses || [];
          setSavedAddresses(addresses);
          if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [token]);

  // Create new address
  async function createAddress() {
    const res = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Address creation failed");

    return data.newAddress.id;
  }

  // Add to cart
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

  // Handle order submission
  async function handlePlaceOrder(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      // Use selected address or create new one
      let addressId: number;
      if (showNewAddressForm) {
        addressId = await createAddress();
      } else {
        if (!selectedAddressId) {
          throw new Error("Please select an address or add a new one");
        }
        addressId = selectedAddressId;
      }

      await addToCart();
      router.push(`/checkout?productId=${productId}&quantity=${quantity}`);
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="page-shell">
        <div className="auth-page">
          <div className="auth-card">
            <h2 className="auth-title">Please Log In</h2>
            <p className="auth-subtitle">You need to be logged in to place an order</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="auth-page">
        <div className="auth-card order-card">
          <h2 className="auth-title">Quick Purchase</h2>
          <p className="auth-subtitle">Select delivery address and confirm</p>

          {message && <p className="auth-error">{message}</p>}

          <form onSubmit={handlePlaceOrder} className="auth-form">
            {/* Quantity */}
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

            {/* Saved Addresses */}
            {!loadingAddresses && savedAddresses.length > 0 && !showNewAddressForm && (
              <>
                <div className="address-section">
                  <label className="section-title">Select Delivery Address</label>
                  <div className="saved-addresses">
                    {savedAddresses.map((addr) => (
                      <label key={addr.id} className="address-option">
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                        />
                        <div className="address-content-box">
                          <p className="addr-text">
                            <strong>{addr.address}</strong>
                          </p>
                          <p className="addr-text">
                            {addr.city}, {addr.state} {addr.zipcode}
                          </p>
                          <p className="addr-text">{addr.country}</p>
                          <p className="addr-phone-text">
                            <strong>Phone:</strong> {addr.phone}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(true)}
                    className="btn-secondary mt-3"
                  >
                    + Add New Address
                  </button>
                </div>
              </>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0 || loadingAddresses) && (
              <>
                {showNewAddressForm && savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowNewAddressForm(false)}
                    className="btn-secondary mb-3"
                  >
                    ← Back to Saved Addresses
                  </button>
                )}

                <div className="address-form-section">
                  <h3 className="form-section-title">Delivery Address</h3>

                  <div className="auth-field">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={newAddress.phone}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, phone: e.target.value })
                      }
                      placeholder="Enter phone number"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Address</label>
                    <input
                      value={newAddress.address}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, address: e.target.value })
                      }
                      placeholder="Enter address"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>City</label>
                    <input
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      placeholder="Enter city"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>State/Province</label>
                    <input
                      value={newAddress.state}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, state: e.target.value })
                      }
                      placeholder="Enter state"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Country</label>
                    <input
                      value={newAddress.country}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, country: e.target.value })
                      }
                      placeholder="Enter country"
                      required
                    />
                  </div>

                  <div className="auth-field">
                    <label>Zip Code</label>
                    <input
                      value={newAddress.zipcode}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, zipcode: e.target.value })
                      }
                      placeholder="Enter zip code"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary mt-4">
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .order-card {
          max-width: 600px;
        }

        .address-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(176, 139, 72, 0.05);
          border-radius: 8px;
        }

        .section-title {
          display: block;
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.25rem;
          letter-spacing: 0.02em;
        }

        .saved-addresses {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .address-option {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.25rem;
          border: 2px solid #ddd;
          border-radius: 8px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .address-option:hover {
          border-color: #B08B48;
          background: #fafaf8;
        }

        .address-option input[type="radio"] {
          margin-top: 0.35rem;
          cursor: pointer;
          accent-color: #B08B48;
        }

        .address-content-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .addr-text {
          margin: 0;
          font-size: 0.9rem;
          color: #333;
          line-height: 1.4;
        }

        .addr-phone-text {
          margin: 0.5rem 0 0 0;
          font-size: 0.85rem;
          color: #B08B48;
          font-weight: 500;
        }

        .address-form-section {
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(176, 139, 72, 0.05);
          border-radius: 8px;
        }

        .form-section-title {
          font-size: 1rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.5rem;
          letter-spacing: 0.02em;
        }

        .mt-3 {
          margin-top: 1.5rem;
        }

        .mb-3 {
          margin-bottom: 1.5rem;
        }

        .mt-4 {
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}