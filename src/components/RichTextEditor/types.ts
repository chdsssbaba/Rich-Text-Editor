export type StyleType = 'bold' | 'italic' | 'underline' | 'h1' | 'h2' | 'h3';

export interface EditorState {
  content: string;
  history: string[];
  historyPointer: number;
  isLoading: boolean;
}

export type EditorAction =
  | { type: 'SET_CONTENT'; payload: string }
  | { type: 'APPLY_STYLE'; payload: StyleType }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'PUSH_TO_HISTORY'; payload: string };

export interface EditorContextType {
  state: EditorState;
  dispatch: React.Dispatch<EditorAction>;
  applyStyle: (style: StyleType) => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface User {
  id: string;
  name: string;
  color: string;
  isCurrentUser?: boolean;
}
