"use client";

import { useState } from "react";
import { Ruler, X } from "lucide-react";

export default function SizeChartModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Trigger Button: Styled like a small pill/message popup */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-3 hover:scale-105 transition-all shadow-md"
        style={{ 
          backgroundColor: "var(--bg-elevated)", 
          color: "var(--primary)",
          border: "1px solid var(--border-strong)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
        }}
      >
        <Ruler size={14} />
        <span>Size Guide</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          
          {/* Modal Content - Reduced dimensions and font size */}
          <div 
            className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto rounded-xl p-5 shadow-2xl animate-in zoom-in-95 duration-200 custom-scrollbar"
            style={{ 
              backgroundColor: "var(--bg-elevated)", 
              color: "var(--text-main)",
              border: "1px solid var(--border-strong)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8)"
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#523A24]/40 transition-colors"
              aria-label="Close size chart"
              style={{ color: "var(--primary)" }}
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-serif text-center mb-6 uppercase tracking-wider" style={{ color: "var(--primary-strong)" }}>
              Size Guide
            </h2>

            <div className="space-y-8">
              
              {/* SHIRTS TABLE */}
              <section>
                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#523A24]">
                  <h3 className="text-sm font-semibold text-[#D4BC84]">
                    👕 Men&apos;s Shirts
                  </h3>
                  <span className="text-xs opacity-70" style={{ color: "var(--text-muted)" }}>(XS – 5XL)</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2E1711]" style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 px-2 font-medium rounded-tl-md">Size</th>
                        <th className="py-2 px-2 font-medium">Chest</th>
                        <th className="py-2 px-2 font-medium">Shoulder</th>
                        <th className="py-2 px-2 font-medium">Length</th>
                        <th className="py-2 px-2 font-medium rounded-tr-md">Sleeve</th>
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
                        <tr key={size} className="hover:bg-[#523A24]/20 transition-colors even:bg-[#2E1711]/30">
                          <td className="py-1.5 px-2 font-bold text-[#D4BC84]">{size}</td>
                          <td className="py-1.5 px-2">{chest}&quot;</td>
                          <td className="py-1.5 px-2">{shoulder}&quot;</td>
                          <td className="py-1.5 px-2">{length}&quot;</td>
                          <td className="py-1.5 px-2">{sleeve}&quot;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* PANTS TABLE */}
              <section>
                <div className="flex flex-col mb-3 pb-1 border-b border-[#523A24]">
                  <h3 className="text-sm font-semibold text-[#D4BC84]">
                    👖 Men&apos;s Trousers
                  </h3>
                  <p className="text-[10px] mt-0.5 opacity-70" style={{ color: "var(--text-muted)" }}>
                    Standard length: 40–42&quot; (Customizable)
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2E1711]" style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 px-2 font-medium rounded-tl-md">Size</th>
                        <th className="py-2 px-2 font-medium">Waist</th>
                        <th className="py-2 px-2 font-medium rounded-tr-md">Hip</th>
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
                        <tr key={size} className="hover:bg-[#523A24]/20 transition-colors even:bg-[#2E1711]/30">
                          <td className="py-1.5 px-2 font-bold text-[#D4BC84]">{size}</td>
                          <td className="py-1.5 px-2">{waist}&quot;</td>
                          <td className="py-1.5 px-2">{hip}&quot;</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* JEANS TABLE */}
              <section>
                <div className="flex items-center gap-2 mb-3 pb-1 border-b border-[#523A24]">
                  <h3 className="text-sm font-semibold text-[#D4BC84]">
                    👖 Men&apos;s Jeans
                  </h3>
                  <span className="text-xs opacity-70" style={{ color: "var(--text-muted)" }}>(Waist 26–42)</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#2E1711]" style={{ color: "var(--text-muted)" }}>
                        <th className="py-2 px-2 font-medium rounded-tl-md">Size</th>
                        <th className="py-2 px-2 font-medium">Waist</th>
                        <th className="py-2 px-2 font-medium rounded-tr-md">Hip</th>
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
                        <tr key={size} className="hover:bg-[#523A24]/20 transition-colors even:bg-[#2E1711]/30">
                          <td className="py-1.5 px-2 font-bold text-[#D4BC84]">{size}</td>
                          <td className="py-1.5 px-2">{waist}&quot;</td>
                          <td className="py-1.5 px-2">{hip}&quot;</td>
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
