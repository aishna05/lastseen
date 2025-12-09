"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  product: { title: string; price: number };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
  address: {
    address: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelingId(orderId);
      const token = localStorage.getItem("token");

      const res = await fetch("/api/order/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Cancel failed");
        return;
      }

      // ✅ Update UI instantly
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );

      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Something went wrong");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) return <p className="text-main p-8">Loading your orders...</p>;

  return (
 <div className="orders-container page-shell">
 <h1 className="order-heading">Your Orders</h1>

{orders.length === 0 && (
 <p className="order-empty">You haven’t placed any orders yet.</p>
 )}

<div className="order-grid">
 {orders.map((order) => {
            // Determine the status class
            const statusClass = 
                order.status === "CANCELLED" ? "status-cancelled" :
                order.status === "PLACED" ? "status-placed" :
                "status-default";

            // Calculate total amount for display purposes (not strictly needed by API but good UI practice)
            const totalAmount = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return (
                <div key={order.id} className="order-card card">
                    <div className="order-header">
                        <span className="order-id-label">Order #{order.id}</span>
                        <span className={`order-status ${statusClass}`}>
                            {order.status}
                        </span>
                    </div>

                    <p className="order-address">
                        <small>Shipping To:</small><br/>
                        {order.address.address}, {order.address.city}, {order.address.state}, {order.address.country} - {order.address.zipcode}
                    </p>

                    <ul className="order-items-list">
                        {order.items.map((item) => (
                            <li key={item.id} className="order-item">
                                <span>
                                    {item.product.title} × {item.quantity}
                                </span>
                                <span className="order-item-price">
                                    ₹{item.price * item.quantity}
                                </span>
                            </li>
                        ))}
                    </ul>
                    
                    <div className="order-total">
                        <strong>Total Paid:</strong>
                        <strong>₹{totalAmount.toFixed(2)}</strong>
                    </div>

                    <div className="order-footer">
                        {["PLACED", "PENDING", "PROCESSING"].includes(order.status) ? (
                            <button
                                className="order-cancel-btn btn-delete-account"
                                disabled={cancelingId === order.id}
                                onClick={() => cancelOrder(order.id)}
                            >
                                {cancelingId === order.id ? "Cancelling..." : "Cancel Order"}
                            </button>
                        ) : (
                            <span className="order-cancellation-disabled">
                                Cancellation not available
                            </span>
                        )}
                    </div>
                </div>
            );
        })}
</div>
 </div>
 );
}