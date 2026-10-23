/**
 * Search service for the HR document portal.
 *
 * The portal searches a SINGLE SharePoint document library — the KZN Treasury
 * HR Document Library. This module currently serves MOCK data so the interface
 * can be built and reviewed end-to-end. To connect the real library:
 *
 *   1. Replace searchDocuments() with a fetch to your API, e.g.
 *        const res = await fetch(`${process.env.REACT_APP_API_URL}/search?${params}`)
 *   2. Have the backend query Microsoft Graph against the HR library, e.g.
 *        GET https://graph.microsoft.com/v1.0/sites/{site-id}/drive/root/search(q='{q}')
 *      or use Microsoft Search:
 *        POST https://graph.microsoft.com/v1.0/search/query
 *   3. Forward the user's Entra ID access token in the Authorization header:
 *        { Authorization: `Bearer ${accessToken}` }
 *      (acquired via MSAL — see src/auth/authConfig.js)
 */

/** The one and only library this portal searches. */
export const LIBRARY_NAME = 'HR Document Library';
export const LIBRARY_URL = 'https://kzntreasury.sharepoint.com/sites/hr/Shared%20Documents';

export const FILE_TYPES = ['PDF', 'Word', 'Excel', 'Presentation'];

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'modified-desc', label: 'Newest first' },
  { value: 'modified-asc', label: 'Oldest first' },
  { value: 'name-asc', label: 'Name (A–Z)' },
];

export const MODIFIED_OPTIONS = [
  { value: 'any', label: 'Any time' },
  { value: '1', label: 'Past 24 hours' },
  { value: '7', label: 'Past 7 days' },
  { value: '30', label: 'Past 30 days' },
  { value: '365', label: 'Past 12 months' },
];

