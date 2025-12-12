"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsAnimate(true);

    // Redirect if someone tries to access page without an ID
    if (!orderId) {
      const timer = setTimeout(() => router.push("/"), 5000);
      return () => clearTimeout(timer);
    }
  }, [orderId, router]);

  return (
    <div className={`success-page ${isAnimate ? "entry-animate" : ""}`}>
      <div className="success-card">
        <div className="success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M20 6L9 17L4 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="success-title">Order Confirmed</h1>
        <p className="success-message">
          Thank you for choosing LastSeen. Your selection is being prepared with care.
        </p>

        <div className="order-details-box">
          <span className="detail-label">Order Reference</span>
          <span className="detail-value">#{orderId || "Processing..."}</span>
        </div>

        <div className="success-actions">
          <Link href="/profile/orders" className="btn-success-primary">
            View My Orders
          </Link>
          <Link href="/" className="btn-success-ghost">
            Return to Boutique
          </Link>
        </div>

        <p className="success-footer">
          A confirmation email has been dispatched to your registered address.
        </p>
      </div>
    </div>
  );
}

// ✅ WRAP IN SUSPENSE TO FIX BUILD ERROR
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="success-loading">
        <div className="loader-gold"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}