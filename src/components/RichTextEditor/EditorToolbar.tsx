import React, { memo, useCallback, useState, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Heading1, 
  Heading2, 
  Heading3, 
  Undo, 
  Redo 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useEditor } from './contexts/EditorContext';
import { StyleType } from './types';
import { isStyleActive } from './utils/editorUtils';

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = memo(({
  icon,
  label,
  onClick,
  isActive = false,
  disabled = false,
  shortcut,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <Button
        variant={isActive ? 'default' : 'ghost'}
        size="icon"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        aria-pressed={isActive}
        className="h-9 w-9 transition-all duration-200"
      >
        {icon}
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>{label}{shortcut && <span className="ml-2 text-muted-foreground">({shortcut})</span>}</p>
    </TooltipContent>
  </Tooltip>
));

ToolbarButton.displayName = 'ToolbarButton';

export const EditorToolbar: React.FC = memo(() => {
  const { applyStyle, dispatch, canUndo, canRedo } = useEditor();
  const [activeStyles, setActiveStyles] = useState<Record<StyleType, boolean>>({
    bold: false,
    italic: false,
    underline: false,
    h1: false,
    h2: false,
    h3: false,
  });

  const updateActiveStyles = useCallback(() => {
    setActiveStyles({
      bold: isStyleActive('bold'),
      italic: isStyleActive('italic'),
      underline: isStyleActive('underline'),
      h1: isStyleActive('h1'),
      h2: isStyleActive('h2'),
      h3: isStyleActive('h3'),
    });
  }, []);

  useEffect(() => {
    document.addEventListener('selectionchange', updateActiveStyles);
    return () => {
      document.removeEventListener('selectionchange', updateActiveStyles);
    };
  }, [updateActiveStyles]);

  const handleStyleClick = useCallback((style: StyleType) => {
    applyStyle(style);
    updateActiveStyles();
  }, [applyStyle, updateActiveStyles]);

  const handleUndo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, [dispatch]);

  const handleRedo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, [dispatch]);

  return (
    <div 
      className="flex flex-wrap items-center gap-1 p-2 border-b border-border bg-card rounded-t-lg"
      role="toolbar"
      aria-label="Text formatting toolbar"
    >
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Bold className="h-4 w-4" />}
          label="Bold"
          shortcut="Ctrl+B"
          onClick={() => handleStyleClick('bold')}
          isActive={activeStyles.bold}
        />
        <ToolbarButton
          icon={<Italic className="h-4 w-4" />}
          label="Italic"
          shortcut="Ctrl+I"
          onClick={() => handleStyleClick('italic')}
          isActive={activeStyles.italic}
        />
        <ToolbarButton
          icon={<Underline className="h-4 w-4" />}
          label="Underline"
          shortcut="Ctrl+U"
          onClick={() => handleStyleClick('underline')}
          isActive={activeStyles.underline}
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Heading1 className="h-4 w-4" />}
          label="Heading 1"
          onClick={() => handleStyleClick('h1')}
          isActive={activeStyles.h1}
        />
        <ToolbarButton
          icon={<Heading2 className="h-4 w-4" />}
          label="Heading 2"
          onClick={() => handleStyleClick('h2')}
          isActive={activeStyles.h2}
        />
        <ToolbarButton
          icon={<Heading3 className="h-4 w-4" />}
          label="Heading 3"
          onClick={() => handleStyleClick('h3')}
          isActive={activeStyles.h3}
        />
      </div>

      <Separator orientation="vertical" className="h-6 mx-1" />

      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Undo className="h-4 w-4" />}
          label="Undo"
          shortcut="Ctrl+Z"
          onClick={handleUndo}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={<Redo className="h-4 w-4" />}
          label="Redo"
          shortcut="Ctrl+Y"
          onClick={handleRedo}
          disabled={!canRedo}
        />
      </div>
    </div>
  );
});

EditorToolbar.displayName = 'EditorToolbar';
