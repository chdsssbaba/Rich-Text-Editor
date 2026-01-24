import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App Component', () => {
  it('should render App without crashing', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /^Rich Text Editor$/i })).toBeInTheDocument();
  });
});
