"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Address {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  phone: string;
}

export default function AddressesPage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    zipcode: "",
    phone: "",
  });
  const [savingForm, setSavingForm] = useState(false);

  // Load token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
      if (!t) {
        router.push("/login");
      }
    }
  }, [router]);

  // Fetch addresses
  useEffect(() => {
    if (!token) return;

    async function fetchAddresses() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/address", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data.addresses || [];
          setAddresses(list);
        } else {
          setError("Failed to load addresses");
        }
      } catch (err: any) {
        setError(err.message || "Error loading addresses");
      } finally {
        setLoading(false);
      }
    }

    fetchAddresses();
  }, [token]);

  // Handle form input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle add address
  async function handleAddAddress(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    // Validation
    if (
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.country ||
      !formData.zipcode ||
      !formData.phone
    ) {
      setError("All fields are required");
      return;
    }

    // Phone validation (basic)
    if (formData.phone.length < 10) {
      setError("Phone number must be at least 10 digits");
      return;
    }

    try {
      setSavingForm(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setAddresses((prev) => [...prev, data.newAddress]);
        setFormData({
          address: "",
          city: "",
          state: "",
          country: "",
          zipcode: "",
          phone: "",
        });
        setShowForm(false);
        setSuccess("Address added successfully!");
      } else {
        setError(data.error || "Failed to add address");
      }
    } catch (err: any) {
      setError(err.message || "Error adding address");
    } finally {
      setSavingForm(false);
    }
  }

  // Handle delete address
  async function handleDeleteAddress(addressId: number) {
    if (!confirm("Are you sure you want to delete this address?")) return;
    if (!token) return;

    try {
      setDeleting(addressId);
      setError(null);

      const res = await fetch(`/api/address/${addressId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== addressId));
        setSuccess("Address deleted successfully");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete address");
      }
    } catch (err: any) {
      setError(err.message || "Error deleting address");
    } finally {
      setDeleting(null);
    }
  }

  if (!token) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1 className="profile-title">Manage Addresses</h1>
          <p className="text-main">Please log in first.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Manage Addresses</h1>

        {error && <p className="profile-message error">{error}</p>}
        {success && <p className="profile-message success">{success}</p>}

        {/* Add Address Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary mb-3"
          >
            + Add New Address
          </button>
        )}

        {/* Add Address Form */}
        {showForm && (
          <form onSubmit={handleAddAddress} className="profile-form">
            <div className="profile-field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter your address"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="city">City</label>
              <input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="Enter city"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="state">State/Province</label>
              <input
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="Enter state"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="country">Country</label>
              <input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder="Enter country"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="zipcode">Zip Code</label>
              <input
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="Enter zip code"
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={savingForm} className="btn-primary">
                {savingForm ? "Saving..." : "Save Address"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({
                    address: "",
                    city: "",
                    state: "",
                    country: "",
                    zipcode: "",
                    phone: "",
                  });
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <hr className="profile-divider" />

        {/* Addresses List */}
        <h2 className="profile-title" style={{ fontSize: "1.2rem", marginTop: "2rem" }}>
          Your Addresses
        </h2>

        {loading ? (
          <p>Loading addresses...</p>
        ) : addresses.length === 0 ? (
          <p className="text-main">No addresses saved yet.</p>
        ) : (
          <div className="addresses-list">
            {addresses.map((addr) => (
              <div key={addr.id} className="address-card">
                <div className="address-info">
                  <p>
                    <strong>{addr.address}</strong>
                  </p>
                  <p>
                    {addr.city}, {addr.state} {addr.zipcode}
                  </p>
                  <p>{addr.country}</p>
                  <p>
                    <strong>Phone:</strong> {addr.phone}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteAddress(addr.id)}
                  disabled={deleting === addr.id}
                  className="btn-delete"
                >
                  {deleting === addr.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .addresses-list {
          display: grid;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .address-card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          background: #f9f9f9;
        }

        .address-info {
          flex: 1;
        }

        .address-info p {
          margin: 0.5rem 0;
          font-size: 0.95rem;
          color: #333;
        }

        .btn-primary {
          background: #B08B48;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-primary:hover {
          background: #9a7a3d;
        }

        .btn-secondary {
          background: #ccc;
          color: #333;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-secondary:hover {
          background: #bbb;
        }

        .btn-delete {
          background: #e74c3c;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        }

        .btn-delete:hover {
          background: #c0392b;
        }

        .mb-3 {
          margin-bottom: 1.5rem;
        }

        .profile-message {
          padding: 1rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }

        .profile-message.error {
          background: #fee;
          color: #c33;
        }

        .profile-message.success {
          background: #efe;
          color: #3c3;
        }
      `}</style>
    </div>
  );
}
