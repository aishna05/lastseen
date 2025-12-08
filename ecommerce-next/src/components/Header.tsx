// /src/components/Header.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth'; // Your existing authentication hook

// Placeholder for a logout function (implement this in your auth hook)
const handleLogout = () => {
    // Replace with actual logout logic (e.g., clearing tokens, redirecting)
    console.log("User logged out!");
    window.location.href = '/login'; // Redirect to login after logout
};

// Profile Icon (Simple SVG Placeholder)
const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);


const Header: React.FC = () => {
    const { user, isLoading } = useAuth();
    
    // List of common navigation links
    const navLinks = [
        { href: "/products", label: "Products" },
        { href: "/about-us", label: "About Us" },
        { href: "/contact-us", label: "Contact Us" },
    ];

    return (
        <header className="site-header">
            <div className="site-header-inner">
                {/* Site Logo */}
                <Link href="/" className="site-logo">
                    LastSeen
                </Link>

                {/* Navigation Links */}
                <nav className="flex space-x-6 items-center">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                            {link.label}
                        </Link>
                    ))}

                    {/* Authentication and Profile Icons */}
                    {!isLoading && (
                        <>
                            {user?.isLoggedIn ? (
                                // LOGGED IN: Show Profile Icon and Logout Button
                                <>
                                    <Link 
                                        href="/profile" 
                                        title="View Profile"
                                        className="p-1 rounded-full border border-transparent hover:border-white transition-all"
                                    >
                                        <ProfileIcon className="w-6 h-6" style={{ color: 'var(--primary-strong)' }} />
                                    </Link>
                                    
                                    <button
                                        onClick={handleLogout}
                                        className="btn-ghost" // Use your ghost button style
                                        style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', letterSpacing: '0.1em'}}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                // LOGGED OUT: Show Login Link
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