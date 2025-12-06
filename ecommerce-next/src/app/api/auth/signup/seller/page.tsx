"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerSignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: "SELLER" }),
        });

        if (res.ok) {
            router.push("/login");
        } else {
            const data = await res.json();
            alert(data.message || "Error");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form
                onSubmit={handleSubmit}
                className="border p-6 rounded w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-semibold text-center">
                    Seller Signup
                </h1>

                <input
                    type="text"
                    placeholder="Name"
                    className="w-full border px-3 py-2 rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border px-3 py-2 rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border px-3 py-2 rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button
                    type="submit"
                    className="w-full py-2 rounded bg-black text-white font-medium"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
