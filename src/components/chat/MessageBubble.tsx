import type { Message } from '@/types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { SourceCard } from './SourceCard';
import { User, Bot, Copy, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useCallback } from 'react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const { t } = useTranslation();
  const [actionBarVisible, setActionBarVisible] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Long-press detection for touch devices — shows action bar after 500ms hold
  const handleTouchStart = useCallback(() => {
    longPressTimer.current = setTimeout(() => {
      setActionBarVisible(true);
    }, 500);
  }, []);

  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  return (
    <div className={`group flex flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Avatar Header */}
      <div className={`flex items-center gap-2 px-1 ${isUser ? 'flex-row-reverse' : ''}`}>
        {!isUser ? (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Bot className="h-3.5 w-3.5" />
          </div>
        ) : (
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <User className="h-3.5 w-3.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={`flex flex-col max-w-[92%] md:max-w-[88%] space-y-1.5 ${!isUser ? 'w-full' : ''}`}
        onTouchStart={!isUser ? handleTouchStart : undefined}
        onTouchEnd={!isUser ? cancelLongPress : undefined}
        onTouchMove={!isUser ? cancelLongPress : undefined}
      >
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? 'bg-primary/5 text-foreground border border-border/30 rounded-tr-sm'
              : 'bg-transparent text-foreground w-full'
          }`}
        >
          {isUser ? (
            <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{message.content}</p>
          ) : (
            <MarkdownRenderer content={message.content} />
          )}
        </div>

        {/* Sources */}
        {message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {message.sources.map((source, i) => (
              <SourceCard key={i} source={source} />
            ))}
          </div>
        )}

        {/* Action bar — visible on hover (desktop) OR long-press (touch) OR always on touch after interaction */}
        {!isUser && (
          <div
            className={`flex items-center gap-1 transition-opacity duration-150 ${
              actionBarVisible
                ? 'opacity-100'
                : 'opacity-0 group-hover:opacity-100 touch-visible'
            }`}
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
              onClick={() => {
                navigator.clipboard.writeText(message.content);
                toast(t('chat.copy'));
                setActionBarVisible(false);
              }}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
            <div className="flex items-center ml-1.5 border-l border-border/40 pl-1.5 gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                onClick={() => {
                  toast(t('chat.feedback'));
                  setActionBarVisible(false);
                }}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground active:scale-95 transition-all"
                onClick={() => {
                  toast(t('chat.feedback'));
                  setActionBarVisible(false);
                }}
              >
                <ThumbsDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
