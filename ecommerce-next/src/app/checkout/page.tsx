// app/checkout/page.tsx
"use client";

import Script from "next/script";
import { useState } from "react";

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    try {
      setLoading(true);

      // 1. Get amount from your cart or server
      const amount = 1999; // in rupees – ideally fetched from API

      // 2. Create Razorpay order on backend
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }), // send rupees
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to create order");
        return;
      }

      const options: any = {
        key: data.key, // NEXT_PUBLIC_RAZORPAY_KEY_ID
        amount: data.amount, // in paise
        currency: data.currency,
        name: "LastSeen",
        description: "Order payment",
        order_id: data.orderId,
        theme: { color: "#B08B48" }, // optional: match your gold
        handler: async function (response: any) {
          // response: { razorpay_payment_id, razorpay_order_id, razorpay_signature }
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            alert("Payment successful!");
            // redirect to success page, update UI, etc.
          } else {
            alert("Payment verification failed");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
      };

      // @ts-ignore - Razorpay is added by external script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error(err);
      alert("Payment error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Razorpay script */}
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="checkout-page">
        {/* your checkout UI here */}

        <button
          className="btn-primary"
          onClick={handlePay}
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with Razorpay"}
        </button>
      </div>
    </>
  );
}
