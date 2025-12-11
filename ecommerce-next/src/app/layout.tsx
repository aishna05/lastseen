// src/app/layout.tsx
import type { Metadata } from "next";
import "./global.css";
import Providers from "./providers";
import RoleBasedHeader from "@/components/RoleBasedHeader";

export const metadata: Metadata = {
  title: "My Ecommerce",
  description: "Ecommerce built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <RoleBasedHeader />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
