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

  if (loading) return <p style={styles.loading}>Loading your orders...</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Your Orders</h1>

      {orders.length === 0 && (
        <p style={styles.empty}>You haven’t placed any orders yet.</p>
      )}

      <div style={styles.grid}>
        {orders.map((order) => (
          <div key={order.id} style={styles.card}>
            <div style={styles.header}>
              <span>Order #{order.id}</span>
              <span
                style={{
                  ...styles.status,
                  background:
                    order.status === "CANCELLED"
                      ? "#ffdddd"
                      : order.status === "PLACED"
                      ? "#ddffdd"
                      : "#fff3cd",
                }}
              >
                {order.status}
              </span>
            </div>

            <p style={styles.address}>
              📍 {order.address.address}, {order.address.city},{" "}
              {order.address.state}, {order.address.country} -{" "}
              {order.address.zipcode}
            </p>

            <ul style={styles.items}>
              {order.items.map((item) => (
                <li key={item.id} style={styles.item}>
                  <span>
                    {item.product.title} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>

            <div style={styles.footer}>
              {["PLACED", "PENDING"].includes(order.status) ? (
                <button
                  style={styles.cancelBtn}
                  disabled={cancelingId === order.id}
                  onClick={() => cancelOrder(order.id)}
                >
                  {cancelingId === order.id ? "Cancelling..." : "Cancel Order"}
                </button>
              ) : (
                <span style={styles.disabledText}>
                  Cancellation not available
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ✅ Inline CSS Styling */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "1000px",
    margin: "40px auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "28px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "20px",
  },
  card: {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    background: "#fff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  status: {
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },
  address: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "10px",
  },
  items: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
  footer: {
    marginTop: "10px",
    textAlign: "right",
  },
  cancelBtn: {
    background: "#ff4d4f",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  disabledText: {
    color: "#aaa",
    fontSize: "13px",
  },
  loading: {
    textAlign: "center",
    marginTop: "100px",
  },
  empty: {
    textAlign: "center",
    color: "#777",
  },
};
