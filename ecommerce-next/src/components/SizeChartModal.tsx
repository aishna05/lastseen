"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";

export default function SizeChartModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm font-medium mb-3 hover:text-[#D4BC84] transition-colors"
        style={{ color: "var(--primary)" }}
      >
        <Ruler size={16} />
        <span>Size Chart</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            style={{ 
              backgroundColor: "var(--bg-elevated)", 
              color: "var(--text-main)",
              border: "1px solid var(--border-strong)"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-black/20 transition-colors"
              aria-label="Close size chart"
            >
              <X size={24} color="var(--primary)" />
            </button>

            <h2 className="text-2xl font-serif text-center mb-8" style={{ color: "var(--primary-strong)" }}>
              Size Guide
            </h2>

            <div className="space-y-10">
              
              {/* SHIRTS TABLE */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b border-[#523A24] pb-2 text-[#D4BC84]">
                  👕 Men&apos;s Shirt Size Chart (XS – 5XL)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 pr-4 font-normal">Size</th>
                        <th className="py-2 pr-4 font-normal">Chest (in)</th>
                        <th className="py-2 pr-4 font-normal">Shoulder (in)</th>
                        <th className="py-2 pr-4 font-normal">Shirt Length (in)</th>
                        <th className="py-2 font-normal">Sleeve Length (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#523A24]/30">
                      {[
                        ["XS", "34", "16", "26", "23"],
                        ["S", "36", "17", "27", "23.5"],
                        ["M", "38", "18", "28", "24"],
                        ["L", "40", "18.5", "29", "24.5"],
                        ["XL", "42", "19", "30", "25"],
                        ["2XL", "44", "19.5", "31", "25.5"],
                        ["3XL", "46", "20", "31.5", "26"],
                        ["4XL", "48", "20.5", "32", "26.5"],
                        ["5XL", "50", "21", "33", "27"],
                      ].map(([size, chest, shoulder, length, sleeve]) => (
                        <tr key={size} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 pr-4 font-semibold text-[#D4BC84]">{size}</td>
                          <td className="py-2 pr-4">{chest}</td>
                          <td className="py-2 pr-4">{shoulder}</td>
                          <td className="py-2 pr-4">{length}</td>
                          <td className="py-2">{sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* PANTS TABLE */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b border-[#523A24] pb-2 text-[#D4BC84]">
                  👖 Men&apos;s Pants (Trousers) Waist Size Chart
                </h3>
                <p className="text-xs mb-3 italic opacity-80" style={{ color: "var(--text-muted)" }}>
                  Waist Range: 26 – 46 | Standard length: 40–42 inches, customizable
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 pr-4 font-normal">Size Label</th>
                        <th className="py-2 pr-4 font-normal">Waist (in)</th>
                        <th className="py-2 font-normal">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#523A24]/30">
                      {[
                        ["26", "26", "34"],
                        ["28", "28", "36"],
                        ["30", "30", "38"],
                        ["32", "32", "40"],
                        ["34", "34", "42"],
                        ["36", "36", "44"],
                        ["38", "38", "46"],
                        ["40", "40", "48"],
                        ["42", "42", "50"],
                        ["44", "44", "52"],
                        ["46", "46", "54"],
                      ].map(([size, waist, hip]) => (
                        <tr key={size} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 pr-4 font-semibold text-[#D4BC84]">{size}</td>
                          <td className="py-2 pr-4">{waist}</td>
                          <td className="py-2">{hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* JEANS TABLE */}
              <section>
                <h3 className="text-lg font-semibold mb-4 border-b border-[#523A24] pb-2 text-[#D4BC84]">
                  👖 Men&apos;s Jeans Waist Size Chart
                </h3>
                 <p className="text-xs mb-3 italic opacity-80" style={{ color: "var(--text-muted)" }}>
                  Waist Range: 26 – 42
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 pr-4 font-normal">Jeans Size</th>
                        <th className="py-2 pr-4 font-normal">Waist (in)</th>
                        <th className="py-2 font-normal">Hip (in)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#523A24]/30">
                      {[
                        ["26", "26", "34"],
                        ["28", "28", "36"],
                        ["30", "30", "38"],
                        ["32", "32", "40"],
                        ["34", "34", "42"],
                        ["36", "36", "44"],
                        ["38", "38", "46"],
                        ["40", "40", "48"],
                        ["42", "42", "50"],
                      ].map(([size, waist, hip]) => (
                        <tr key={size} className="hover:bg-white/5 transition-colors">
                          <td className="py-2 pr-4 font-semibold text-[#D4BC84]">{size}</td>
                          <td className="py-2 pr-4">{waist}</td>
                          <td className="py-2">{hip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
              
            </div>
          </div>
        </div>
      )}
    </>
  );
}
