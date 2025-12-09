// lib/hooks/useAuth.ts
'use client';

import { useState, useEffect } from 'react';

interface User {
  role: string;
  isLoggedIn: boolean;
  email?: string;
  name?: string;
  // add other user properties as needed
}

export function useAuth() {
  const [user, setUser] = useState<User>({ isLoggedIn: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          // Token exists, user is logged in
          setUser({ isLoggedIn: true });
        } else {
          setUser({ isLoggedIn: false });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser({ isLoggedIn: false });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for storage changes (for multi-tab sync and login/logout)
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