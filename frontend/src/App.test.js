import { render, screen } from '@testing-library/react';
import App from './App';

test('εστ', () => {
  render(<App />);
  const linkElement = screen.getByText(/εστ/i);
  expect(linkElement).toBeInTheDocument();
});
