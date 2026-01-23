import { describe, it, expect } from 'vitest';
import { editorReducer, initialEditorState } from '../hooks/useEditorReducer';
import { EditorState, EditorAction } from '../types';

describe('editorReducer', () => {
  describe('SET_CONTENT', () => {
    it('should set content correctly', () => {
      const newContent = '<p>New content</p>';
      const action: EditorAction = { type: 'SET_CONTENT', payload: newContent };
      const result = editorReducer(initialEditorState, action);
      
      expect(result.content).toBe(newContent);
    });

    it('should not modify other state properties when setting content', () => {
      const stateWithHistory: EditorState = {
        ...initialEditorState,
        history: ['<p>History item</p>'],
        historyPointer: 0,
      };
      const action: EditorAction = { type: 'SET_CONTENT', payload: '<p>New</p>' };
      const result = editorReducer(stateWithHistory, action);
      
      expect(result.history).toEqual(stateWithHistory.history);
      expect(result.historyPointer).toBe(stateWithHistory.historyPointer);
    });
  });

  describe('PUSH_TO_HISTORY', () => {
    it('should add content to history', () => {
      const content = '<p>First entry</p>';
      const action: EditorAction = { type: 'PUSH_TO_HISTORY', payload: content };
      const result = editorReducer(initialEditorState, action);
      
      expect(result.history).toContain(content);
      expect(result.historyPointer).toBe(0);
    });

    it('should increment historyPointer when adding to history', () => {
      const stateWithHistory: EditorState = {
        ...initialEditorState,
        history: ['<p>First</p>'],
        historyPointer: 0,
      };
      const action: EditorAction = { type: 'PUSH_TO_HISTORY', payload: '<p>Second</p>' };
      const result = editorReducer(stateWithHistory, action);
      
      expect(result.history.length).toBe(2);
      expect(result.historyPointer).toBe(1);
    });

    it('should clear redo history when new content is added', () => {
      const stateWithRedo: EditorState = {
        ...initialEditorState,
        history: ['<p>1</p>', '<p>2</p>', '<p>3</p>'],
        historyPointer: 0, // User has undone twice
      };
      const action: EditorAction = { type: 'PUSH_TO_HISTORY', payload: '<p>New</p>' };
      const result = editorReducer(stateWithRedo, action);
      
      expect(result.history.length).toBe(2); // Original + new
      expect(result.history[1]).toBe('<p>New</p>');
    });

    it('should maintain max history size of 10', () => {
      let state = initialEditorState;
      
      // Add 12 items to history
      for (let i = 0; i < 12; i++) {
        const action: EditorAction = { 
          type: 'PUSH_TO_HISTORY', 
          payload: `<p>Item ${i}</p>` 
        };
        state = editorReducer(state, action);
      }
      
      expect(state.history.length).toBeLessThanOrEqual(10);
    });
  });

  describe('UNDO', () => {
    it('should move historyPointer back and restore content', () => {
      const stateWithHistory: EditorState = {
        ...initialEditorState,
        content: '<p>Current</p>',
        history: ['<p>First</p>', '<p>Second</p>', '<p>Current</p>'],
        historyPointer: 2,
      };
      const action: EditorAction = { type: 'UNDO' };
      const result = editorReducer(stateWithHistory, action);
      
      expect(result.historyPointer).toBe(1);
      expect(result.content).toBe('<p>Second</p>');
    });

    it('should not undo past the beginning of history', () => {
      const stateAtStart: EditorState = {
        ...initialEditorState,
        history: ['<p>First</p>'],
        historyPointer: 0,
      };
      const action: EditorAction = { type: 'UNDO' };
      const result = editorReducer(stateAtStart, action);
      
      expect(result.historyPointer).toBe(0);
      expect(result).toEqual(stateAtStart);
    });

    it('should handle empty history gracefully', () => {
      const action: EditorAction = { type: 'UNDO' };
      const result = editorReducer(initialEditorState, action);
      
      expect(result).toEqual(initialEditorState);
    });
  });

  describe('REDO', () => {
    it('should move historyPointer forward and restore content', () => {
      const stateWithRedo: EditorState = {
        ...initialEditorState,
        content: '<p>First</p>',
        history: ['<p>First</p>', '<p>Second</p>', '<p>Third</p>'],
        historyPointer: 0,
      };
      const action: EditorAction = { type: 'REDO' };
      const result = editorReducer(stateWithRedo, action);
      
      expect(result.historyPointer).toBe(1);
      expect(result.content).toBe('<p>Second</p>');
    });

    it('should not redo past the end of history', () => {
      const stateAtEnd: EditorState = {
        ...initialEditorState,
        history: ['<p>First</p>', '<p>Second</p>'],
        historyPointer: 1,
      };
      const action: EditorAction = { type: 'REDO' };
      const result = editorReducer(stateAtEnd, action);
      
      expect(result.historyPointer).toBe(1);
      expect(result).toEqual(stateAtEnd);
    });
  });

  describe('SET_LOADING', () => {
    it('should set loading to true', () => {
      const action: EditorAction = { type: 'SET_LOADING', payload: true };
      const result = editorReducer(initialEditorState, action);
      
      expect(result.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState: EditorState = {
        ...initialEditorState,
        isLoading: true,
      };
      const action: EditorAction = { type: 'SET_LOADING', payload: false };
      const result = editorReducer(loadingState, action);
      
      expect(result.isLoading).toBe(false);
    });
  });

  describe('APPLY_STYLE', () => {
    it('should return the same state (style is applied via execCommand)', () => {
      const action: EditorAction = { type: 'APPLY_STYLE', payload: 'bold' };
      const result = editorReducer(initialEditorState, action);
      
      expect(result).toEqual(initialEditorState);
    });
  });

  describe('unknown action', () => {
    it('should return current state for unknown action type', () => {
      const unknownAction = { type: 'UNKNOWN_ACTION' } as unknown as EditorAction;
      const result = editorReducer(initialEditorState, unknownAction);
      
      expect(result).toEqual(initialEditorState);
    });
  });
});
