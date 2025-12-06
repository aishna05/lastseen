"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (!res?.error) {
      router.push("/"); // or check role and redirect to dashboard
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="border p-6 rounded w-full max-w-md space-y-4"
      >
        <h1 className="text-2xl font-semibold text-center">Login</h1>

        {error && (
          <p className="text-red-500 text-sm text-center">
            Invalid credentials
          </p>
        )}

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
          Login
        </button>

        <div className="flex justify-between text-sm">
          <a href="/signup/customer" className="underline">
            New Customer? Sign up
          </a>
          <a href="/signup/seller" className="underline">
            New Seller? Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
