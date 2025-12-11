"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";

const Header: React.FC = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: "/products", label: "Products" },
    { href: "/seller/dashboard", label: "Add Product", roles: ["SELLER"] },
    { href: "/seller/myorder", label: "My Orders", roles: ["SELLER"] },
    { href: "/seller/myproducts", label: "My Products", roles: ["SELLER"] },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("tokenChange"));
    setIsDropdownOpen(false);
    router.push("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link href="/" className="site-logo">
          <Image
            src="/media/Logo.png"
            alt="Site Logo"
            width={150}
            height={75}
            priority
            style={{ objectFit: "contain" }}
          />
        </Link>

        {/* --------------------- NAVBAR --------------------- */}
        <nav className="site-nav">
          {/* Render filtered nav links */}
          {navLinks
            .filter(
              (link) =>
                !link.roles || (user?.role && link.roles.includes(user.role))
            )
            .map((link) => (
              <Link key={link.href} href={link.href} className="nav-link">
                {link.label}
              </Link>
            ))}

          {/* Right side buttons */}
          {!isLoading && (
            <>
              {user?.isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="profile-icon-btn hover:scale-105 transition-transform"
                  >
                    <User size={24} strokeWidth={2.5} color="#D4BC84" />
                  </button>

                  {isDropdownOpen && (
                    <div className="profile-dropdown absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-40">
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User size={18} color="#A68A55" />
                        <span>View Profile</span>
                      </Link>

                      <hr />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-left"
                      >
                        <LogOut size={18} color="#ff8866" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="btn-primary hover:scale-105 transition-transform"
                  style={{ padding: "0.6rem 1.4rem", fontSize: "0.8rem" }}
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
