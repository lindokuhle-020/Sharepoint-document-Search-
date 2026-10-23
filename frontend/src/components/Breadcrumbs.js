import { Link } from 'react-router-dom';
import '../styles/Breadcrumbs.css';

/**
 * Government-style breadcrumb trail.
 *
 * @param {object} props
 * @param {{ label: string, to?: string }[]} props.items
 *   Trail items; the last item is rendered as the current page.
 */
function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`}>
              {item.to && !isLast ? (
                <Link to={item.to}>{item.label}</Link>
              ) : (
                <span aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && (
                <span className="breadcrumbs__separator" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
