import type { Source } from '@/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceCard } from './SourceCard';
import { Bot } from 'lucide-react';

interface StreamingBubbleProps {
  content: string;
  sources: Source[];
}

export function StreamingBubble({ content, sources }: StreamingBubbleProps) {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Bot className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="max-w-[85%] space-y-3">
        <div className="rounded-2xl bg-muted px-4 py-3">
          {content ? (
            <MarkdownRenderer content={content} />
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:150ms]" />
              <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:300ms]" />
            </div>
          )}
          {/* Blinking cursor */}
          {content && (
            <span className="ml-0.5 inline-block h-5 w-0.5 animate-pulse bg-foreground" />
          )}
        </div>

        {/* Sources as they arrive */}
        {sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => (
              <SourceCard key={i} source={source} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
