import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the portal shell and routes to the search sign-in gate', () => {
  render(<App />);

  // Brand in the header
  expect(screen.getByText('HR Document Search')).toBeInTheDocument();

  // The search page is the landing page — it asks unauthenticated users to sign in
  expect(
    screen.getByRole('heading', { name: /sign in to search documents/i })
  ).toBeInTheDocument();
});
