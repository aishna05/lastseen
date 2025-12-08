// /src/lib/hooks/useAuth.ts
'use client';

import { useState, useEffect, useCallback } from 'react';

// Define the expected structure for the user session
export interface UserSession {
  id: number;
  name: string;
  email: string;
  role: 'CUSTOMER' | 'SELLER' | string;
}

// Define the overall authentication state
export interface AuthState {
  user: UserSession | null;
  isLoggedIn: boolean;
  isLoading: boolean;
}

// --- MOCK API CALLS (Replace with actual calls to your Next.js API Routes) ---

/**
 * Simulates fetching the user session from the browser or a protected API route.
 * In a production app, this function would call your /api/auth/session route.
 */
async function getClientSession(): Promise<AuthState> {
  const token = localStorage.getItem('auth_token');

  if (!token) {
    return { user: null, isLoggedIn: false, isLoading: false };
  }

  try {
    // 1. Call your Next.js API route to verify the token and return user data
    // This is necessary because JWT verification (jwt.verify) should happen on the server.
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        // If token is expired or invalid, clear it
        localStorage.removeItem('auth_token');
        return { user: null, isLoggedIn: false, isLoading: false };
    }

    // Assume your session API returns the UserSession object
    const userData: UserSession = await response.json(); 

    return {
      user: { ...userData, id: userData.id, role: userData.role }, // Ensure id and role are pulled from the API response
      isLoggedIn: true,
      isLoading: false,
    };
  } catch (error) {
    console.error("Error fetching client session:", error);
    localStorage.removeItem('auth_token');
    return { user: null, isLoggedIn: false, isLoading: false };
  }
}

/**
 * Handles client-side logout by clearing storage.
 */
const clientLogout = () => {
  localStorage.removeItem('auth_token');
  // Optional: Trigger a global state change or redirect here
};

// --- CORE HOOK ---

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoggedIn: false,
    isLoading: true,
  });

  // Function to wrap the utility logout and update local state
  const logout = useCallback(() => {
    clientLogout();
    setAuthState({ user: null, isLoggedIn: false, isLoading: false });
  }, []);

  // Function to refresh the session data
  const refreshSession = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    const session = await getClientSession();
    setAuthState(session);
  }, []);

  // Fetch session data on initial mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return {
    ...authState,
    logout,
    refreshSession, // Useful for updating profile data after an API call
  };
};

// --- IMPLEMENTATION NOTES ---
/*
* You MUST create a new Next.js API route: /src/app/api/auth/session/route.ts.
* Inside that route, use your verifyToken(authHeader) utility to decode the token 
* and return the user's data (id, name, email, role).
*/