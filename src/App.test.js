import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page when not authenticated', () => {
  localStorage.removeItem('auth');
  render(<App />);
  expect(screen.getByText(/Blockchain Product Tracker/i)).toBeInTheDocument();
});
