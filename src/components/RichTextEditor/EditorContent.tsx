import React, { useRef, useCallback, useEffect, memo } from 'react';
import { useEditor } from './contexts/EditorContext';
import { debounce, throttle } from './utils/editorUtils';

interface EditorContentProps {
  onChange?: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = memo(({ onChange }) => {
  const { state, dispatch } = useEditor();
  const editorRef = useRef<HTMLDivElement>(null);
  const lastContentRef = useRef<string>(state.content);

  // Keep latest onChange callback reference stable to avoid recreating throttled handlers
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // Throttled onChange callback to prevent excessive re-renders
  const throttledOnChange = useRef(
    throttle((content: string) => {
      onChangeRef.current?.(content);
    }, 300)
  ).current;

  // Debounced history push
  const debouncedPushToHistory = useRef(
    debounce((content: string) => {
      if (content !== lastContentRef.current) {
        dispatch({ type: 'PUSH_TO_HISTORY', payload: content });
        lastContentRef.current = content;
      }
    }, 500)
  ).current;

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      dispatch({ type: 'SET_CONTENT', payload: content });
      throttledOnChange(content);
      debouncedPushToHistory(content);
    }
  }, [dispatch, throttledOnChange, debouncedPushToHistory]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'z':
          if (e.shiftKey) {
            e.preventDefault();
            dispatch({ type: 'REDO' });
          } else {
            e.preventDefault();
            dispatch({ type: 'UNDO' });
          }
          break;
        case 'y':
          e.preventDefault();
          dispatch({ type: 'REDO' });
          break;
      }
    }
  }, [dispatch]);

  // Sync content when undo/redo changes state
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== state.content) {
      editorRef.current.innerHTML = state.content;
    }
  }, [state.content]);

  // Initialize history with initial content
  const initialContentRef = useRef(state.content);
  useEffect(() => {
    if (state.history.length === 0) {
      dispatch({ type: 'PUSH_TO_HISTORY', payload: initialContentRef.current });
    }
  }, [dispatch, state.history.length]);

  return (
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      aria-multiline="true"
      aria-label="Rich text editor content area"
      tabIndex={0}
      className="min-h-[300px] md:min-h-[400px] p-4 md:p-6 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-b-lg bg-card text-card-foreground prose prose-sm md:prose-base max-w-none
        [&_h1]:text-2xl md:[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h1]:text-foreground
        [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-3 [&_h2]:text-foreground
        [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-medium [&_h3]:mb-2 [&_h3]:text-foreground
        [&_p]:mb-2 [&_p]:leading-relaxed
        [&_b]:font-bold [&_strong]:font-bold
        [&_i]:italic [&_em]:italic
        [&_u]:underline
        selection:bg-primary/20"
      onInput={handleInput}
      onKeyDown={handleKeyDown}
    />
  );
});

EditorContent.displayName = 'EditorContent';
