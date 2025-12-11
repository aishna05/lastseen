"use client";

import { createContext, useContext, useState, useEffect } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "SELLER" | "ADMIN";
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Yahan se localStorage se user utha rahe hain
  useEffect(() => {
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      }
    } catch (err) {
      console.error("Failed to parse authUser from localStorage", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
