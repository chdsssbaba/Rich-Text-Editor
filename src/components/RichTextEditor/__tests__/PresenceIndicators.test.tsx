import { describe, it, expect, vi } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { PresenceIndicators } from '../PresenceIndicators';
import { TooltipProvider } from '@/components/ui/tooltip';

describe('PresenceIndicators', () => {
  const renderWithProvider = () => {
    return render(
      <TooltipProvider>
        <PresenceIndicators />
      </TooltipProvider>
    );
  };

  it('should render active users label', () => {
    renderWithProvider();
    expect(screen.getByText('Active users:')).toBeInTheDocument();
  });

  it('should show current user initially', () => {
    renderWithProvider();
    expect(screen.getByText('1 user online')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    renderWithProvider();
    const container = screen.getByRole('group');
    expect(container).toHaveAttribute('aria-label', 'Active users');
  });

  it('should show initials for current user', () => {
    renderWithProvider();
    expect(screen.getByText('CU')).toBeInTheDocument(); // Current User
  });

  it('should simulate more users joining over time', () => {
    vi.useFakeTimers();
    renderWithProvider();
    
    expect(screen.getByText('1 user online')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('2 users online')).toBeInTheDocument();
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText('3 users online')).toBeInTheDocument();
    
    vi.useRealTimers();
  });
});
