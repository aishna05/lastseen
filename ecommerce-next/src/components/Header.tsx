'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut, ShoppingCart, ChevronDown } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

const Header: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState(0);

  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

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

  // ✅ Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error('Failed to fetch categories:', err));
  }, []);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <Image 
            src="/media/Logo.png" 
            alt="Site Logo" 
            priority
            width={150} 
            height={75}
            style={{ objectFit: 'contain' }}
          />
        </Link>

        <nav className="site-nav">
          <Link href="/products" className="nav-link">
            Products
          </Link>

          {/* Categories Dropdown */}
          <div 
            className="relative" 
            ref={categoriesRef}
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button 
              className="nav-link flex items-center gap-1 cursor-pointer bg-transparent border-none p-0 group"
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            >
              <span className="group-hover:text-[#D4BC84] transition-colors">Categories</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCategoriesOpen && (
              <div 
                className="absolute left-0 top-full mt-4 w-60 border rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden"
                style={{ 
                  backgroundColor: '#2E1711', // Explicit Dark Brown
                  borderColor: '#523A24',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div className="py-2 flex flex-col w-full">
                  {categories.length > 0 ? (
                    categories.map((cat, idx) => (
                      <Link 
                        key={cat.id} 
                        href={`/products?category=${cat.id}`} 
                        className="block w-full text-left px-6 py-3 text-sm transition-all duration-300 border-b border-[#523A24] last:border-none"
                        style={{ 
                          color: '#A68A55', // Muted Gold default
                          fontFamily: '"Cinzel", serif',
                          position: 'relative',
                        }}
                        onMouseEnter={(e) => {
                           e.currentTarget.style.backgroundColor = '#3A1F17'; // Slightly lighter brown
                           e.currentTarget.style.paddingLeft = '2rem';
                           e.currentTarget.style.color = '#D4BC84'; // Bright Gold
                           e.currentTarget.style.textDecoration = 'underline';
                        }}
                        onMouseLeave={(e) => {
                           e.currentTarget.style.backgroundColor = 'transparent';
                           e.currentTarget.style.paddingLeft = '1.5rem';
                           e.currentTarget.style.color = '#A68A55';
                           e.currentTarget.style.textDecoration = 'none';
                        }}
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <span className="block px-6 py-4 text-sm text-[#A68A55] opacity-70 italic text-center">
                      Loading categories...
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/about-us" className="nav-link">
            About Us
          </Link>
          <Link href="/contact-us" className="nav-link">
            Contact Us
          </Link>

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
                        <Link href="/profile/addresses" className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>
                          <User size={18} color="#A68A55" />
                          <span>Manage Addresses</span>
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
