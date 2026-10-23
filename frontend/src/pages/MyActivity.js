import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DocumentCard from '../components/DocumentCard';
import { getRecentDocuments } from '../services/searchService';
import '../styles/MyActivity.css';

const DEMO_SEARCHES = [
  { query: 'Leave guide', when: 'Today, 08:15', results: 2 },
  { query: 'salary scales', when: 'Yesterday, 14:32', results: 1 },
  { query: 'recruitment', when: 'Yesterday, 09:07', results: 2 },
  { query: 'performance agreement', when: '12 Aug 2026, 16:44', results: 2 },
];

/**
 * My activity — recent searches and recently viewed documents.
 * Requires an (Entra ID) signed-in account; shows a sign-in prompt otherwise.
 */
function MyActivity() {
  const { account, isAuthenticated, signOut } = useAuth();
  const [searches, setSearches] = useState(DEMO_SEARCHES);
  const recentDocs = getRecentDocuments(4);

  if (!isAuthenticated) {
    return (
      <div className="container page">
        <div className="auth-gate card">
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <h1>Sign in to see your activity</h1>
          <p>
            Your recent searches and opened documents are tied to your government
            Microsoft account. Sign in with Entra ID single sign-on to continue.
          </p>
          <Link className="btn btn-primary" to="/signin?redirect=/my-activity">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-header activity-header">
        <div>
          <h1>My activity</h1>
          <p className="page-header__lead">
            Welcome back, {account.name}. Here is what you have been working on.
          </p>
        </div>
        <button type="button" className="btn btn-secondary btn-sm" onClick={signOut}>
          Sign out
        </button>
      </div>

      <section aria-labelledby="searches-heading">
        <div className="section-title section-title--flush">
          <h2 id="searches-heading">Recent searches</h2>
          {searches.length > 0 && (
            <button type="button" className="link-button" onClick={() => setSearches([])}>
              Clear history
            </button>
          )}
        </div>

        {searches.length === 0 ? (
          <p className="activity-empty">Your search history has been cleared.</p>
        ) : (
          <div className="card history-table-wrap">
            <table className="history-table">
              <thead>
                <tr>
                  <th scope="col">Search</th>
                  <th scope="col">When</th>
                  <th scope="col">Results</th>
                  <th scope="col">
                    <span className="visually-hidden">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {searches.map((entry) => (
                  <tr key={`${entry.query}-${entry.when}`}>
                    <td>{entry.query}</td>
                    <td>{entry.when}</td>
                    <td>{entry.results}</td>
                    <td className="history-table__action">
                      <Link to={`/search?q=${encodeURIComponent(entry.query)}`}>Search again</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section aria-labelledby="docs-heading">
        <div className="section-title">
          <h2 id="docs-heading">Recently viewed documents</h2>
          <Link to="/search">Browse all documents</Link>
        </div>
        <div className="activity-docs">
          {recentDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default MyActivity;
