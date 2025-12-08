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
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) clamp(1rem, 6vw, 10.5rem)' }}>
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <h1 className="text-3xl font-semibold mb-6" style={{ animation: 'fadeSlideUp 0.6s ease-out' }}>All Products</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => {
            const finalPrice = p.discount
              ? p.price * (1 - p.discount / 100)
              : p.price;

            return (
              <div key={p.id} className="card space-y-3">
                {p.imageUrl && (
                  <img
                    src={p.imageUrl}
                    alt={p.title}
                    className="w-full h-44 object-cover rounded"
                  />
                )}

                <h2 className="font-medium text-lg">{p.title}</h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {p.description}
                </p>
                <p className="text-xs text-[var(--text-soft)]">
                  Seller: {p.seller.name}
                </p>

                <div className="flex items-center gap-2">
                  {p.discount ? (
                    <>
                      <span className="line-through text-xs text-red-400">
                        ₹{p.price}
                      </span>
                      <span className="font-semibold text-[var(--primary-strong)]">
                        ₹{finalPrice.toFixed(2)}
                      </span>
                      <span className="text-xs text-green-400">
                        {p.discount}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-[var(--primary-strong)]">
                      ₹{p.price}
                    </span>
                  )}
                </div>

                <button className="btn-primary w-full mt-2">
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
        </div>
      </section>

    </main>
  );
}