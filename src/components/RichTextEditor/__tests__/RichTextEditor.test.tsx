import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RichTextEditor } from '../RichTextEditor';
import { TooltipProvider } from '@/components/ui/tooltip';

// Helper to wrap component with required providers
const renderEditor = (props = {}) => {
  return render(
    <TooltipProvider>
      <RichTextEditor {...props} />
    </TooltipProvider>
  );
};

describe('RichTextEditor Integration', () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render loading state initially', () => {
      renderEditor();
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should render editor after loading', async () => {
      renderEditor();
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      });
    });

    it('should render toolbar with formatting buttons', async () => {
      renderEditor();
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        expect(screen.getByRole('toolbar')).toBeInTheDocument();
        expect(screen.getByLabelText('Bold')).toBeInTheDocument();
        expect(screen.getByLabelText('Italic')).toBeInTheDocument();
        expect(screen.getByLabelText('Underline')).toBeInTheDocument();
        expect(screen.getByLabelText('Heading 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Heading 2')).toBeInTheDocument();
        expect(screen.getByLabelText('Heading 3')).toBeInTheDocument();
      });
    });

    it('should render undo/redo buttons', async () => {
      renderEditor();
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Undo')).toBeInTheDocument();
        expect(screen.getByLabelText('Redo')).toBeInTheDocument();
      });
    });

    it('should render with initial content', async () => {
      renderEditor({ initialContent: '<p>Custom content</p>' });
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        const editor = screen.getByRole('textbox');
        expect(editor.innerHTML).toContain('Custom content');
      });
    });
  });

  describe('Toolbar Button Interactions', () => {
    it('should have undo button disabled initially', async () => {
      renderEditor();
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        const undoButton = screen.getByLabelText('Undo');
        expect(undoButton).toBeDisabled();
      });
    });

    it('should have redo button disabled initially', async () => {
      renderEditor();
      
      vi.advanceTimersByTime(1100);
      
      await waitFor(() => {
        const redoButton = screen.getByLabelText('Redo');
        expect(redoButton).toBeDisabled();
      });
    });

    it('should be able to click bold button', async () => {
      vi.useRealTimers();
      const user = userEvent.setup();
      
      renderEditor();
      
      await waitFor(() => {
        expect(screen.getByLabelText('Bold')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      const boldButton = screen.getByLabelText('Bold');
      await user.click(boldButton);
      
      // Button should be clickable without errors
      expect(boldButton).toBeInTheDocument();
    });
  });

  describe('Presence Indicators', () => {
    it('should show presence indicators by default', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        expect(screen.getByText('Active users:')).toBeInTheDocument();
      }, { timeout: 2000 });
    });

    it('should hide presence indicators when showPresence is false', async () => {
      vi.useRealTimers();
      renderEditor({ showPresence: false });
      
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      expect(screen.queryByText('Active users:')).not.toBeInTheDocument();
    });

    it('should show current user initially', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        expect(screen.getByText('1 user online')).toBeInTheDocument();
      }, { timeout: 2000 });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible toolbar', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        const toolbar = screen.getByRole('toolbar');
        expect(toolbar).toHaveAttribute('aria-label', 'Text formatting toolbar');
      }, { timeout: 2000 });
    });

    it('should have accessible editor area', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        const editor = screen.getByRole('textbox');
        expect(editor).toHaveAttribute('aria-multiline', 'true');
        expect(editor).toHaveAttribute('aria-label', 'Rich text editor content area');
      }, { timeout: 2000 });
    });

    it('should have aria-pressed on toggle buttons', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        const boldButton = screen.getByLabelText('Bold');
        expect(boldButton).toHaveAttribute('aria-pressed');
      }, { timeout: 2000 });
    });

    it('should be keyboard navigable', async () => {
      vi.useRealTimers();
      renderEditor();
      
      await waitFor(() => {
        const editor = screen.getByRole('textbox');
        expect(editor).toHaveAttribute('tabIndex', '0');
      }, { timeout: 2000 });
    });
  });

  describe('onChange Callback', () => {
    it('should call onChange when content changes', async () => {
      vi.useRealTimers();
      const handleChange = vi.fn();
      renderEditor({ onChange: handleChange });
      
      await waitFor(() => {
        expect(screen.getByRole('textbox')).toBeInTheDocument();
      }, { timeout: 2000 });
      
      const editor = screen.getByRole('textbox');
      
      // Simulate input
      fireEvent.input(editor, { 
        target: { innerHTML: '<p>New content</p>' } 
      });
      
      // Wait for throttled callback
      await waitFor(() => {
        expect(handleChange).toHaveBeenCalled();
      }, { timeout: 500 });
    });
  });
});
