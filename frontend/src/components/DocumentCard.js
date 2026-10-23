import { Link } from 'react-router-dom';
import { formatDate, formatSize } from '../services/searchService';
import '../styles/DocumentCard.css';

const TYPE_CLASSES = {
  PDF: 'doc-badge--pdf',
  Word: 'doc-badge--word',
  Excel: 'doc-badge--excel',
  Presentation: 'doc-badge--presentation',
};

/** Highlight query terms inside a snippet (case-insensitive). */
function highlight(text, query) {
  if (!query || !query.trim()) return text;
  const terms = query
    .trim()
    .split(/\s+/)
    .filter((term) => term.length > 1)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));

  if (terms.length === 0) return text;

  const pattern = new RegExp(`(${terms.join('|')})`, 'ig');
  return text.split(pattern).map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part
  );
}

/**
 * A single search / recent result row.
 *
 * @param {object} props
 * @param {object} props.document Document from searchService.
 * @param {string} [props.query] Query to highlight in the snippet.
 * @param {number} [props.rank] Optional result position number.
 */
function DocumentCard({ document: doc, query = '', rank }) {
  return (
    <article className="doc-card">
      <span className={`doc-badge ${TYPE_CLASSES[doc.type] || ''}`} aria-hidden="true">
        {doc.type === 'Presentation' ? 'PPT' : doc.type.slice(0, 3)}
      </span>

      <div className="doc-card__body">
        <h3 className="doc-card__title">
          {rank != null && <span className="doc-card__rank">{rank}.</span>}
          <Link to={`/documents/${doc.id}`}>{highlight(doc.title, query)}</Link>
        </h3>

        <p className="doc-card__path">
          {doc.category} <span aria-hidden="true">›</span> {doc.folder}
        </p>

        <p className="doc-card__summary">{highlight(doc.summary, query)}</p>

        <ul className="doc-card__meta">
          <li>{doc.name}</li>
          <li>Modified {formatDate(doc.modified)}</li>
          <li>{formatSize(doc.size)}</li>
          <li>by {doc.author}</li>
        </ul>
      </div>

      <div className="doc-card__actions">
        <Link className="btn btn-secondary btn-sm" to={`/documents/${doc.id}`}>
          Details
        </Link>
      </div>
    </article>
  );
}

export default DocumentCard;
