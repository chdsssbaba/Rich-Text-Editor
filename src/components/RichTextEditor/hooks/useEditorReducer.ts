import { useReducer, useCallback, useMemo } from 'react';
import { EditorState, EditorAction, StyleType } from '../types';
import { MAX_HISTORY_SIZE, getStyleCommand, getStyleValue } from '../utils/editorUtils';

export const initialEditorState: EditorState = {
  content: '<p>Start typing your content here...</p>',
  history: [],
  historyPointer: -1,
  isLoading: true,
};

export const editorReducer = (state: EditorState, action: EditorAction): EditorState => {
  switch (action.type) {
    case 'SET_CONTENT': {
      return {
        ...state,
        content: action.payload,
      };
    }
    
    case 'PUSH_TO_HISTORY': {
      // Clear any redo history when new content is added
      const newHistory = state.history.slice(0, state.historyPointer + 1);
      newHistory.push(action.payload);
      
      // Maintain max history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift();
      }
      
      return {
        ...state,
        history: newHistory,
        historyPointer: Math.min(newHistory.length - 1, MAX_HISTORY_SIZE - 1),
      };
    }
    
    case 'UNDO': {
      if (state.historyPointer <= 0) return state;
      
      const newPointer = state.historyPointer - 1;
      return {
        ...state,
        content: state.history[newPointer],
        historyPointer: newPointer,
      };
    }
    
    case 'REDO': {
      if (state.historyPointer >= state.history.length - 1) return state;
      
      const newPointer = state.historyPointer + 1;
      return {
        ...state,
        content: state.history[newPointer],
        historyPointer: newPointer,
      };
    }
    
    case 'SET_LOADING': {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    
    case 'APPLY_STYLE': {
      // Style application is handled in the hook
      return state;
    }
    
    default:
      return state;
  }
};

export const useEditorReducer = (initialState: EditorState = initialEditorState) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  
  const applyStyle = useCallback((style: StyleType) => {
    const command = getStyleCommand(style);
    const value = getStyleValue(style);
    
    if (command) {
      document.execCommand(command, false, value);
    }
    
    dispatch({ type: 'APPLY_STYLE', payload: style });
  }, []);
  
  const canUndo = useMemo(() => state.historyPointer > 0, [state.historyPointer]);
  const canRedo = useMemo(
    () => state.historyPointer < state.history.length - 1,
    [state.historyPointer, state.history.length]
  );
  
  return {
    state,
    dispatch,
    applyStyle,
    canUndo,
    canRedo,
  };
};
