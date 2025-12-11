// /src/app/about-us/page.tsx
import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us | Lost Seeker',
  description: 'Our journey and mission to find and share timeless, artisanal goods.',
};

const AboutUsPage = () => {
  return (
    <div className="about-page-wrapper">
      <h1>Our Journey: The Lost Seeker</h1>
      <h2 className="contact-subheading" style={{color: 'var(--text-muted)'}}>
        Discovering the Craft, One Story at a Time.
      </h2>

      <div className="about-content-grid">
        <section>
          <h3>The Philosophy</h3>
          <p>
            The world is rich with history and craftsmanship often overlooked in the rush of modern life. We founded **Lost Seeker** on the principle of reverence for the handmade, the authentic, and the enduring. Our mission is to traverse forgotten corners and hidden workshops to bring you pieces that carry a soul—items that are not just products, but **heirlooms in the making**.
          </p>
          <p>
            Every seller on our platform shares this dedication to quality over quantity. We believe in transparency, ethical sourcing, and empowering the artisans whose skills define their lives.
          </p>
        </section>

        <section>
          <h3>Our Commitment</h3>
          <ul className="commitment-list" style={{borderLeft: '3px solid var(--primary-soft)'}}>
            <li>
              <strong>Authenticity:</strong> Every product is verified for its story and origin.
            </li>
            <li>
              <strong>Sustainability:</strong> We prioritize eco-friendly and timeless materials.
            </li>
            <li>
              <strong>Community:</strong> We directly support small-scale artisans and independent sellers globally.
            </li>
          </ul>
        </section>
      </div>
      
      <div className="about-cta">
        <Link href="/products" className="btn-primary">
          Explore Our Unique Finds
        </Link>
      </div>
    </div>
  );
};

export default AboutUsPage;