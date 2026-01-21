"use client";

import { useState } from "react";
import { Ruler, X, Info } from "lucide-react";

export default function SizeChartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState<"cm" | "in">("in");
  const [activeTab, setActiveTab] = useState<"shirts" | "pants" | "jeans">("shirts");

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
    { label: "26", waist: 26, hip: 34 }, { label: "28", waist: 28, hip: 36 },
    { label: "30", waist: 30, hip: 38 }, { label: "32", waist: 32, hip: 40 },
    { label: "34", waist: 34, hip: 42 }, { label: "36", waist: 36, hip: 44 },
    { label: "38", waist: 38, hip: 46 }, { label: "40", waist: 40, hip: 48 },
  ];

  const formatVal = (val: number) => 
    unit === "in" ? val : (val * 2.54).toFixed(1);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="size-guide-trigger"
      >
        <Ruler size={14} />
        <span>Size Guide</span>
      </button>

      {isOpen && (
        <div className="luxe-modal-overlay">
          <div className="luxe-modal-content animate-modal-up">
            
            {/* Elegant Header */}
            <div className="luxe-modal-header">
              <div className="header-text">
                <h2 className="luxe-title">Fit & Measurements</h2>
                <p className="luxe-subtitle">Ensure the perfect fit for your silhouette</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="close-luxe">
                <X size={28} strokeWidth={1.5} />
              </button>
            </div>

            {/* Expansive Controls */}
            <div className="luxe-controls">
              <div className="category-pills">
                {(["shirts", "pants", "jeans"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`pill-btn ${activeTab === tab ? "active" : ""}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="unit-switch">
                <span className={unit === "cm" ? "active" : ""}>CM</span>
                <button 
                  onClick={() => setUnit(unit === "cm" ? "in" : "cm")}
                  className="switch-track"
                >
                  <div className={`switch-thumb ${unit === "in" ? "right" : "left"}`} />
                </button>
                <span className={unit === "in" ? "active" : ""}>IN</span>
              </div>
            </div>

            {/* Expansive Scroll Area */}
            <div className="luxe-table-container">
              
              <div className="table-wrapper">
                <table className="luxe-table">
                  <thead>
                    <tr>
                      {activeTab === "shirts" ? (
                        <>
                          <th>Size</th>
                          <th>Chest</th>
                          <th>Shoulder</th>
                          <th>Length</th>
                          <th>Sleeve</th>
                        </>
                      ) : (
                        <>
                          <th>Size Label</th>
                          <th>Waist</th>
                          <th>Hip</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {(activeTab === "shirts" ? shirtData : pantsData).map((row: any, idx) => (
                      <tr key={idx}>
                        <td className="font-bold">{row.size || row.label}</td>
                        <td>{formatVal(row.chest || row.waist)}</td>
                        {activeTab === "shirts" && <td>{formatVal(row.shoulder)}</td>}
                        {activeTab === "shirts" && <td>{formatVal(row.length)}</td>}
                        {activeTab === "shirts" ? <td>{formatVal(row.sleeve)}</td> : <td>{formatVal(row.hip)}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="luxe-disclaimer">
                <Info size={16} />
                <p>Standard fit tailored for a clean silhouette. For a relaxed look, we recommend sizing up. Measurements may vary by 0.5 {unit} due to artisanal crafting.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}