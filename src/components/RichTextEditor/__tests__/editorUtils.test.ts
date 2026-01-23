import { describe, it, expect } from 'vitest';
import { 
  sanitizeHtml, 
  getStyleCommand, 
  getStyleValue, 
  debounce, 
  throttle,
  MAX_HISTORY_SIZE 
} from '../utils/editorUtils';

describe('editorUtils', () => {
  describe('MAX_HISTORY_SIZE', () => {
    it('should be 10', () => {
      expect(MAX_HISTORY_SIZE).toBe(10);
    });
  });

  describe('sanitizeHtml', () => {
    it('should allow paragraph tags', () => {
      const html = '<p>Hello world</p>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<p>');
    });

    it('should allow bold and italic tags', () => {
      const html = '<p><b>Bold</b> and <i>italic</i></p>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<b>');
      expect(result).toContain('<i>');
    });

    it('should allow heading tags', () => {
      const html = '<h1>Title</h1><h2>Subtitle</h2><h3>Section</h3>';
      const result = sanitizeHtml(html);
      expect(result).toContain('<h1>');
      expect(result).toContain('<h2>');
      expect(result).toContain('<h3>');
    });

    it('should strip script tags', () => {
      const html = '<p>Safe</p><script>alert("XSS")</script>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Safe');
    });

    it('should strip style tags', () => {
      const html = '<style>body { color: red; }</style><p>Content</p>';
      const result = sanitizeHtml(html);
      expect(result).not.toContain('<style>');
    });
  });

  describe('getStyleCommand', () => {
    it('should return bold for bold style', () => {
      expect(getStyleCommand('bold')).toBe('bold');
    });

    it('should return italic for italic style', () => {
      expect(getStyleCommand('italic')).toBe('italic');
    });

    it('should return underline for underline style', () => {
      expect(getStyleCommand('underline')).toBe('underline');
    });

    it('should return formatBlock for heading styles', () => {
      expect(getStyleCommand('h1')).toBe('formatBlock');
      expect(getStyleCommand('h2')).toBe('formatBlock');
      expect(getStyleCommand('h3')).toBe('formatBlock');
    });
  });

  describe('getStyleValue', () => {
    it('should return undefined for inline styles', () => {
      expect(getStyleValue('bold')).toBeUndefined();
      expect(getStyleValue('italic')).toBeUndefined();
      expect(getStyleValue('underline')).toBeUndefined();
    });

    it('should return heading tag name for heading styles', () => {
      expect(getStyleValue('h1')).toBe('h1');
      expect(getStyleValue('h2')).toBe('h2');
      expect(getStyleValue('h3')).toBe('h3');
    });
  });

  describe('debounce', () => {
    it('should delay function execution', async () => {
      let counter = 0;
      const increment = () => counter++;
      const debouncedIncrement = debounce(increment, 50);

      debouncedIncrement();
      debouncedIncrement();
      debouncedIncrement();

      expect(counter).toBe(0);

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(counter).toBe(1);
    });

    it('should only execute once after multiple rapid calls', async () => {
      let counter = 0;
      const increment = () => counter++;
      const debouncedIncrement = debounce(increment, 50);

      for (let i = 0; i < 10; i++) {
        debouncedIncrement();
      }

      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(counter).toBe(1);
    });
  });

  describe('throttle', () => {
    it('should execute immediately on first call', () => {
      let counter = 0;
      const increment = () => counter++;
      const throttledIncrement = throttle(increment, 100);

      throttledIncrement();
      
      expect(counter).toBe(1);
    });

    it('should limit execution frequency', async () => {
      let counter = 0;
      const increment = () => counter++;
      const throttledIncrement = throttle(increment, 50);

      throttledIncrement();
      throttledIncrement();
      throttledIncrement();

      expect(counter).toBe(1);

      await new Promise(resolve => setTimeout(resolve, 60));
      
      throttledIncrement();
      expect(counter).toBe(2);
    });
  });
});
