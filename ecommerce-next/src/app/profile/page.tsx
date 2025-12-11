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

  // ------------------------------
  // Load token from localStorage
  // ------------------------------
  useEffect(() => {
    if (typeof window !== "undefined") {
      const t = localStorage.getItem("token");
      setToken(t);
    }
  }, []);

  // ------------------------------
  // Fetch profile
  // ------------------------------
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

  // ------------------------------
  // Handle Save
  // ------------------------------
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
          password: password || undefined,
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

  // ------------------------------
  // Handle Delete Account
  // ------------------------------
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
        localStorage.removeItem("token");
        setSuccess("Account deleted");
        router.push("/");
      }
    } catch (err) {
      setError("Something went wrong while deleting");
    } finally {
      setDeleting(false);
    }
  }

  // ------------------------------
  // Layout Component
  // ------------------------------
  const BaseLayout = ({
    children,
    title,
  }: {
    children: React.ReactNode;
    title: string;
  }) => (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">{title}</h1>
        {children}
      </div>
    </div>
  );

  // ------------------------------
  // Unauthenticated & Loading States
  // ------------------------------
  if (!token) {
    return (
      <BaseLayout title="Profile">
        <p className="text-main">Please log in first.</p>
      </BaseLayout>
    );
  }

  if (loading) {
    return (
      <BaseLayout title="Profile">
        <p className="text-main">Loading...</p>
      </BaseLayout>
    );
  }

  if (error && !user) {
    return (
      <BaseLayout title="Profile">
        <p className="profile-message error">{error}</p>
      </BaseLayout>
    );
  }

  // ------------------------------
  // MAIN UI
  // ------------------------------
  return (
    <div className="profile-container">
      <div className="profile-card">
        <h1 className="profile-title">Profile</h1>

        {user && (
          <p className="profile-meta">
            Logged in as <strong>{user.email}</strong> ({user.role})
          </p>
        )}

        {error && <p className="profile-message error">{error}</p>}

        {success && <p className="profile-message success">{success}</p>}

        {/* Update Form */}
        <form onSubmit={handleSave} className="profile-form">
          <div className="profile-field">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="profile-field">
            <label htmlFor="password">New Password (optional)</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <button type="submit" disabled={saving} className="btn-primary mt-2">
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <hr className="profile-divider" />

        {/* Delete Account */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="btn-delete-account"
        >
          {deleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
