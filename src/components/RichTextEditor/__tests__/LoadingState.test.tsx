import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('should render loading status', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should have accessible loading label', () => {
    render(<LoadingState />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading editor');
  });

  it('should have screen reader text', () => {
    render(<LoadingState />);
    expect(screen.getByText('Loading editor...')).toBeInTheDocument();
  });

  it('should render skeleton elements', () => {
    render(<LoadingState />);
    const container = screen.getByRole('status');
    expect(container.querySelectorAll('[class*="animate-pulse"]').length).toBeGreaterThan(0);
  });
});
