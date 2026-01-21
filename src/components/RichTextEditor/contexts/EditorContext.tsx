import React, { createContext, useContext, ReactNode } from 'react';
import { EditorContextType, EditorState } from '../types';
import { useEditorReducer, initialEditorState } from '../hooks/useEditorReducer';

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
  children: ReactNode;
  initialContent?: string;
  onChange?: (content: string) => void;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({
  children,
  initialContent,
}) => {
  const customInitialState: EditorState = {
    ...initialEditorState,
    content: initialContent || initialEditorState.content,
  };
  
  const { state, dispatch, applyStyle, canUndo, canRedo } = useEditorReducer(customInitialState);
  
  return (
    <EditorContext.Provider
      value={{
        state,
        dispatch,
        applyStyle,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = (): EditorContextType => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
