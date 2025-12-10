// lib/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';

interface User {
  role?: string;
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  id?: number;
}

// Helper function to decode JWT token (without verification - client-side only)
function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User>({ isLoggedIn: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Decode the JWT to get user info
          const decoded = decodeJWT(token);
          
          if (decoded) {
            // Set user with role and other info from token
            setUser({
              isLoggedIn: true,
              role: decoded.role || decoded.userRole, // Adjust based on your token structure
              email: decoded.email,
              name: decoded.name,
              id: decoded.id || decoded.userId,
            });
          } else {
            // Token is invalid
            localStorage.removeItem('token');
            setUser({ isLoggedIn: false });
          }
        } else {
          setUser({ isLoggedIn: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        setUser({ isLoggedIn: false });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        checkAuth();
      }
    };

    // Custom event listener for same-tab token changes
    const handleTokenChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('tokenChange', handleTokenChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('tokenChange', handleTokenChange);
    };
  }, []);

  return { user, isLoading };
}