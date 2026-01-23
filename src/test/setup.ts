import "@testing-library/jest-dom";
import { vi } from 'vitest';

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock document.execCommand for tests
document.execCommand = vi.fn().mockReturnValue(true);

// Mock document.queryCommandState for tests
document.queryCommandState = vi.fn().mockReturnValue(false);

// Mock window.getSelection
const mockSelection = {
  rangeCount: 0,
  getRangeAt: vi.fn().mockReturnValue({
    startContainer: document.body,
    endContainer: document.body,
  }),
  removeAllRanges: vi.fn(),
  addRange: vi.fn(),
};

window.getSelection = vi.fn().mockReturnValue(mockSelection);

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
