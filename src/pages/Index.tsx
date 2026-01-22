import { useState, useCallback } from 'react';
import { RichTextEditor } from '@/components/RichTextEditor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Users, 
  Undo2, 
  Redo2, 
  Type, 
  Bold as BoldIcon,
  Italic as ItalicIcon,
  UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  Keyboard,
  Accessibility,
  TestTube2,
  Sparkles
} from 'lucide-react';

const features = [
  { icon: BoldIcon, label: 'Bold', shortcut: 'Ctrl+B' },
  { icon: ItalicIcon, label: 'Italic', shortcut: 'Ctrl+I' },
  { icon: UnderlineIcon, label: 'Underline', shortcut: 'Ctrl+U' },
  { icon: Heading1, label: 'H1' },
  { icon: Heading2, label: 'H2' },
  { icon: Heading3, label: 'H3' },
  { icon: Undo2, label: 'Undo', shortcut: 'Ctrl+Z' },
  { icon: Redo2, label: 'Redo', shortcut: 'Ctrl+Y' },
];

const highlights = [
  { icon: Type, title: 'Rich Formatting', description: 'Bold, italic, underline, and headings' },
  { icon: Undo2, title: 'Undo/Redo', description: 'Full history with 10+ actions' },
  { icon: Users, title: 'User Presence', description: 'Real-time collaboration indicators' },
  { icon: Accessibility, title: 'Accessibility', description: 'WCAG 2.1 AA compliant' },
  { icon: Keyboard, title: 'Keyboard Nav', description: 'Full keyboard support' },
  { icon: TestTube2, title: 'Fully Tested', description: 'Unit & integration tests' },
];

const Index = () => {
  const [content, setContent] = useState<string>('');
  const [charCount, setCharCount] = useState(0);

  const handleChange = useCallback((newContent: string) => {
    setContent(newContent);
    // Count characters (excluding HTML tags)
    const textContent = new DOMParser().parseFromString(newContent, 'text/html').body.textContent || '';
    setCharCount(textContent.length);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/20 py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Production-Ready Component</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 tracking-tight">
              Rich Text Editor
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A feature-rich, accessible rich text editor built with React, useReducer, 
              and Context API. Complete with undo/redo, user presence, and comprehensive testing.
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {features.map((feature) => (
                <Badge 
                  key={feature.label} 
                  variant="secondary"
                  className="px-3 py-1.5 text-sm flex items-center gap-1.5"
                >
                  <feature.icon className="h-3.5 w-3.5" />
                  {feature.label}
                  {feature.shortcut && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({feature.shortcut})
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl translate-y-1/2" />
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Editor Section */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Editor Demo</h2>
              </div>
              <Badge variant="outline" className="text-xs">
                {charCount} characters
              </Badge>
            </div>
            
            <RichTextEditor 
              onChange={handleChange}
              initialContent="<h1>Welcome to the Rich Text Editor</h1><p>Start typing here to experience the full range of formatting options. Try selecting text and using the toolbar buttons, or use keyboard shortcuts like <b>Ctrl+B</b> for bold, <i>Ctrl+I</i> for italic, and <u>Ctrl+U</u> for underline.</p><h2>Features</h2><p>This editor supports multiple heading levels, text formatting, and maintains a complete undo/redo history. The presence indicators below show simulated collaborators joining the document.</p><h3>Try It Out</h3><p>Edit this content to see the editor in action!</p>"
            />

            {content && (
              <div className="mt-4 p-4 border border-border/50 rounded-lg bg-card text-card-foreground">
                <h3 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Raw HTML Output</h3>
                <pre className="p-3 bg-muted rounded font-mono text-xs overflow-auto max-h-40 whitespace-pre-wrap select-all">
                  {content}
                </pre>
              </div>
            )}
          </section>

          <Separator />

          {/* Features Grid */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Key Features
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Built with modern React patterns and accessibility in mind
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((highlight) => (
                <Card key={highlight.title} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <highlight.icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{highlight.description}</CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <Separator />

          {/* Technical Details */}
          <section>
            <Card className="border-primary/20 bg-card/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube2 className="h-5 w-5 text-primary" />
                  Technical Implementation
                </CardTitle>
                <CardDescription>
                  Core technologies and patterns used in this editor
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">State Management</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li>• useReducer for complex state transitions</li>
                      <li>• Context API for prop drilling prevention</li>
                      <li>• Memoization with useCallback & useMemo</li>
                      <li>• Throttled onChange for performance</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Testing Coverage</h4>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      <li>• Unit tests for reducer logic</li>
                      <li>• Integration tests with RTL</li>
                      <li>• Accessibility testing</li>
                      <li>• Error boundary coverage</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Built with React, TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
