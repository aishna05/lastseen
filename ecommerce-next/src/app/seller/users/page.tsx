"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  createdAt: string;
}

export default function SellerUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view users");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/seller/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to fetch users");
      }

      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center text-[#D4BC84]">
        Loading users...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 pb-12 flex justify-center items-center text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-24 pb-12 page-shell">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif text-[var(--primary-strong)] mb-8 text-center uppercase tracking-wider">
          Registered Users
        </h1>
        
        <div 
          className="overflow-hidden rounded-xl border shadow-2xl animate-in fade-in duration-500"
          style={{ 
            borderColor: "var(--border-strong)",
            backgroundColor: "var(--bg-elevated)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.3)"
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr 
                  className="text-sm uppercase tracking-wider"
                  style={{ 
                    backgroundColor: "#2E1711", 
                    color: "var(--primary)",
                    borderBottom: "2px solid var(--border-strong)" 
                  }}
                >
                  <th className="p-5 font-bold">ID</th>
                  <th className="p-5 font-bold">Name</th>
                  <th className="p-5 font-bold">Email</th>
                  <th className="p-5 font-bold">Phone</th>
                  <th className="p-5 font-bold">Role</th>
                  <th className="p-5 font-bold text-right">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y text-sm" style={{ borderColor: "#523A24" }}>
                {users.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-[#523A24]/20 transition-colors group"
                  >
                    <td className="p-5 font-mono text-[#A68A55] opacity-70 group-hover:opacity-100">
                      #{user.id}
                    </td>
                    <td 
                      className="p-5 font-serif text-lg font-medium"
                      style={{ color: "var(--text-main)" }}
                    >
                      {user.name}
                    </td>
                    <td className="p-5 font-medium" style={{ color: "var(--text-muted)" }}>
                      {user.email}
                    </td>
                    <td className="p-5" style={{ color: "var(--text-muted)" }}>
                      {user.phone || <span className="opacity-30 italic">N/A</span>}
                    </td>
                    <td className="p-5">
                      <span 
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                          user.role === "SELLER" 
                            ? "bg-[#D4BC84] text-[#2E1711] ring-1 ring-[#D4BC84]/50" 
                            : "bg-[#2E1711] text-[#A68A55] ring-1 ring-[#523A24]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-5 text-right font-medium" style={{ color: "var(--text-muted)" }}>
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-lg italic opacity-60" style={{ color: "var(--text-muted)" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
