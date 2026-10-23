import '../styles/Footer.css';

/**
 * Green portal footer — KZN Treasury slogan.
 * (Add any extra footer links/content here if needed later.)
 */
function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <p className="site-footer__slogan"></p>
        <p className="site-footer__dept">KwaZulu-Natal Provincial Treasury | Inspiring And Enabling Financial Stability </p>
        
      </div>
    </footer>
  );
}

export default Footer;
