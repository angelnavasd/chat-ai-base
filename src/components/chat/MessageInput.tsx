import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Mic, Lightbulb, ArrowUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MessageInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useTranslation();

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 200) + 'px';
  };

  return (
    <div className="bg-transparent p-4 pb-6 relative">
      <div className="mx-auto max-w-3xl relative flex flex-col rounded-[1.5rem] border border-border/40 bg-muted/40 backdrop-blur-xl shadow-lg focus-within:ring-4 focus-within:ring-primary/5 focus-within:border-primary/40 transition-all focus-within:bg-background/80">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={t('chat.placeholder')}
          disabled={disabled}
          rows={1}
          className="w-full min-h-[56px] max-h-[200px] overflow-y-auto overflow-x-hidden resize-none bg-transparent pl-5 pr-5 py-4 text-base transition-all placeholder:text-muted-foreground/60 focus:outline-none disabled:opacity-50"
          style={{ scrollbarWidth: 'none' }}
        />
        <div className="flex items-center justify-between px-2 pb-2 pt-1">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <Lightbulb className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSend}
              disabled={disabled || !value.trim()}
              size="icon"
              className={`h-9 w-9 shrink-0 rounded-full transition-all duration-200 shadow-none ${value.trim() ? 'bg-primary text-primary-foreground hover:opacity-90' : 'bg-muted text-muted-foreground'}`}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
        {t('chat.warning')}
      </p>
    </div>
  );
}
