"use client";

import { useState } from "react";
import { Ruler, X, Info } from "lucide-react";

export default function SizeChartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("in");

  return (
    <>
      {/* Trigger Button: Added margin-bottom for spacing */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide mb-6 hover:scale-105 transition-all shadow-lg group"
        style={{ 
          backgroundColor: "#F5E6D3", 
          color: "#523A24",
          border: "1px solid #D4BC84",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
        }}
      >
        <Ruler size={14} className="group-hover:rotate-12 transition-transform" />
        <span>Size Guide</span>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
            style={{ 
              backgroundColor: "#FCFbf7", // Lighter paper-like background
              color: "#3A1F17"
            }}
          >
            {/* Header */}
            <div className="p-6 pb-4 border-b border-[#D4BC84]/30 flex justify-between items-start bg-[#F5E6D3]/30">
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#523A24]">Size Guide</h2>
                <div className="flex gap-4 mt-2 text-xs font-medium text-[#8B7355]">
                  <span className="opacity-50">Rigid</span>
                  <span className="text-[#523A24] font-bold">Medium</span>
                  <span className="opacity-50">High</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={24} color="#523A24" />
              </button>
            </div>

            {/* Controls */}
            <div className="flex justify-between items-center px-6 py-4">
              <h3 className="text-lg font-semibold text-[#523A24]">Product Size</h3>
              
              {/* Unit Toggle */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className={`${unit === "cm" ? "text-[#523A24] font-bold" : "text-[#A68A55]"}`}>cm</span>
                <button 
                  onClick={() => setUnit(unit === "cm" ? "in" : "cm")}
                  className="w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4BC84]"
                  style={{ backgroundColor: "#3A1F17" }}
                >
                  <div 
                    className={`absolute top-1 w-4 h-4 rounded-full bg-[#D4BC84] shadow-md transition-transform duration-300 ${unit === "in" ? "left-7" : "left-1"}`}
                  />
                </button>
                <span className={`${unit === "in" ? "text-[#523A24] font-bold" : "text-[#A68A55]"}`}>inch</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
              <div className="space-y-8">
                
                {/* Generic Table Layout */}
                <div className="border border-[#D4BC84]/40 rounded-lg overflow-hidden">
                  <table className="w-full text-sm text-center">
                    <thead>
                      <tr className="bg-[#F5E6D3]/50 text-[#523A24] border-b border-[#D4BC84]/40">
                        <th className="py-3 px-2 font-bold border-r border-[#D4BC84]/20">Size</th>
                        <th className="py-3 px-2 font-bold border-r border-[#D4BC84]/20">Shoulder</th>
                        <th className="py-3 px-2 font-bold border-r border-[#D4BC84]/20">Bust</th>
                        <th className="py-3 px-2 font-bold border-r border-[#D4BC84]/20">Length</th>
                        <th className="py-3 px-2 font-bold">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D4BC84]/20">
                      {[
                        { size: "XS", shoulder: 16, bust: 34, length: 26, sleeve: 23 },
                        { size: "S", shoulder: 17, bust: 36, length: 27, sleeve: 23.5 },
                        { size: "M", shoulder: 18, bust: 38, length: 28, sleeve: 24 },
                        { size: "L", shoulder: 18.5, bust: 40, length: 29, sleeve: 24.5 },
                        { size: "XL", shoulder: 19, bust: 42, length: 30, sleeve: 25 },
                      ].map((row) => (
                        <tr key={row.size} className="hover:bg-[#F5E6D3]/20 transition-colors">
                          <td className="py-3 font-bold text-[#523A24] border-r border-[#D4BC84]/20">{row.size}</td>
                          <td className="py-3 text-[#6B5A4A] border-r border-[#D4BC84]/20">
                            {unit === "in" ? row.shoulder : (row.shoulder * 2.54).toFixed(1)}
                          </td>
                          <td className="py-3 text-[#6B5A4A] border-r border-[#D4BC84]/20">
                            {unit === "in" ? row.bust : (row.bust * 2.54).toFixed(1)}
                          </td>
                          <td className="py-3 text-[#6B5A4A] border-r border-[#D4BC84]/20">
                            {unit === "in" ? row.length : (row.length * 2.54).toFixed(1)}
                          </td>
                          <td className="py-3 text-[#6B5A4A]">
                            {unit === "in" ? row.sleeve : (row.sleeve * 2.54).toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-start gap-2 text-xs text-[#8B7355] bg-[#F5E6D3]/20 p-3 rounded-lg">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  <p>* This data was obtained from manually measuring the product, it may be off by 1-2 CM.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
