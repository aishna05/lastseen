export const dynamic = 'force-dynamic';

import ProductListingClientWrapper from "@/components/ProductListingClientWrapper";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });

  const productsForDisplay = products.map((p) => {
    const finalPrice = p.discount ? p.price * (1 - p.discount / 100) : p.price;
    return {
      id: p.id,
      title: p.title,
      price: finalPrice,
      originalPrice: p.price,
      discount: p.discount,
      imageUrls: p.imageUrls,
      sellerName: p.seller.name,
    };
  });

  // Show only a few products on home page, link to all products
  const featured = productsForDisplay.slice(0, 6);

  return (
    <main className="space-y-16">
      <section className="hero-video-section">
        <div className="hero-video-wrapper">
          <video
            src="/media/LAST%20SEEN%20outro.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="hero-video"
          />
        </div>
      </section>

      <section className="page-shell">
        <ProductListingClientWrapper products={featured} />
        <div style={{display: 'flex', justifyContent: 'center', paddingBottom: '2rem'}}>
          <Link href="/products" className="btn-primary" aria-label="View all products">More Products →</Link>
        </div>
      </section>
    </main>
  );
}