/** Mock corpus — realistic KZN Treasury HR documents. */
const DOCUMENTS = [
  {
    id: 'HR-1001',
    name: 'Leave Guide for Public Servants 2026.pdf',
    title: 'Leave Guide for Public Servants 2026',
    type: 'PDF',
    category: 'Leave & Absence',
    folder: 'Policies / Leave',
    author: 'T. Zulu',
    created: '2026-01-12',
    modified: '2026-08-10',
    size: 1_835_008,
    summary:
      'Comprehensive guide to annual leave, sick leave, family responsibility leave and special leave entitlements for public servants, including application procedures and retention rules.',
  },
  {
    id: 'HR-1002',
    name: 'Leave Register 2026-27.xlsx',
    title: 'Leave Register 2026-27',
    type: 'Excel',
    category: 'Leave & Absence',
    folder: 'Registers',
    author: 'T. Zulu',
    created: '2026-04-01',
    modified: '2026-08-16',
    size: 921_600,
    summary:
      'Master leave register template for HR offices, with automatic accrual calculations, carry-over tracking and monthly reconciliation sections.',
  },
  {
    id: 'HR-1003',
    name: 'Recruitment and Selection Guidelines.pdf',
    title: 'Recruitment and Selection Guidelines',
    type: 'PDF',
    category: 'Recruitment',
    folder: 'Policies / Recruitment',
    author: 'S. Naidoo',
    created: '2025-11-03',
    modified: '2026-07-28',
    size: 2_359_296,
    summary:
      'End-to-end recruitment process for vacant posts: advertisement, shortlisting criteria, interview panels, score sheets, reference checks and appointment approvals.',
  },
  {
    id: 'HR-1004',
    name: 'HR Standard Operating Procedures - Recruitment.pptx',
    title: 'HR Standard Operating Procedures — Recruitment',
    type: 'Presentation',
    category: 'Recruitment',
    folder: 'SOPs',
    author: 'S. Naidoo',
    created: '2026-02-20',
    modified: '2026-06-30',
    size: 4_194_304,
    summary:
      'Step-by-step standard operating procedures covering requisition approval, PIT planning, candidate communication and record-keeping requirements.',
  },
  {
    id: 'HR-1005',
    name: 'Public Service Salary Scales 2026-27.xlsx',
    title: 'Public Service Salary Scales 2026-27',
    type: 'Excel',
    category: 'Remuneration',
    folder: 'Remuneration / Scales',
    author: 'M. Dlamini',
    created: '2026-03-18',
    modified: '2026-08-14',
    size: 1_310_720,
    summary:
      'Current salary scales for all levels (levels 1–16) including notch progression, OSD adjustments and approved deviations for critical posts.',
  },
  {
    id: 'HR-1006',
    name: 'Conditions of Service Handbook.pdf',
    title: 'Conditions of Service Handbook',
    type: 'PDF',
    category: 'Remuneration',
    folder: 'Policies / Conditions of Service',
    author: 'M. Dlamini',
    created: '2025-09-15',
    modified: '2026-07-05',
    size: 3_670_016,
    summary:
      'Handbook summarising conditions of service: salary payments, overtime, allowances, medical aid, housing, travel and retirement benefits.',
  },
  {
    id: 'HR-1007',
    name: 'PSCBC Resolution 1 of 2026.pdf',
    title: 'PSCBC Resolution 1 of 2026 — Salary Adjustments',
    type: 'PDF',
    category: 'Remuneration',
    folder: 'Remuneration / Resolutions',
    author: 'M. Dlamini',
    created: '2026-01-30',
    modified: '2026-05-22',
    size: 655_360,
    summary:
      'Full text of the collective agreement regulating the 2026 salary adjustment, effective dates and implementation guidance for departmental HR.',
  },
  {
    id: 'HR-1008',
    name: 'Performance Management System Guide.pdf',
    title: 'Performance Management System Guide',
    type: 'PDF',
    category: 'Performance',
    folder: 'Policies / Performance',
    author: 'K. Mthembu',
    created: '2025-10-08',
    modified: '2026-08-05',
    size: 2_883_584,
    summary:
      'Guide to the public service performance management system: setting SMART annual goals, quarterly reviews, rating scales and eight-quarter cycle rules.',
  },
  {
    id: 'HR-1009',
    name: 'Performance Agreement Template 2026-27.docx',
    title: 'Performance Agreement Template 2026-27',
    type: 'Word',
    category: 'Performance',
    folder: 'Templates',
    author: 'K. Mthembu',
    created: '2026-03-25',
    modified: '2026-08-01',
    size: 393_216,
    summary:
      'Approved performance agreement template for senior management and supervisory posts, with sign-off blocks and mid-year review section.',
  },
  {
    id: 'HR-1010',
    name: 'Training Calendar 2026-27.xlsx',
    title: 'Training Calendar 2026-27',
    type: 'Excel',
    category: 'Learning & Development',
    folder: 'Training',
    author: 'P. Govender',
    created: '2026-02-06',
    modified: '2026-08-12',
    size: 786_432,
    summary:
      'Provincial HR training calendar listing workshops, venues, facilitators and nomination deadlines for the financial year.',
  },
  {
    id: 'HR-1011',
    name: 'Skills Development Log Template.xlsx',
    title: 'Skills Development Log Template',
    type: 'Excel',
    category: 'Learning & Development',
    folder: 'Templates',
    author: 'P. Govender',
    created: '2025-12-11',
    modified: '2026-06-18',
    size: 524_288,
    summary:
      'Template for recording employee training interventions, costs and outcomes to support the workplace skills plan and annual training report.',
  },
  {
    id: 'HR-1012',
    name: 'Employee Wellness Programme Brochure.pdf',
    title: 'Employee Wellness Programme Brochure',
    type: 'PDF',
    category: 'Wellness',
    folder: 'Wellness',
    author: 'N. Khumalo',
    created: '2026-04-14',
    modified: '2026-07-19',
    size: 1_572_864,
    summary:
      'Overview of the Employee Wellness Programme: counselling services, HIV/AIDS support, trauma debriefing and how to contact the wellness helpdesk.',
  },
  {
    id: 'HR-1013',
    name: 'Disciplinary Procedures and Sanctions.docx',
    title: 'Disciplinary Procedures and Sanctions',
    type: 'Word',
    category: 'Policies & Procedures',
    folder: 'Policies / Discipline',
    author: 'R. Singh',
    created: '2025-08-27',
    modified: '2026-08-08',
    size: 460_800,
    summary:
      'Code of conduct procedures: chairing disciplinary hearings, evidentiary standards, the sanctions schedule and appeal processes.',
  },
  {
    id: 'HR-1014',
    name: 'Grievance Procedure.docx',
    title: 'Grievance Procedure',
    type: 'Word',
    category: 'Policies & Procedures',
    folder: 'Policies / Grievances',
    author: 'R. Singh',
    created: '2025-08-27',
    modified: '2026-05-30',
    size: 327_680,
    summary:
      'Step-by-step grievance resolution process for employees, from informal discussion through to formal submission and arbitration.',
  },
  {
    id: 'HR-1015',
    name: 'Employment Equity Plan 2025-2030.pdf',
    title: 'Employment Equity Plan 2025-2030',
    type: 'PDF',
    category: 'Policies & Procedures',
    folder: 'Policies / Employment Equity',
    author: 'Z. Mbatha',
    created: '2025-05-19',
    modified: '2026-06-24',
    size: 2_097_152,
    summary:
      'Five-year employment equity plan with designated group targets, consultation structures, numerical goals and the annual EE reporting schedule.',
  },
  {
    id: 'HR-1016',
    name: 'HR Departmental Organogram 2026-27.pptx',
    title: 'HR Departmental Organogram 2026-27',
    type: 'Presentation',
    category: 'Policies & Procedures',
    folder: 'Administration',
    author: 'Z. Mbatha',
    created: '2026-04-08',
    modified: '2026-08-11',
    size: 1_153_434,
    summary:
      'Approved HR sub-programme structure showing units, vacant posts, reporting lines and the customer-service desk allocation per cluster.',
  },
].map((doc) => ({
  ...doc,
  library: LIBRARY_NAME,
  url: `${LIBRARY_URL}/${encodeURIComponent(doc.folder)}/${encodeURIComponent(doc.name)}`,
}));

