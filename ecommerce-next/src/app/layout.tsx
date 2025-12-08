import type { Metadata } from "next";
import "./global.css";
import Providers from "./providers";
import GlobalLoader from "@/components/GlobalLoader";
import Header from "@/components/Header";

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
      <GlobalLoader />
      <body>
        <header><Header /></header>
        <Providers>{children}</Providers>
        <GlobalLoader />
      </body>
    </html>
  );
}
