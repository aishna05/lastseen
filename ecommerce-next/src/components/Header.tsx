'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ShoppingCart } from 'lucide-react';

const Header: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  // ✅ Fetch total cart quantity
  const fetchCartCount = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch('/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (Array.isArray(data)) {
        const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0);
        setCartCount(totalQuantity);
      } else {
        setCartCount(0);
      }
    } catch (err) {
      console.error(err);
      setCartCount(0);
    }
  };

  // Listen for token or cart changes
  useEffect(() => {
    fetchCartCount();
    const handleTokenChange = () => fetchCartCount();
    const handleCartChange = () => fetchCartCount();

    window.addEventListener('tokenChange', handleTokenChange);
    window.addEventListener('cartChange', handleCartChange);

    return () => {
      window.removeEventListener('tokenChange', handleTokenChange);
      window.removeEventListener('cartChange', handleCartChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('tokenChange'));
    setIsDropdownOpen(false);
    router.push('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/about-us", label: "About Us" },
    { href: "/contact-us", label: "Contact Us" },
  ];

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <Image 
            src="/media/logo.png" 
            alt="Site Logo" 
            priority
            width={150} 
            height={75}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <nav className="site-nav">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="nav-link">
              {link.label}
            </Link>
          ))}

          {!isLoading && (
            <>
              {user?.isLoggedIn ? (
                <>
                  {/* Cart Icon */}
                  <Link href="/cart" className="cart-icon-btn hover:scale-105 transition-transform" title="View Cart">
                    <ShoppingCart size={24} color="#D4BC84" />
                    {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="profile-dropdown-container relative" ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="profile-icon-btn hover:scale-105 transition-transform"
                      title="Profile Menu"
                      aria-label="Profile Menu"
                    >
                      <User size={24} strokeWidth={2.5} color="#D4BC84" />
                    </button>

                    {isDropdownOpen && (
                      <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                        <Link href="/profile" className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          <User size={18} color="#A68A55" />
                          <span>View Profile</span>
                        </Link>
                        <Link href="/orders" className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          <Package size={18} color="#A68A55" />
                          <span>My Orders</span>
                        </Link>
                        <hr />
                        <button
                          onClick={handleLogout}
                          className="dropdown-item w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                        >
                          <LogOut size={18} color="#ff8866" />
                          <span>Logout</span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary hover:scale-105 transition-transform"
                  style={{ padding: '0.6rem 1.4rem', fontSize: '0.8rem' }}
                >
                  Login
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
