"use client";

import { useState } from "react";
import { Ruler, X, Info } from "lucide-react";

export default function SizeChartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("in");
  const [activeTab, setActiveTab] = useState<"shirts" | "pants" | "jeans">("shirts");

  // Data provided by user
  const shirtData = [
    { size: "XS", chest: 34, shoulder: 16, length: 26, sleeve: 23 },
    { size: "S", chest: 36, shoulder: 17, length: 27, sleeve: 23.5 },
    { size: "M", chest: 38, shoulder: 18, length: 28, sleeve: 24 },
    { size: "L", chest: 40, shoulder: 18.5, length: 29, sleeve: 24.5 },
    { size: "XL", chest: 42, shoulder: 19, length: 30, sleeve: 25 },
    { size: "2XL", chest: 44, shoulder: 19.5, length: 31, sleeve: 25.5 },
    { size: "3XL", chest: 46, shoulder: 20, length: 31.5, sleeve: 26 },
    { size: "4XL", chest: 48, shoulder: 20.5, length: 32, sleeve: 26.5 },
    { size: "5XL", chest: 50, shoulder: 21, length: 33, sleeve: 27 },
  ];

  const pantsData = [
    { label: "26", waist: 26, hip: 34 },
    { label: "28", waist: 28, hip: 36 },
    { label: "30", waist: 30, hip: 38 },
    { label: "32", waist: 32, hip: 40 },
    { label: "34", waist: 34, hip: 42 },
    { label: "36", waist: 36, hip: 44 },
    { label: "38", waist: 38, hip: 46 },
    { label: "40", waist: 40, hip: 48 },
    { label: "42", waist: 42, hip: 50 },
    { label: "44", waist: 44, hip: 52 },
    { label: "46", waist: 46, hip: 54 },
  ];

  const jeansData = [
    { label: "26", waist: 26, hip: 34 },
    { label: "28", waist: 28, hip: 36 },
    { label: "30", waist: 30, hip: 38 },
    { label: "32", waist: 32, hip: 40 },
    { label: "34", waist: 34, hip: 42 },
    { label: "36", waist: 36, hip: 44 },
    { label: "38", waist: 38, hip: 46 },
    { label: "40", waist: 40, hip: 48 },
    { label: "42", waist: 42, hip: 50 },
  ];

  const formatVal = (val: number) => 
    unit === "in" ? val : (val * 2.54).toFixed(1);

  return (
    <>
      {/* Trigger Button: Added substantial margin-bottom for spacing */}
      <div className="mb-8">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide hover:scale-105 transition-all shadow-lg group"
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
      </div>

      {/* Modal Overlay - Full Screen Message Style */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* Modal Content */}
          <div 
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-md shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col"
            style={{ 
              backgroundColor: "#FCFbf7", // Lighter paper-like background
              color: "#3A1F17"
            }}
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-[#D4BC84]/30 flex justify-between items-center bg-[#F5E6D3]/30">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#523A24] tracking-wide">
                SIZE GUIDE
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={24} color="#523A24" />
              </button>
            </div>

            {/* Controls & Tabs */}
            <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 gap-4 bg-[#F5E6D3]/10">
              
              {/* Category Tabs */}
              <div className="flex bg-[#3A1F17]/5 p-1 rounded-lg gap-1">
                {(["shirts", "pants", "jeans"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab 
                        ? "bg-[#3A1F17] text-[#D4BC84] shadow-sm" 
                        : "text-[#523A24] hover:bg-[#3A1F17]/10"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Unit Toggle */}
              <div className="flex items-center gap-2 text-xs font-bold uppercase">
                <span className={`${unit === "cm" ? "text-[#523A24]" : "text-[#A68A55]"}`}>cm</span>
                <button 
                  onClick={() => setUnit(unit === "cm" ? "in" : "cm")}
                  className="w-10 h-5 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4BC84]"
                  style={{ backgroundColor: "#3A1F17" }}
                >
                  <div 
                    className={`absolute top-1 w-3 h-3 rounded-full bg-[#D4BC84] shadow-md transition-transform duration-300 ${unit === "in" ? "left-6" : "left-1"}`}
                  />
                </button>
                <span className={`${unit === "in" ? "text-[#523A24]" : "text-[#A68A55]"}`}>in</span>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-6 custom-scrollbar">
              
              {/* SHIRTS TABLE */}
              {activeTab === "shirts" && (
                <div className="space-y-4">
                   <div className="text-center mb-4">
                    <h3 className="text-lg font-serif font-bold text-[#523A24]">MEN&apos;S SHIRTS</h3>
                    <p className="text-xs text-[#8B7355] uppercase tracking-widest">(XS – 5XL)</p>
                  </div>
                  <div className="border border-[#D4BC84] rounded-lg overflow-hidden">
                    <table className="w-full text-[10px] sm:text-xs text-center">
                      <thead>
                        <tr className="bg-[#3A1F17] text-[#D4BC84]">
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">SIZE</th>
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">CHEST</th>
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">SHOULDER</th>
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">LENGTH</th>
                          <th className="py-2 sm:py-3 px-1 font-bold">SLEEVE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4BC84]/30 bg-[#F5E6D3]/10">
                        {shirtData.map((row) => (
                          <tr key={row.size} className="hover:bg-[#D4BC84]/10 transition-colors">
                            <td className="py-2 font-bold text-[#3A1F17] border-r border-[#D4BC84]/30">{row.size}</td>
                            <td className="py-2 text-[#523A24] border-r border-[#D4BC84]/30">{formatVal(row.chest)}</td>
                            <td className="py-2 text-[#523A24] border-r border-[#D4BC84]/30">{formatVal(row.shoulder)}</td>
                            <td className="py-2 text-[#523A24] border-r border-[#D4BC84]/30">{formatVal(row.length)}</td>
                            <td className="py-2 text-[#523A24]">{formatVal(row.sleeve)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PANTS TABLE */}
              {activeTab === "pants" && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-serif font-bold text-[#523A24]">MEN&apos;S PANTS (TROUSERS)</h3>
                    <p className="text-xs text-[#8B7355] uppercase tracking-widest">WAIST RANGE: 26 – 46</p>
                    <p className="text-[10px] text-[#8B7355] mt-1">(Standard length: 40–42 inches, customizable)</p>
                  </div>
                  <div className="border border-[#D4BC84] rounded-lg overflow-hidden max-w-lg mx-auto">
                    <table className="w-full text-[10px] sm:text-xs text-center">
                      <thead>
                        <tr className="bg-[#3A1F17] text-[#D4BC84]">
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">SIZE LABEL</th>
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">WAIST</th>
                          <th className="py-2 sm:py-3 px-1 font-bold">HIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4BC84]/30 bg-[#F5E6D3]/10">
                        {pantsData.map((row) => (
                          <tr key={row.label} className="hover:bg-[#D4BC84]/10 transition-colors">
                            <td className="py-2 font-bold text-[#3A1F17] border-r border-[#D4BC84]/30">{row.label}</td>
                            <td className="py-2 text-[#523A24] border-r border-[#D4BC84]/30">{formatVal(row.waist)}</td>
                            <td className="py-2 text-[#523A24]">{formatVal(row.hip)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* JEANS TABLE */}
              {activeTab === "jeans" && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-serif font-bold text-[#523A24]">MEN&apos;S JEANS</h3>
                    <p className="text-xs text-[#8B7355] uppercase tracking-widest">WAIST RANGE: 26 – 42</p>
                  </div>
                  <div className="border border-[#D4BC84] rounded-lg overflow-hidden max-w-lg mx-auto">
                    <table className="w-full text-[10px] sm:text-xs text-center">
                      <thead>
                        <tr className="bg-[#3A1F17] text-[#D4BC84]">
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">JEANS SIZE</th>
                          <th className="py-2 sm:py-3 px-1 font-bold border-r border-[#D4BC84]/20">WAIST</th>
                          <th className="py-2 sm:py-3 px-1 font-bold">HIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D4BC84]/30 bg-[#F5E6D3]/10">
                        {jeansData.map((row) => (
                          <tr key={row.label} className="hover:bg-[#D4BC84]/10 transition-colors">
                            <td className="py-2 font-bold text-[#3A1F17] border-r border-[#D4BC84]/30">{row.label}</td>
                            <td className="py-2 text-[#523A24] border-r border-[#D4BC84]/30">{formatVal(row.waist)}</td>
                            <td className="py-2 text-[#523A24]">{formatVal(row.hip)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="flex items-center justify-center gap-2 text-[10px] text-[#8B7355] bg-[#F5E6D3]/40 p-3 rounded-lg mt-6">
                <Info size={14} className="shrink-0" />
                <p>These measurements are approximate and may vary by 1-2 {unit}.</p>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
