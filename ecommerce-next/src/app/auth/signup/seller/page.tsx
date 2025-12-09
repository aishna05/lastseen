"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SellerSignupPage() {
 const [name, setName] = useState("");
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
 const router = useRouter();

 async function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

 const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, role: "SELLER" }),
        });
 if (res.ok) {
            setSuccess("Signup successful! Redirecting to login...");
 router.push("/login");
 } else {
 const data = await res.json();
 setError(data.message || "Signup failed");
 }
        setLoading(false);
    }
 return (
 <div className="auth-page">
 <div className="auth-card">
 <h2 className="auth-title">Seller Sign Up</h2>
                <p className="auth-subtitle">Join us and start selling your luxury products</p>

                {error && <p className="auth-error">{error}</p>}
                {success && <p className="auth-success">{success}</p>}

 <form onSubmit={handleSubmit} className="auth-form">
 <div className="auth-field">
                        <label>Name</label>
<input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 required
 />
 </div>
 <div className="auth-field">
                        <label>Email Address</label>
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 />
 </div>
 <div className="auth-field">
                        <label>Password</label>
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 />
 </div>
 <button type="submit" disabled={loading} className="auth-btn">
 {loading ? "Signing up..." : "Sign Up"}
 </button>
</form>
                
                <div className="auth-links">
                    <a href="/login">Already have an account? Log in</a>
                </div>
 </div>
 </div>
 );
}