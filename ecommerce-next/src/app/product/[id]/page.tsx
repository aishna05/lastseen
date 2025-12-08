// app/product/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface ProductPageProps {
   params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
const productId = Number(id);
  if (!productId || Number.isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      category: true,
      subcategory: true,
      seller: true,
    },
  });

  if (!product) return notFound();

  const images: string[] = product.imageUrls
    ? (() => {
        try {
          return JSON.parse(product.imageUrls);
        } catch {
          // if it's not valid JSON, fall back to single URL
          return [product.imageUrls];
        }
      })()
    : [];

  const mainImage = images[0] || "";

  return (
    <main className="product-detail-page">
      <section className="product-detail-layout">
        {/* LEFT: IMAGE GALLERY */}
        <div className="product-detail-gallery">
          <div className="product-detail-main-image-wrapper">
            {mainImage ? (
              <div
                className="product-detail-main-image"
                style={{ backgroundImage: `url(${mainImage})` }}
              />
            ) : (
              <div className="product-detail-main-image fallback">
                <span>No image available</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="product-detail-thumbnails">
              {images.map((src, index) => (
                <div
                  key={index}
                  className="product-detail-thumb"
                  style={{ backgroundImage: `url(${src})` }}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO PANEL */}
        <div className="product-detail-info">
          <div className="product-detail-header">
            <p className="product-detail-eyebrow">
              {product.category?.name || "Curated Piece"}
              {product.subcategory?.name
                ? ` • ${product.subcategory.name}`
                : ""}
            </p>
            <h1 className="product-detail-title">{product.title}</h1>
          </div>

          <p className="product-detail-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <div className="product-detail-meta">
            {product.seller?.name && (
              <p>
                <span>Designer</span>
                <strong>{product.seller.name}</strong>
              </p>
            )}
            {product.category?.name && (
              <p>
                <span>Category</span>
                <strong>{product.category.name}</strong>
              </p>
            )}
            {product.subcategory?.name && (
              <p>
                <span>Subcategory</span>
                <strong>{product.subcategory.name}</strong>
              </p>
            )}
          </div>

          {product.description && (
            <div className="product-detail-description">
              <h2>About this piece</h2>
              <p>{product.description}</p>
            </div>
          )}
          <button className="btn-primary">Add to Cart</button>
          <button className="btn-primary">Buy Now </button>
          {/* You can later add size / color / CTA buttons here */}
        </div>
      </section>
    </main>
  );
}
