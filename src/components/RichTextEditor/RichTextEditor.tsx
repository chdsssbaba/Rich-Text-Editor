import React, { memo, useEffect, useCallback } from 'react';
import { EditorProvider, useEditor } from './contexts/EditorContext';
import { EditorToolbar } from './EditorToolbar';
import { EditorContent } from './EditorContent';
import { PresenceIndicators } from './PresenceIndicators';
import { LoadingState } from './LoadingState';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card } from '@/components/ui/card';

interface RichTextEditorInnerProps {
  onChange?: (content: string) => void;
  showPresence?: boolean;
}

const RichTextEditorInner: React.FC<RichTextEditorInnerProps> = memo(({ 
  onChange,
  showPresence = true,
}) => {
  const { state, dispatch } = useEditor();

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleChange = useCallback((content: string) => {
    onChange?.(content);
  }, [onChange]);

  if (state.isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="overflow-hidden shadow-lg border-border/50">
      <EditorToolbar />
      <EditorContent onChange={handleChange} />
      {showPresence && <PresenceIndicators />}
    </Card>
  );
});

RichTextEditorInner.displayName = 'RichTextEditorInner';

export interface RichTextEditorProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  showPresence?: boolean;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = memo(({
  initialContent,
  onChange,
  showPresence = true,
}) => {
  return (
    <ErrorBoundary>
      <EditorProvider initialContent={initialContent}>
        <RichTextEditorInner 
          onChange={onChange} 
          showPresence={showPresence}
        />
      </EditorProvider>
    </ErrorBoundary>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

export default RichTextEditor;
