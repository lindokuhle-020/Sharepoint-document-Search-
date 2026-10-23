import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import treasuryLogo from '../assets/treasury-logo.jpg';
import '../styles/Header.css';

const NAV_ITEMS = [
  { to: '/search', label: 'Search documents' },
  { to: '/my-activity', label: 'My activity' },
];

function initialsOf(name) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/** Green portal header: title on the left, navigation, Treasury logo far right. */
function Header() {
  const { account, isAuthenticated, signOut } = useAuth();
  const [navOpen, setNavOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="container header-main__inner">
        <Link to="/search" className="brand" aria-label="HR Document Search — search page">
          <span className="brand__titles">
            
            <span className="brand__subtitle">KwaZulu-Natal Provincial Treasury</span>
          </span>
        </Link>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={navOpen}
          aria-controls="primary-navigation"
          onClick={() => setNavOpen((open) => !open)}
        >
          <span className="nav-toggle__icon" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          Menu
        </button>

        <nav
          id="primary-navigation"
          className={`primary-nav ${navOpen ? 'is-open' : ''}`}
          aria-label="Primary"
        >
          <ul className="primary-nav__list">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) => `nav-link${isActive ? ' is-active' : ''}`}
                  onClick={() => setNavOpen(false)}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="primary-nav__account">
            {isAuthenticated ? (
              <div className="account">
                <button
                  type="button"
                  className="account__chip"
                  aria-expanded={accountOpen}
                  aria-haspopup="true"
                  onClick={() => setAccountOpen((open) => !open)}
                >
                  <span className="account__avatar" aria-hidden="true">
                    {initialsOf(account.name)}
                  </span>
                  <span className="account__name">{account.name}</span>
                </button>

                {accountOpen && (
                  <div className="account__menu">
                    <p className="account__identity">
                      <strong>{account.name}</strong>
                      <span>{account.email}</span>
                      {account.isDemo && <span className="account__demo-tag">Demo account</span>}
                    </p>
                    <button
                      type="button"
                      className="account__signout"
                      onClick={() => {
                        setAccountOpen(false);
                        signOut();
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/signin" className="btn btn-sm header-signin" onClick={() => setNavOpen(false)}>
                Sign in
              </Link>
            )}
          </div>
        </nav>

        {/* Treasury logo — far right */}
        <Link to="/search" className="brand-logo" aria-label="KwaZulu-Natal Provincial Treasury — search page">
          <img src={treasuryLogo} alt="KwaZulu-Natal Provincial Treasury" />
        </Link>
      </div>
    </header>
  );
}

export default Header;
