"use client";

import React, { useState } from "react";

type Props = {
  images: string[];
};

export default function ProductGallery({ images }: Props) {
  const [index, setIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="product-detail-main-image fallback">
        <span>No image available</span>
      </div>
    );
  }

  return (
    <div className="product-detail-gallery">
      <div className="product-detail-main-image-wrapper">
        <div
          className="product-detail-main-image"
          style={{ backgroundImage: `url(${images[index]})` }}
          role="img"
          aria-label={`Product image ${index + 1} of ${images.length}`}
        />
      </div>

      {images.length > 1 && (
        <div className="product-detail-thumbnails" aria-hidden={false}>
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              className={`product-detail-thumb ${i === index ? "active" : ""}`}
              style={{ backgroundImage: `url(${src})` }}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
