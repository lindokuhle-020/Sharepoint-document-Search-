import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import DocumentCard from '../components/DocumentCard';
import SearchBar from '../components/SearchBar';
import {
  FILE_TYPES,
  LIBRARY_NAME,
  MODIFIED_OPTIONS,
  SORT_OPTIONS,
  searchDocuments,
} from '../services/searchService';
import '../styles/SearchResults.css';

/**
 * Search page — the landing page after sign-in.
 * Searches the single KZN Treasury HR document library.
 * All state (query, filters, sort, page) lives in the URL so results can be
 * bookmarked and shared.
 */
function SearchResults() {
  const { isAuthenticated } = useAuth();
  const [params, setParams] = useSearchParams();

  const query = params.get('q') || '';
  const selectedTypes = params.getAll('type');
  const modified = params.get('modified') || 'any';
  const sort = params.get('sort') || 'relevance';
  const page = Number.parseInt(params.get('page') || '1', 10);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasFilters = selectedTypes.length > 0 || modified !== 'any';

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    let active = true;
    setLoading(true);

    searchDocuments({ query, types: selectedTypes, modified, sort, page }).then((data) => {
      if (!active) return;
      setResult(data);
      setLoading(false);
    });

    return () => {
      active = false;
    };
    // join() keeps the effect stable while still reacting to list changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, query, selectedTypes.join('|'), modified, sort, page]);

  /** Merge updates into the URL params (and reset paging when filtering). */
  const updateParams = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(updates)) {
      next.delete(key);
      if (Array.isArray(value)) {
        value.forEach((item) => next.append(key, item));
      } else if (value) {
        next.set(key, value);
      }
    }
    if (resetPage) next.delete('page');
    setParams(next);
  };

  const toggleType = (fileType) => {
    const current = params.getAll('type');
    const next = current.includes(fileType)
      ? current.filter((item) => item !== fileType)
      : [...current, fileType];
    updateParams({ type: next });
  };

  const clearFilters = () => updateParams({ type: [], modified: null });

  const runSearch = (nextQuery, type) => {
    updateParams({
      q: nextQuery || null,
      type: type ? [type] : [],
    });
  };

  const pageNumbers = useMemo(() => {
    if (!result) return [];
    return Array.from({ length: result.pageCount }, (_, index) => index + 1);
  }, [result]);

  /* ── Sign-in gate (internal HR portal) ─────────────────────────────── */
  if (!isAuthenticated) {
    return (
      <div className="container page">
        <div className="auth-gate card">
          <svg viewBox="0 0 24 24" width="48" height="48" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="10" width="16" height="10" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </svg>
          <h1>Sign in to search documents</h1>
          <p>
            The HR Document Library is available to KwaZulu-Natal Provincial Treasury
            Human Resources staff. Sign in with your government Microsoft account.
          </p>
          <Link className="btn btn-primary" to="/signin?redirect=/search">
            Sign in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h1>{query ? `Results for “${query}”` : 'Search HR documents'}</h1>
        <p className="page-header__lead">
          {result
            ? `${result.total} document${result.total === 1 ? '' : 's'} found in the ${LIBRARY_NAME}`
            : `Searching the ${LIBRARY_NAME}…`}
        </p>
      </div>

      <SearchBar initialQuery={query} fileTypes={FILE_TYPES} size="md" onSearch={runSearch} />

      <div className="results-layout">
        {/* ── Filters ──────────────────────────────────────────────────── */}
        <aside className="filters card" aria-label="Filter results">
          <div className="filters__header">
            <h2>Filters</h2>
            {hasFilters && (
              <button type="button" className="filters__clear" onClick={clearFilters}>
                Clear all
              </button>
            )}
          </div>

          <fieldset className="filter-group">
            <legend>File type</legend>
            {FILE_TYPES.map((fileType) => (
              <label key={fileType} className="filter-option">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(fileType)}
                  onChange={() => toggleType(fileType)}
                />
                {fileType}
              </label>
            ))}
          </fieldset>

          <fieldset className="filter-group">
            <legend>Date modified</legend>
            {MODIFIED_OPTIONS.map((option) => (
              <label key={option.value} className="filter-option">
                <input
                  type="radio"
                  name="modified"
                  checked={modified === option.value}
                  onChange={() => updateParams({ modified: option.value === 'any' ? null : option.value })}
                />
                {option.label}
              </label>
            ))}
          </fieldset>
        </aside>

        {/* ── Results ──────────────────────────────────────────────────── */}
        <section className="results" aria-label="Search results" aria-busy={loading}>
          <div className="results__toolbar">
            <p className="results__count" role="status">
              {loading
                ? 'Searching…'
                : result.total === 0
                  ? 'No documents match your search'
                  : `Showing ${result.items.length} of ${result.total} results${
                      result.pageCount > 1 ? ` — page ${result.page} of ${result.pageCount}` : ''
                    }`}
            </p>

            <div className="results__sort">
              <label htmlFor="sort-select">Sort by</label>
              <select
                id="sort-select"
                className="select"
                value={sort}
                onChange={(event) => updateParams({ sort: event.target.value === 'relevance' ? null : event.target.value })}
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <>
              <div className="spinner" />
              <p className="loading-label">Searching the HR document library…</p>
            </>
          ) : result.items.length === 0 ? (
            <div className="empty-state card">
              <h2>No documents found</h2>
              <p>
                {query ? (
                  <>
                    Nothing matched <strong>“{query}”</strong> with the current filters.
                  </>
                ) : (
                  'Try entering a search term or adjusting your filters.'
                )}
              </p>
              <ul>
                <li>Check the spelling of your search terms.</li>
                <li>Use fewer keywords — try one or two words.</li>
                <li>Clear the filters on the left to widen the search.</li>
              </ul>
            </div>
          ) : (
            <div className="results__list">
              {result.items.map((doc, index) => (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  query={query}
                  rank={(result.page - 1) * result.pageSize + index + 1}
                />
              ))}
            </div>
          )}

          {!loading && result.pageCount > 1 && (
            <nav className="pagination" aria-label="Search result pages">
              <button
                type="button"
                className="pagination__btn"
                disabled={result.page <= 1}
                onClick={() => updateParams({ page: result.page - 1 }, { resetPage: false })}
              >
                Previous
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  type="button"
                  className={`pagination__btn${number === result.page ? ' is-current' : ''}`}
                  aria-current={number === result.page ? 'page' : undefined}
                  onClick={() => updateParams({ page: number === 1 ? null : number }, { resetPage: false })}
                >
                  {number}
                </button>
              ))}

              <button
                type="button"
                className="pagination__btn"
                disabled={result.page >= result.pageCount}
                onClick={() => updateParams({ page: result.page + 1 }, { resetPage: false })}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}

export default SearchResults;
