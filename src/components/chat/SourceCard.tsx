import type { Source } from '@/types';
import { ExternalLink } from 'lucide-react';

interface SourceCardProps {
  source: Source;
}

export function SourceCard({ source }: SourceCardProps) {
  const domain = (() => {
    try {
      return new URL(source.url).hostname.replace('www.', '');
    } catch {
      return source.url;
    }
  })();

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-accent"
    >
      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="truncate font-medium text-card-foreground group-hover:text-accent-foreground">
          {source.title}
        </p>
        <p className="truncate text-xs text-muted-foreground">{domain}</p>
      </div>
    </a>
  );
}
