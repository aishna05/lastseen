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
      <h1 className="text-3xl font-serif text-[#D4BC84] mb-8">Registered Users</h1>
      
      <div className="overflow-x-auto rounded-lg border border-[#523A24] bg-[#3A1F17]/30">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#3A1F17] text-[#D4BC84] border-b border-[#523A24]">
              <th className="p-4 font-semibold">ID</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Email</th>
              <th className="p-4 font-semibold">Phone</th>
              <th className="p-4 font-semibold">Role</th>
              <th className="p-4 font-semibold">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#523A24]/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#3A1F17]/50 transition-colors">
                <td className="p-4 text-[#D4BC84]/80">#{user.id}</td>
                <td className="p-4 font-medium text-[#D4BC84]">{user.name}</td>
                <td className="p-4 text-[#D4BC84]/80">{user.email}</td>
                <td className="p-4 text-[#D4BC84]/80">{user.phone || "-"}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === "SELLER" 
                      ? "bg-[#D4BC84]/20 text-[#D4BC84] border border-[#D4BC84]/40" 
                      : "bg-[#523A24]/30 text-[#A68A55] border border-[#523A24]"
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-[#D4BC84]/60 text-sm">
                  {format(new Date(user.createdAt), "PP")}
                </td>
              </tr>
            ))}
            
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#D4BC84]/60">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
