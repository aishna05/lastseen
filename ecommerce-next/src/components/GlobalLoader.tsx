// /src/components/GlobalLoader.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Loader from "./Loader";
import Image from 'next/image';

const GlobalLoader: React.FC = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(false);
    const [prevPath, setPrevPath] = useState<string | null>(null);

    useEffect(() => {
        if (prevPath === null) {
            setPrevPath(pathname);
            return;
        }

        if (pathname !== prevPath) {
            setLoading(true);
            const timer = setTimeout(() => {
                setLoading(false);
            }, 100);
            setPrevPath(pathname);
            return () => clearTimeout(timer);
        }
    }, [pathname, prevPath]);

    if (!loading) {
        return null;
    }

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 9999,
                backgroundColor: 'rgba(33, 17, 11, 0.95)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '20px',
            }}
            className="global-loader-overlay"
        >
            <Image
                src="/logo.JPG"
                alt="Logo"
                width={100}
                height={100}
                priority
            />
            <Loader size="lg" text="Loading..." />
        </div>
    );
};

export default GlobalLoader;