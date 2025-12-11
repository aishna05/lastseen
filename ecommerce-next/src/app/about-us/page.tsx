// /src/app/about-us/page.tsx
import React from "react";
import Link from "next/link";

export const metadata = {
  title: "About Us | LAST SEEN",
  description:
    "Where India's heritage meets modern luxury fashion — handcrafted, artisanal, timeless.",
};

const AboutUsPage = () => {
  return (
    <div className="about-page page-shell">
      <h1 className="about-title">About Us</h1>

      <div className="about-section single-column">
        <p>
          LAST SEEN is a unisex luxury fashion brand where India’s heritage meets
          modern design. We blend centuries-old block printing and artisanal
          handwork with contemporary silhouettes, crafting pieces that feel
          timeless, bold, and globally relevant.
        </p>

        <p>
          Our signature lies in the use of <strong>Real Gold (Sona)</strong> and{" "}
          <strong>Real Silver (Chandi)</strong> detailing — transforming
          traditional craftsmanship into wearable luxury. Every garment is
          hand-crafted with intention, artistry, and cultural depth.
        </p>

        <p>
          At LAST SEEN, we believe fashion should tell a story.  
          A story of heritage, individuality, and handcrafted excellence.  
          A story you can wear.
        </p>

        <p className="closing-line">
          <strong>LAST SEEN — From Heritage to High Fashion.</strong>
        </p>
      </div>

      <div className="about-cta">
        <Link href="/products" className="btn-primary">
          Explore Collection
        </Link>
      </div>
    </div>
  );
};

export default AboutUsPage;
