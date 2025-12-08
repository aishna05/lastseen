'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/hooks/useAuth'; // your auth hook

const handleLogout = () => {
    console.log("User logged out!");
    window.location.href = '/login';
};

const ProfileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const Header: React.FC = () => {
    const { user, isLoading } = useAuth();

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
                    <Image 
                        src="/media/logo.JPG" 
                        alt="Site Logo" 
                        width={150} 
                        height={50} 
                        priority // ensures logo loads fast
                        style={{ objectFit: 'contain' }}
                    />
                </Link>

                {/* Navigation Links */}
                <nav className="flex space-x-6 items-center">
                    {navLinks.map(link => (
                        <Link key={link.href} href={link.href}>
                            {link.label}
                        </Link>
                    ))}

                    {!isLoading && (
                        <>
                            {user?.isLoggedIn ? (
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
                                        className="btn-ghost"
                                        style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', letterSpacing: '0.1em'}}
                                    >
                                        Logout
                                    </button>
                                </>
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
