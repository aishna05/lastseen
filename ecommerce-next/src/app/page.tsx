import ProductListingClientWrapper from "@/components/ProductListingClientWrapper";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    include: { seller: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="space-y-16">
      
      {/* ✅ HERO VIDEO SECTION - IMPROVED & MOBILE RESPONSIVE */}
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

      {/* ✅ PRODUCTS SECTION (CONSTRAINED & CENTERED) */}
      <ProductListingClientWrapper products={products} />

    </main>
  );
}