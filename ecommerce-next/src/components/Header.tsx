'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { User, Package, LogOut } from 'lucide-react';

const Header: React.FC = () => {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.dispatchEvent(new Event('tokenChange'));
        setIsDropdownOpen(false);
        router.push('/login');
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
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
                        width={150} 
                        height={50} 
                        priority
                        width={200} 
                        height={100} 
                        priority // ensures logo loads fast
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
                                <div className="profile-dropdown-container" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="profile-icon-btn"
                                        title="Profile Menu"
                                        aria-label="Profile Menu"
                                    >
                                        <User size={24} strokeWidth={2.5} color="#D4BC84" />
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="profile-dropdown">
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <User size={18} color="#A68A55" />
                                                <span>View Profile</span>
                                            </Link>
                                            <Link
                                                href="/orders"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                <Package size={18} color="#A68A55" />
                                                <span>My Orders</span>
                                            </Link>
                                            <hr />
                                            <button onClick={handleLogout}>
                                                <LogOut size={18} color="#ff8866" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link href="/login" className="btn-primary" style={{padding: '0.6rem 1.4rem', fontSize: '0.8rem'}}>
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