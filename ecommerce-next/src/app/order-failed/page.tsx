"use client";

import { useRouter } from "next/navigation";

export default function OrderFailedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Payment Failed
        </h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again.
        </p>

        {/* Reasons */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
          <p className="font-semibold text-gray-900 mb-2">Common reasons:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Insufficient balance in account</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Incorrect payment details</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Payment gateway timeout</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Network connection issues</span>
            </li>
          </ul>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Need Help?
              </p>
              <p className="text-sm text-gray-700">
                If the problem persists, please contact our support team at{" "}
                <a
                  href="mailto:support@lastseen.com"
                  className="text-blue-600 hover:underline"
                >
                  support@lastseen.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-[#B08B48] text-white py-3 rounded-lg font-semibold hover:bg-[#9a7a3e] transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={() => router.push("/cart")}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Cart
          </button>
          <button
            onClick={() => router.push("/")}
            className="w-full text-gray-600 py-2 hover:text-gray-900 transition-colors text-sm"
          >
            Continue Shopping
          </button>
        </div>

        {/* Transaction Note */}
        <p className="text-xs text-gray-500 mt-6">
          Note: If any amount was debited from your account, it will be refunded within 5-7 business days.
        </p>
      </div>
    </div>
  );
}