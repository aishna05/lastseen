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
          className="overflow-hidden rounded-xl border border-[var(--border-strong)] shadow-2xl animate-in fade-in duration-500"
          style={{ 
            backgroundColor: "var(--bg-elevated)", 
            boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)"
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr 
                  className="text-sm uppercase tracking-[0.15em]"
                  style={{ 
                    backgroundColor: "#2E1711", 
                    color: "#D4BC84",
                  }}
                >
                  <th className="px-16 py-6 font-semibold border-b border-r border-[#523A24] last:border-r-0 whitespace-nowrap">ID</th>
                  <th className="px-16 py-6 font-semibold border-b border-r border-[#523A24] last:border-r-0 whitespace-nowrap">Name</th>
                  <th className="px-16 py-6 font-semibold border-b border-r border-[#523A24] last:border-r-0 whitespace-nowrap">Email</th>
                  <th className="px-16 py-6 font-semibold border-b border-r border-[#523A24] last:border-r-0 whitespace-nowrap">Phone</th>
                  <th className="px-16 py-6 font-semibold border-b border-r border-[#523A24] last:border-r-0 whitespace-nowrap">Role</th>
                  <th className="px-16 py-6 font-semibold border-b border-[#523A24] text-right whitespace-nowrap">Joined Date</th>
                </tr>
              </thead>
              <tbody className="text-base">
                {users.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className="group hover:bg-[#3A1F17]/40 transition-colors"
                    style={{ 
                      backgroundColor: index % 2 === 0 ? "rgba(58, 31, 23, 0.1)" : "transparent" 
                    }}
                  >
                    <td className="px-16 py-6 font-mono text-sm text-[#A68A55] border-b border-r border-[#523A24]/40 last:border-r-0 whitespace-nowrap">
                      #{user.id}
                    </td>
                    <td 
                      className="px-16 py-6 font-serif text-xl border-b border-r border-[#523A24]/40 last:border-r-0 whitespace-nowrap"
                      style={{ color: "var(--text-main)" }}
                    >
                      {user.name}
                    </td>
                    <td className="px-16 py-6 text-[#D4BC84]/90 border-b border-r border-[#523A24]/40 last:border-r-0 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-16 py-6 text-[#A68A55] border-b border-r border-[#523A24]/40 last:border-r-0 whitespace-nowrap">
                      {user.phone || <span className="opacity-30 italic">-</span>}
                    </td>
                    <td className="px-16 py-6 border-b border-r border-[#523A24]/40 last:border-r-0 whitespace-nowrap">
                      <span 
                        className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          user.role === "SELLER" 
                            ? "bg-[#D4BC84]/20 text-[#D4BC84] border border-[#D4BC84]/40" 
                            : "bg-[#2E1711]/50 text-[#A68A55] border border-[#523A24]"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-16 py-6 text-right text-[#A68A55] border-b border-[#523A24]/40 whitespace-nowrap">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-lg italic opacity-60 text-[#A68A55]">
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
