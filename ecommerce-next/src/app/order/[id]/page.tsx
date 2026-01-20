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
        console.log("Fetching addresses with token:", token);
        const res = await fetch("/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Address API response status:", res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log("Addresses received:", data);
          const addresses = Array.isArray(data) ? data : data.addresses || [];
          setSavedAddresses(addresses);
          if (addresses.length > 0) {
            setSelectedAddressId(addresses[0].id);
          }
        } else {
          const errorData = await res.json();
          console.error("Address API error:", errorData);
          setMessage(`Failed to load addresses: ${errorData.error || errorData.message}`);
        }
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setMessage("Error loading addresses. Please try again.");
      } finally {
        setLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [token]);

  // Create new address
  async function createAddress() {
    console.log("Creating address:", newAddress);
    const res = await fetch("/api/address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newAddress),
    });

    console.log("Create address response status:", res.status);
    const data = await res.json();
    console.log("Create address response:", data);
    
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

      if (!token) {
        throw new Error("Not authenticated. Please log in first.");
      }

      // Use selected address or create new one
      let addressId: number;
      if (showNewAddressForm || savedAddresses.length === 0) {
        // Validate new address fields
        if (!newAddress.phone || !newAddress.address || !newAddress.city || !newAddress.state || !newAddress.country || !newAddress.zipcode) {
          throw new Error("Please fill in all address fields");
        }
        addressId = await createAddress();
      } else {
        if (!selectedAddressId) {
          throw new Error("Please select an address");
        }
        addressId = selectedAddressId;
      }

      await addToCart();
      router.push(`/checkout?productId=${productId}&quantity=${quantity}`);
    } catch (err: any) {
      console.error("Order submission error:", err);
      setMessage(err.message || "An error occurred. Please try again.");
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
          max-width: 650px;
          margin: 2rem auto;
        }

        .auth-field {
          margin-bottom: 1.75rem;
        }

        .auth-field label {
          display: block;
          margin-bottom: 0.65rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: #333;
          letter-spacing: 0.02em;
        }

        .auth-field input {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        .auth-field input:focus {
          outline: none;
          border-color: #B08B48;
          box-shadow: 0 0 0 3px rgba(176, 139, 72, 0.1);
        }

        .address-section {
          margin: 2.5rem 0;
          padding: 2rem;
          background: rgba(176, 139, 72, 0.06);
          border: 1px solid rgba(176, 139, 72, 0.15);
          border-radius: 10px;
        }

        .section-title {
          display: block;
          font-size: 1.05rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 1.75rem;
          letter-spacing: 0.03em;
        }

        .saved-addresses {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .address-option {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.5rem;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: #fff;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .address-option:hover {
          border-color: #B08B48;
          background: #fafaf8;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .address-option input[type="radio"] {
          margin-top: 0.5rem;
          cursor: pointer;
          accent-color: #B08B48;
          width: 18px;
          height: 18px;
          flex-shrink: 0;
        }

        .address-content-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .addr-text {
          margin: 0;
          font-size: 0.95rem;
          color: #333;
          line-height: 1.5;
        }

        .addr-text strong {
          font-weight: 600;
        }

        .addr-phone-text {
          margin: 0.75rem 0 0 0;
          font-size: 0.9rem;
          color: #B08B48;
          font-weight: 600;
        }

        .address-form-section {
          margin: 2.5rem 0;
          padding: 2rem;
          background: rgba(176, 139, 72, 0.06);
          border: 1px solid rgba(176, 139, 72, 0.15);
          border-radius: 10px;
        }

        .form-section-title {
          font-size: 1.05rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 2rem;
          letter-spacing: 0.03em;
        }

        .mt-3 {
          margin-top: 1.75rem;
        }

        .mb-3 {
          margin-bottom: 1.75rem;
        }

        .mt-4 {
          margin-top: 2.5rem;
        }

        .btn-primary {
          width: 100%;
          padding: 1rem;
          background: #B08B48;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-top: 2.5rem;
        }

        .btn-primary:hover:not(:disabled) {
          background: #9a7a3d;
        }

        .btn-secondary {
          width: 100%;
          padding: 0.85rem;
          background: #B08B48;
          color: white;
          border: 1px solid #B08B48;
          border-radius: 6px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #9a7a3d;
          border-color: #9a7a3d;
        }

        .auth-error {
          background: #fee;
          color: #c33;
          padding: 1rem;
          border-radius: 6px;
          margin-bottom: 1.5rem;
          border: 1px solid #c33;
          font-weight: 500;
        }

        .auth-subtitle {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
}