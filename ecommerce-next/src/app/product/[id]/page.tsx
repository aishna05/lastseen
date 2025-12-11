// app/product/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

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

  // ---- IMAGES ----
  const images: string[] = product.imageUrls
    ? (() => {
        try {
          return JSON.parse(product.imageUrls as any);
        } catch {
          return [product.imageUrls as any];
        }
      })()
    : [];

  const mainImage = images[0] || "";

  // ---- SIZES / STOCK ----
  let availableSizes: string[] = [];
  let sizeStock: Record<string, number> = {};
  let colors: string[] = [];

  if (product.availableSizes) {
    try {
      availableSizes = JSON.parse(product.availableSizes as any);
    } catch {
      availableSizes = [];
    }
  }

  if (product.sizeStock) {
    try {
      sizeStock = JSON.parse(product.sizeStock as any);
    } catch {
      sizeStock = {};
    }
  }

  if (product.colors) {
    try {
      colors = JSON.parse(product.colors as any);
    } catch {
      colors = [];
    }
  }

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

          {/* META BLOCK – now shows all extra fields */}
          <div className="product-detail-meta">
            {product.seller?.name && (
              <p>
                <span>Designer</span>
                <strong>{product.seller.name}</strong>
              </p>
            )}

            {product.brand && (
              <p>
                <span>Brand</span>
                <strong>{product.brand}</strong>
              </p>
            )}

            {product.gender && (
              <p>
                <span>Gender</span>
                <strong>{product.gender}</strong>
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

            {product.material && (
              <p>
                <span>Material</span>
                <strong>{product.material}</strong>
              </p>
            )}

            {product.fabricCare && (
              <p>
                <span>Fabric Care</span>
                <strong>{product.fabricCare}</strong>
              </p>
            )}

            {product.occasion && (
              <p>
                <span>Occasion</span>
                <strong>{product.occasion}</strong>
              </p>
            )}

            {product.modelNumber && (
              <p>
                <span>Model No.</span>
                <strong>{product.modelNumber}</strong>
              </p>
            )}

            {product.weight && (
              <p>
                <span>Weight</span>
                <strong>{product.weight} g</strong>
              </p>
            )}

            {product.dimensions && (
              <p>
                <span>Dimensions</span>
                <strong>{product.dimensions}</strong>
              </p>
            )}

            {product.returnPolicy && (
              <p>
                <span>Return Policy</span>
                <strong>{product.returnPolicy}</strong>
              </p>
            )}
          </div>

          {/* DESCRIPTION / DETAILS */}
          {(product.description || product.details) && (
            <div className="product-detail-description">
              <h2>About this piece</h2>
              {product.description && <p>{product.description}</p>}
              {product.details && <p>{product.details}</p>}
            </div>
          )}

          {/* SIZES + STOCK */}
          {availableSizes.length > 0 && (
            <div className="product-detail-description">
              <h2>Sizes & stock</h2>
              <div className="size-checkbox-group">
                {availableSizes.map((size) => {
                  const qty = sizeStock?.[size] ?? 0;
                  return (
                    <span key={size}>
                      <span className="btn-primary">{size}</span>
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* COLORS
          {colors.length > 0 && (
            <div className="product-detail-description">
              <h2>Available colours</h2>
              <div className="color-pill-row">
                {colors.map((c) => (
                  <span key={c} className="color-pill">
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            </div>
          )} */}

          {/* OPTIONAL seller notes – you might keep this internal only, so comment if not needed */}
          {product.sellerNotes && (
            <div className="product-detail-description">
              <h2>Seller notes</h2>
              <p>{product.sellerNotes}</p>
            </div>
          )}

          {/* ADD TO CART */}
          <AddToCartButton productId={productId} />

          {/* BUY NOW */}
          <Link href={`/order/${productId}`} className="w-full mt-2">
            <button type="button" className="btn-primary w-full">
              Buy Now
            </button>
          </Link>
        </div>
      </section>
    </main>
  );
}
