"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";

// Define the shape of the data returned from the API
interface SellerOrderItem {
  id: number;
  product: { title: string; imageUrls: string; id: number };
  quantity: number;
  price: number;
}

interface SellerOrder {
  id: number;
  createdAt: Date;
  status: string;
  total: number;
  sellerItems: SellerOrderItem[];
  sellerRevenue: number;
  address: {
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
}

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in as a seller to view orders.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/seller/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to fetch seller orders.");
          setOrders([]);
        } else {
          // Dates come as strings from API, map them to Date objects
          const formattedOrders = data.orders.map((order: any) => ({
            ...order,
            createdAt: new Date(order.createdAt),
          }));
          setOrders(formattedOrders);
          setError(null);
        }
      } catch (err) {
        console.error("Seller order fetch error:", err);
        setError("An unknown error occurred while fetching orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Utility function to get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "CANCELLED":
        return "status-cancelled";
      case "DELIVERED":
        return "status-delivered";
      case "SHIPPED":
      case "PROCESSING":
        return "status-shipped-processing";
      default: // PENDING, PLACED
        return "status-default";
    }
  };

  if (loading) return <p className="text-main p-8 text-center">Loading seller orders...</p>;

  if (error)
    return (
      <div className="orders-container page-shell">
        <h1 className="order-heading" style={{ color: "#AB2626" }}>Access Denied</h1>
        <p className="order-empty" style={{ borderColor: "#AB2626" }}>{error}</p>
      </div>
    );

  return (
    <div className="orders-container page-shell">
      <h1 className="order-heading">Orders for Your Products</h1>

      {orders.length === 0 && (
        <p className="order-empty">No orders have been placed for your products yet.</p>
      )}

      <div className="order-grid">
        {orders.map((order) => (
          <div key={order.id} className="order-card card">
            <div className="order-header">
              <span className="order-id-label">Order ID: {order.id}</span>
              <span className={`order-status ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <small className="order-date-time">
                Placed on: {format(order.createdAt, 'MMM dd, yyyy h:mm a')}
            </small>

            <div className="order-total-revenue">
                <p>Order Total (Customer Paid): <strong>₹{order.total.toFixed(2)}</strong></p>
                <p>Your Revenue Share: <strong className="text-primary-dark">₹{order.sellerRevenue.toFixed(2)}</strong></p>
            </div>

            <p className="order-address"><small>Phone Number:</small><br/>{order.address.phone}</p>
            <p className="order-address">
              <small>Shipping Address:</small><br/>
              {order.address.address}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
            </p>

            <h3 className="section-title-small">Items Sold by You:</h3>
            <ul className="order-items-list">
              {order.sellerItems.map((item) => (
                <li key={item.id} className="order-item seller-item">
                  <div className="item-details">
                    <span className="product-title-item">{item.product.title}</span> 
                    <span className="product-quantity">× {item.quantity}</span>
                  </div>
                  <span className="order-item-price">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="order-footer">
                {/* Seller actions like Update Status would go here */}
                <button className="btn-ghost-cancel" disabled>
                    Update Status (Planned)
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}