import { useState } from 'react';
import '../styles/SearchBar.css';

/**
 * Reusable search bar.
 *
 * @param {object} props
 * @param {string} [props.initialQuery] Pre-filled query (search results page).
 * @param {string[]} [props.fileTypes] When provided, renders a file-type select.
 * @param {boolean} [props.showLabel] Show a visible label above the bar.
 * @param {'lg'|'md'} [props.size] Visual size.
 * @param {(query: string, type: string) => void} props.onSearch Called on submit.
 */
function SearchBar({
  initialQuery = '',
  fileTypes = [],
  showLabel = false,
  size = 'lg',
  onSearch,
}) {
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(query.trim(), type);
  };

  return (
    <form
      className={`search-bar search-bar--${size}`}
      role="search"
      aria-label="Document search"
      onSubmit={handleSubmit}
    >
      {showLabel && (
        <label className="search-bar__label" htmlFor="search-bar-input">
          Search for documents
        </label>
      )}

      <div className="search-bar__row">
        <div className="search-bar__field">
          <svg
            className="search-bar__icon"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="16.5" y1="16.5" x2="21" y2="21" />
          </svg>
          <input
            id="search-bar-input"
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search policies, reports, gazettes, forms…"
            autoComplete="off"
          />
        </div>

        {fileTypes.length > 0 && (
          <div className="search-bar__select">
            <label className="visually-hidden" htmlFor="search-bar-type">
              File type
            </label>
            <select
              id="search-bar-type"
              value={type}
              onChange={(event) => setType(event.target.value)}
            >
              <option value="">Any file type</option>
              {fileTypes.map((fileType) => (
                <option key={fileType} value={fileType}>
                  {fileType}
                </option>
              ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary search-bar__submit">
          Search
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
