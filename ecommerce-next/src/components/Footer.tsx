import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner page-shell">
        <div className="footer-columns">
          <div className="footer-col">
            <h4>Contact Us</h4>
            <p>
              <a href="mailto:Support@lastseen.co.in" style={{ color: 'inherit', textDecoration: 'none' }}>Support@lastseen.co.in</a>
            </p>
            <p>
              <a href="tel:+919009690690" style={{ color: 'inherit', textDecoration: 'none' }}>+91 90096 90690</a>
            </p>
            <Link href="/contact-us" className="btn-ghost">Contact form</Link>
          </div>

          <div className="footer-col">
            <h4>Follow</h4>
            <ul className="social-list">
              <li>
                <a href="https://www.instagram.com/lastseen.co.in?igsh=MWZrdzhzMHRpMnF0Nw%3D%3D&utm_source=qr" target="_blank" rel="noreferrer">
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://wa.me/919009690690" target="_blank" rel="noreferrer">WhatsApp Support</a>
              </li>
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
