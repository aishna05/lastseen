// next.config.ts

import { NextConfig } from 'next';

const nextConfig: NextConfig & { srcDir?: string } = {
  // Add this line to tell Next.js to look for the 'app' directory inside 'src/'
  // experimental: { appDir: true, /* This is often implicit but good practice for App Router */ } as any,
  srcDir: 'src', // <--- THIS IS THE CRUCIAL LINE
};

export default nextConfig;