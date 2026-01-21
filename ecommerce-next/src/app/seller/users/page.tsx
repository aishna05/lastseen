"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Users, Mail, Phone, ShieldCheck, Calendar } from "lucide-react";

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
        setError("Unauthorized access. Please log in.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/seller/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user directory");
      const data = await res.json();
      setUsers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="luxe-loader">Establishing Connection...</div>;

  return (
    <main className="min-h-screen pt-28 pb-20 px-4 md:px-8 bg-luxe-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Editorial Header */}
        <header className="text-center mb-16 animate-fade-in">
          <span className="luxe-eyebrow">Executive Suite</span>
          <h1 className="luxe-page-title">User Directory</h1>
          <div className="luxe-divider mx-auto"></div>
        </header>

        {error ? (
          <div className="luxe-error-box">{error}</div>
        ) : (
          <div className="luxe-table-wrapper">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="luxe-directory-table">
                <thead>
                  <tr>
                    <th><div className="flex items-center gap-2"><Users size={14}/> Client</div></th>
                    <th><div className="flex items-center gap-2"><Mail size={14}/> Contact</div></th>
                    <th><div className="flex items-center gap-2"><ShieldCheck size={14}/> Privilege</div></th>
                    <th className="text-right"><div className="flex items-center justify-end gap-2"><Calendar size={14}/> Registry Date</div></th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slide-up">
                      <td className="client-cell">
                        <div className="client-id">#{user.id}</div>
                        <div className="client-name">{user.name}</div>
                      </td>
                      <td className="contact-cell">
                        <div className="email-link">{user.email}</div>
                        <div className="phone-sub">
                          {user.phone ? (
                            <span className="flex items-center gap-1"><Phone size={10}/> {user.phone}</span>
                          ) : "No phone provided"}
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="date-cell">
                        {format(new Date(user.createdAt), "MMMM dd, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && (
              <div className="empty-directory">
                <p>The archives are currently empty.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}