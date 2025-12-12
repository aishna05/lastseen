"use client";

import { useRouter } from "next/navigation";

export default function OrderFailedPage() {
  const router = useRouter();

  return (
    <div className="failed-page">
      <div className="failed-card">
        {/* Luxe Error Icon */}
        <div className="failed-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="failed-title">Payment Declined</h1>
        <p className="failed-message">
          We were unable to authorize your transaction. Please review your details and try again.
        </p>

        {/* Reason Box */}
        <div className="failed-reason-box">
          <p className="reason-header">Possible reasons:</p>
          <ul className="reason-list">
            <li>Insufficient funds or limit exceeded</li>
            <li>Incorrect card or verification details</li>
            <li>Secure gateway connection timeout</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="failed-actions">
          <button
            onClick={() => router.push("/checkout")}
            className="btn-failed-primary"
          >
            Retry Payment
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="btn-failed-ghost"
          >
            Review Cart
          </button>
        </div>

        <div className="failed-support">
          <p>
            Need assistance? <a href="mailto:support@lastseen.com">Contact Concierge</a>
          </p>
        </div>

        <p className="refund-note">
          Note: Any debited amounts are typically reversed by your bank within 5-7 business days.
        </p>
      </div>
    </div>
  );
}