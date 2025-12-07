// src/app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Read token from localStorage (client-side only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
    }
  }, []);

  // Fetch profile
  useEffect(() => {
    async function fetchProfile() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.message || "Failed to load profile");
        } else {
          setUser(data);
          setName(data.name);
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    if (token) fetchProfile();
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError("Not logged in");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          password: password || undefined, // only send if not empty
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        setUser(data);
        setPassword("");
        setSuccess("Profile updated successfully");
      }
    } catch (err) {
      setError("Something went wrong while saving");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!token) {
      setError("Not logged in");
      return;
    }

    if (!confirm("Are you sure you want to delete your account?")) return;

    try {
      setDeleting(true);
      setError(null);
      setSuccess(null);

      const res = await fetch("/api/profile", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to delete account");
      } else {
        // Clear token and send to home / login
        localStorage.removeItem("token");
        setSuccess("Account deleted");
        router.push("/"); // or "/login"
      }
    } catch (err) {
      setError("Something went wrong while deleting");
    } finally {
      setDeleting(false);
    }
  }

  if (!token) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>Please log in first.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="max-w-md mx-auto mt-10">
        <h1 className="text-2xl font-semibold mb-4">Profile</h1>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 border rounded-lg p-6 shadow-sm">
      <h1 className="text-2xl font-semibold mb-2">Profile</h1>

      {user && (
        <p className="text-sm text-gray-500 mb-4">
          Logged in as <strong>{user.email}</strong> ({user.role})
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600 mb-2">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-600 mb-2">
          {success}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="w-full border rounded px-3 py-2 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="password">
            New Password (optional)
          </label>
          <input
            id="password"
            type="password"
            className="w-full border rounded px-3 py-2 text-sm"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full border rounded px-3 py-2 text-sm font-medium disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <hr className="my-4" />

      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="w-full border border-red-500 text-red-600 rounded px-3 py-2 text-sm font-medium disabled:opacity-60"
      >
        {deleting ? "Deleting..." : "Delete Account"}
      </button>
    </div>
  );
}
