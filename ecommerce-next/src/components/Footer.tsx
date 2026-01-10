import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner page-shell">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>support@lastseen.example</p>
            <p>+1 (555) 123-4567</p>
            <Link href="/contact-us" className="btn-ghost">Get in touch</Link>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul className="social-list">
              <li><a href="https://instagram.com/lastseen" target="_blank" rel="noreferrer">Instagram</a></li>
              <li><a href="https://facebook.com/lastseen" target="_blank" rel="noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com/lastseen" target="_blank" rel="noreferrer">Twitter</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Company</h4>
            <ul className="footer-links">
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/products">All Products</Link></li>
              <li><Link href="/profile">My Account</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LastSeen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
