import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import DocumentCard from '../components/DocumentCard';
import {
  LIBRARY_NAME,
  formatDate,
  formatSize,
  getDocument,
  getRelatedDocuments,
} from '../services/searchService';
import '../styles/DocumentDetails.css';

const TYPE_CLASSES = {
  PDF: 'doc-badge--pdf',
  Word: 'doc-badge--word',
  Excel: 'doc-badge--excel',
  Presentation: 'doc-badge--presentation',
};

/** Document details page: metadata, preview area and SharePoint actions. */
function DocumentDetails() {
  const { id } = useParams();
  const [doc, setDoc] = useState(undefined); // undefined = loading, null = not found
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    setDoc(undefined);
    getDocument(id).then((data) => {
      if (active) setDoc(data);
    });
    return () => {
      active = false;
    };
  }, [id]);

  if (doc === undefined) {
    return (
      <div className="container page">
        <div className="spinner" />
        <p className="loading-label">Loading document…</p>
      </div>
    );
  }

  if (doc === null) {
    return (
      <div className="container page">
        <div className="empty-state card">
          <h1>Document not found</h1>
          <p>
            The document <strong>{id}</strong> does not exist, has been moved, or you do not
            have permission to view it.
          </p>
          <Link className="btn btn-primary" to="/search">
            Back to search
          </Link>
        </div>
      </div>
    );
  }

  const related = getRelatedDocuments(doc.category, doc.id, 3);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(doc.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="container page">
      <Breadcrumbs
        items={[
          { label: 'Search results', to: '/search' },
          { label: doc.title },
        ]}
      />

      <header className="doc-header">
        <span className={`doc-badge ${TYPE_CLASSES[doc.type] || ''}`} aria-hidden="true">
          {doc.type === 'Presentation' ? 'PPT' : doc.type.slice(0, 3)}
        </span>
        <div className="doc-header__text">
          <h1>{doc.title}</h1>
          <p className="doc-header__path">
            {LIBRARY_NAME} <span aria-hidden="true">›</span> {doc.folder}{' '}
            <span aria-hidden="true">›</span> {doc.name}
          </p>
        </div>
      </header>

      <div className="doc-actions">
        <a className="btn btn-primary" href={doc.url} target="_blank" rel="noopener noreferrer">
          Open in SharePoint
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 4h6v6" />
            <path d="M20 4 10 14" />
            <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
          </svg>
        </a>
        <button type="button" className="btn btn-secondary" onClick={copyLink}>
          {copied ? 'Link copied ✓' : 'Copy link'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          title="Download is handled by SharePoint once the backend is connected"
        >
          Download
        </button>
      </div>

      <div className="doc-layout">
        <section className="doc-preview card" aria-label="Document preview">
          <div className="doc-preview__frame">
            <svg viewBox="0 0 24 24" width="52" height="52" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
              <path d="M14 3v5h5" />
              <path d="M9 13h6M9 17h6" />
            </svg>
            <h2>Preview</h2>
            <p>
              The document preview will be embedded here through the Microsoft Graph
              file preview service once the backend connection is configured.
            </p>
          </div>
        </section>

        <aside className="doc-meta card" aria-label="Document details">
          <h2>Document details</h2>
          <dl>
            <dt>File name</dt>
            <dd>{doc.name}</dd>
            <dt>File type</dt>
            <dd>{doc.type}</dd>
            <dt>Folder</dt>
            <dd>{doc.folder}</dd>
            <dt>Category</dt>
            <dd>{doc.category}</dd>
            <dt>Author</dt>
            <dd>{doc.author}</dd>
            <dt>Created</dt>
            <dd>{formatDate(doc.created)}</dd>
            <dt>Last modified</dt>
            <dd>{formatDate(doc.modified)}</dd>
            <dt>File size</dt>
            <dd>{formatSize(doc.size)}</dd>
          </dl>

          <div className="notice">
            <h3>Who can access this document?</h3>
            <p>
              Access is limited to KZN Treasury Human Resources staff through Microsoft
              Entra ID group membership.
            </p>
          </div>
        </aside>
      </div>

      <section className="doc-summary card" aria-labelledby="summary-heading">
        <h2 id="summary-heading">About this document</h2>
        <p>{doc.summary}</p>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading">
          <div className="section-title">
            <h2 id="related-heading">Related documents</h2>
          </div>
          <div className="related-list">
            {related.map((item) => (
              <DocumentCard key={item.id} document={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default DocumentDetails;
