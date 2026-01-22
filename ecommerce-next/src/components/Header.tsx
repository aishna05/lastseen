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

  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  // Fetch cart count
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
      }
    } catch (err) {
      setCartCount(0);
    }
  };

  // Fetch categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      });
  }, []);

  useEffect(() => {
    fetchCartCount();
    window.addEventListener('cartChange', fetchCartCount);
    return () => window.removeEventListener('cartChange', fetchCartCount);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsDropdownOpen(false);
    router.push('/login');
  };

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
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
          <Link href="/products" className="nav-link">Products</Link>

          {/* Categories Dropdown */}
          {/* Categories Dropdown */}
<div
  className="categories-container nav-link"
  ref={categoriesRef}
  onMouseEnter={() => setIsCategoriesOpen(true)}
  onMouseLeave={() => setIsCategoriesOpen(false)}
>
  <button className="luxe-category-btn">
    <span>CATEGORIES</span>
    <ChevronDown size={14} className={`chevron-icon ${isCategoriesOpen ? 'rotate' : ''}`} />
  </button>

  <div className={`luxe-dropdown-panel ${isCategoriesOpen ? 'show' : ''}`}>
    {categories.length > 0 ? (
      categories.map((cat) => (
        <Link 
          key={cat.id} 
          href={`/products?category=${cat.id}`} 
          className="luxe-dropdown-item"
        >
          {cat.name}
        </Link>
      ))
    ) : (
      <span className="dropdown-loading-text">Loading...</span>
    )}
  </div>
</div>

          <Link href="/about-us" className="nav-link">About Us</Link>
          <Link href="/contact-us" className="nav-link">Contact Us</Link>

          {!isLoading && user?.isLoggedIn && (
            <>
              <Link href="/cart" className="cart-icon-btn">
                <ShoppingCart size={24} color="#D4BC84" />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>

              <div className="profile-dropdown-container" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="profile-icon-btn"
                >
                  <User size={24} color="#D4BC84" />
                </button>

                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <Link href="/profile" className="dropdown-item">View Profile</Link>
                    <Link href="/orders" className="dropdown-item">My Orders</Link>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-item logout-btn">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {!isLoading && !user?.isLoggedIn && (
            <Link href="/login" className="btn-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
