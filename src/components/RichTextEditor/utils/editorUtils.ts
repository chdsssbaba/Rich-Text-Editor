import { StyleType } from '../types';

export const MAX_HISTORY_SIZE = 10;

export const sanitizeHtml = (html: string): string => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const allowedTags = ['p', 'br', 'b', 'strong', 'i', 'em', 'u', 'h1', 'h2', 'h3', 'span', 'div'];
  
  const clean = (node: Node): void => {
    const children = Array.from(node.childNodes);
    children.forEach(child => {
      if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        if (!allowedTags.includes(element.tagName.toLowerCase())) {
          const textNode = document.createTextNode(element.textContent || '');
          node.replaceChild(textNode, child);
        } else {
          clean(child);
        }
      }
    });
  };

  clean(doc.body);
  return doc.body.innerHTML;
};

export const getStyleCommand = (style: StyleType): string => {
  switch (style) {
    case 'bold':
      return 'bold';
    case 'italic':
      return 'italic';
    case 'underline':
      return 'underline';
    case 'h1':
      return 'formatBlock';
    case 'h2':
      return 'formatBlock';
    case 'h3':
      return 'formatBlock';
    default:
      return '';
  }
};

export const getStyleValue = (style: StyleType): string | undefined => {
  switch (style) {
    case 'h1':
      return 'h1';
    case 'h2':
      return 'h2';
    case 'h3':
      return 'h3';
    default:
      return undefined;
  }
};

export const isStyleActive = (style: StyleType): boolean => {
  if (typeof document === 'undefined') return false;
  
  switch (style) {
    case 'bold':
      return document.queryCommandState('bold');
    case 'italic':
      return document.queryCommandState('italic');
    case 'underline':
      return document.queryCommandState('underline');
    case 'h1':
    case 'h2':
    case 'h3': {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;
      const range = selection.getRangeAt(0);
      let node = range.startContainer as Node | null;
      while (node) {
        if (node.nodeName.toLowerCase() === style) return true;
        node = node.parentNode;
      }
      return false;
    }
    default:
      return false;
  }
};

export const debounce = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  delay: number
): ((...args: Args) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  return (...args: Args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

export const throttle = <Args extends unknown[], Return>(
  fn: (...args: Args) => Return,
  limit: number
): ((...args: Args) => void) => {
  let inThrottle = false;
  return (...args: Args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
