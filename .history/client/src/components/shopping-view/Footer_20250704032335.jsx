import './Footer.css';

const Footer = () => {
  return (
    <footer className="furns-footer">
      <div className="footer-container">
        <div className="footer-columns">
          {/* About Us Column */}
          <div className="footer-column">
            <h3 className="footer-title">ABOUT US</h3>
            <p className="footer-about-text">
              Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.
            </p>
          </div>

          {/* Information Column */}
          <div className="footer-column">
            <h3 className="footer-title">INFORMATION</h3>
            <ul className="footer-links">
              <li><a href="/about">About Us</a></li>
              <li><a href="/manufacturer">Manufacturer</a></li>
              <li><a href="/trading-order">Trading Order</a></li>
              <li><a href="/privacy-policy">Privacy & Policy</a></li>
              <li><a href="/terms-conditions">Terms & Conditions</a></li>
            </ul>
          </div>

          {/* My Account Column */}
          <div className="footer-column">
            <h3 className="footer-title">MY ACCOUNT</h3>
            <ul className="footer-links">
              <li><a href="/login">Login</a></li>
              <li><a href="/my-call">My Call</a></li>
              <li><a href="/website">Website</a></li>
              <li><a href="/compare">Compare</a></li>
              <li><a href="/my-account">My Account</a></li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="footer-column">
            <h3 className="footer-title">NEWSLETTER</h3>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter E-Mail Address" 
                className="newsletter-input"
              />
              <button className="subscribe-button">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="copyright-section">
          <p>© 2023, FURNS, Made With ❤️ by YourBrand</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;