const DAY_MS = 24 * 60 * 60 * 1000;

function matchesQuery(doc, query) {
  if (!query) return true;
  const haystack =
    `${doc.title} ${doc.name} ${doc.summary} ${doc.category} ${doc.folder} ${doc.author}`.toLowerCase();
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((term) => haystack.includes(term));
}

function withinModifiedWindow(doc, days) {
  if (!days || days === 'any') return true;
  const threshold = Date.now() - Number(days) * DAY_MS;
  return new Date(doc.modified).getTime() >= threshold;
}

function scoreDocument(doc, query) {
  if (!query) return 0;
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let score = 0;
  for (const term of terms) {
    if (doc.title.toLowerCase().includes(term)) score += 10;
    if (doc.name.toLowerCase().includes(term)) score += 6;
    if (doc.category.toLowerCase().includes(term)) score += 4;
    if (doc.summary.toLowerCase().includes(term)) score += 2;
    if (doc.author.toLowerCase().includes(term)) score += 1;
  }
  return score;
}

/** Simulated network latency so loading states can be exercised. */
function delay(result, ms = 260) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

/**
 * Search the HR document library.
 *
 * @param {object} options
 * @param {string} [options.query] Free-text query.
 * @param {string[]} [options.types] File types to include (e.g. ['PDF']).
 * @param {string} [options.modified] Modified window: 'any' | '1' | '7' | '30' | '365'.
 * @param {string} [options.sort] 'relevance' | 'modified-desc' | 'modified-asc' | 'name-asc'.
 * @param {number} [options.page] 1-based page number.
 * @param {number} [options.pageSize] Results per page.
 * @returns {Promise<{items, total, page, pageSize, pageCount}>}
 */
export function searchDocuments({
  query = '',
  types = [],
  modified = 'any',
  sort = 'relevance',
  page = 1,
  pageSize = 6,
} = {}) {
  let results = DOCUMENTS.filter(
    (doc) =>
      matchesQuery(doc, query) &&
      withinModifiedWindow(doc, modified) &&
      (types.length === 0 || types.includes(doc.type))
  );

  switch (sort) {
    case 'modified-desc':
      results = results.sort((a, b) => b.modified.localeCompare(a.modified));
      break;
    case 'modified-asc':
      results = results.sort((a, b) => a.modified.localeCompare(b.modified));
      break;
    case 'name-asc':
      results = results.sort((a, b) => a.title.localeCompare(b.title));
      break;
    default:
      results = results
        .map((doc) => ({ doc, score: scoreDocument(doc, query) }))
        .sort((a, b) => b.score - a.score || b.doc.modified.localeCompare(a.doc.modified))
        .map(({ doc }) => doc);
  }

  const total = results.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const items = results.slice((safePage - 1) * pageSize, safePage * pageSize);

  return delay({ items, total, page: safePage, pageSize, pageCount });
}

/** Fetch a single document by id (or null). */
export function getDocument(id) {
  return delay(DOCUMENTS.find((doc) => doc.id === id) ?? null, 120);
}

/** Documents in the same category, excluding one id — used for "related". */
export function getRelatedDocuments(category, excludeId, limit = 3) {
  return DOCUMENTS.filter((doc) => doc.category === category && doc.id !== excludeId).slice(0, limit);
}

/** Recently modified documents in the library. */
export function getRecentDocuments(limit = 5) {
  return [...DOCUMENTS].sort((a, b) => b.modified.localeCompare(a.modified)).slice(0, limit);
}

/* ---------------------------------------------------------------------------
 * Display helpers
 * ------------------------------------------------------------------------ */

/** Format a date for display, e.g. "12 Aug 2026" (en-ZA). */
export function formatDate(isoDate) {
  const date = new Date(`${isoDate}T00:00:00`);
  return new Intl.DateTimeFormat('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

/** Format a file size for display, e.g. "2.3 MB". */
export function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
