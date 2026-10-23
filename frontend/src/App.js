import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import SearchResults from './pages/SearchResults';
import DocumentDetails from './pages/DocumentDetails';
import MyActivity from './pages/MyActivity';
import SignIn from './pages/SignIn';
import './styles/App.css';

/**
 * App.js is the navigation shell of the portal.
 *
 * It wraps the app in the Microsoft Entra ID auth provider (<AuthProvider>),
 * renders the global chrome (header + footer) and maps every URL to a page:
 *
 *   /                → redirects to /search (there is no home page)
 *   /search          → SearchResults  (the landing page after sign-in)
 *   /documents/:id   → DocumentDetails
 *   /my-activity     → MyActivity
 *   /signin          → SignIn
 */

/** Reset scroll position whenever the user navigates to a new page. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);

  return null;
}

/** Fallback page for unknown URLs. */
function NotFound() {
  return (
    <div className="container not-found">
      <span className="not-found__code" aria-hidden="true">404</span>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or may have been moved.</p>
      <Link className="btn btn-primary" to="/search">
        Go to search
      </Link>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/documents/:id" element={<DocumentDetails />} />
            <Route path="/my-activity" element={<MyActivity />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
