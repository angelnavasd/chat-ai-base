import { Code, Search, Zap, Lightbulb } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCreateChat } from '@/api/mutations/useCreateChat';
import { useAuth } from '@/providers/AuthProvider';
import { MessageInput } from './MessageInput';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const suggestions = [
  { icon: Lightbulb, title: 'Ideas para un regalo' },
  { icon: Code, title: 'Escribir un componente en React' },
  { icon: Search, title: 'Explicar la computación cuántica' },
  { icon: Zap, title: 'Mejorar mi productividad' },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const createChat = useCreateChat();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const handleSend = async (content: string) => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const newChat = await createChat.mutateAsync();
      navigate(`/chat/${newChat.id}`, { state: { initialMessage: content } });
    } finally {
      setIsCreating(false);
    }
  };

  // ── DESKTOP VIEW (Original Centered Layout) ──
  if (!isMobile) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-3xl mx-auto px-4">
          
          {/* Heading */}
          <div className="w-full space-y-1.5 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center sm:text-left sm:pl-4">
            <h2 className="text-3xl md:text-4xl font-medium text-muted-foreground/80">
              Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}
            </h2>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              ¿Por dónde empezamos?
            </h1>
          </div>

          {/* Input */}
          <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            <MessageInput onSend={handleSend} disabled={isCreating} />
          </div>

          {/* Suggestions */}
          <div className="flex w-full mt-8 pb-1 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 sm:pl-4 flex-wrap justify-start gap-3">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.title}
                variant="outline"
                className="h-10 rounded-full bg-muted/30 border-border/40 hover:bg-muted/60 hover:border-border text-muted-foreground hover:text-foreground active:scale-95 transition-all duration-200 text-sm px-4 shrink-0"
                onClick={() => handleSend(suggestion.title)}
                disabled={isCreating}
              >
                <suggestion.icon className="h-3.5 w-3.5 mr-1.5" />
                {suggestion.title}
              </Button>
            ))}
          </div>

        </div>
      </div>
    );
  }

  // ── MOBILE VIEW (Gemini Style - Anchor Bottom) ──
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Greeting + suggestions — centered in available space */}
      <div className="flex-1 flex items-center overflow-y-auto">
        <div className="w-full px-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Heading */}
          <div className="max-w-xl mb-8">
            <p className="text-xl font-normal text-muted-foreground/70 mb-1 leading-snug">
              Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}
            </p>
            <h1 className="text-[2rem] font-semibold tracking-tight text-foreground leading-[1.15]">
              ¿Por dónde<br /> empezamos?
            </h1>
          </div>

          {/* Suggestion tags — vertical stack */}
          <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            {suggestions.map((s) => (
              <button
                key={s.title}
                onClick={() => handleSend(s.title)}
                disabled={isCreating}
                className="flex items-center gap-2.5 px-4 h-11 rounded-2xl bg-muted/60 hover:bg-muted active:bg-muted/80 active:scale-[0.98] text-foreground/75 text-[14px] font-medium text-left transition-all disabled:opacity-50 shrink-0"
              >
                <s.icon className="h-[15px] w-[15px] shrink-0 text-muted-foreground/70" />
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input — always anchored at bottom */}
      <MessageInput onSend={handleSend} disabled={isCreating} />
    </div>
  );
}
