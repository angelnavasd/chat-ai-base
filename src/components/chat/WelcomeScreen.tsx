import { Code, Search, Zap, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useCreateChat } from '@/api/mutations/useCreateChat';
import { useAuth } from '@/providers/AuthProvider';
import { MessageInput } from './MessageInput';
import { useState } from 'react';

const suggestions = [
  { icon: Lightbulb, title: 'Ideas para un regalo' },
  { icon: Code, title: 'Escribir un componente en React' },
  { icon: Search, title: 'Explicar la computación cuántica' },
  { icon: Zap, title: 'Mejorar mi productividad hoy' },
];

export function WelcomeScreen() {
  const navigate = useNavigate();
  const createChat = useCreateChat();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

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

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center px-4 w-full max-w-3xl mx-auto pb-20">
        
        {/* Heading */}
        <div className="w-full space-y-2 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center sm:text-left sm:pl-4">
          <h2 className="text-3xl sm:text-4xl font-medium text-muted-foreground/80">
            Hola, {user?.displayName?.split(' ')[0] || 'Usuario'}
          </h2>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            ¿Por dónde empezamos?
          </h1>
        </div>

        {/* Input */}
        <div className="w-full animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          <MessageInput onSend={handleSend} disabled={isCreating} />
        </div>

        {/* Suggestions */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-8 w-full animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 sm:pl-4">
          {suggestions.map((suggestion) => (
            <Button
              key={suggestion.title}
              variant="outline"
              className="h-10 rounded-full bg-muted/30 border-border/40 hover:bg-muted/60 hover:border-border text-muted-foreground hover:text-foreground transition-all duration-300 text-sm px-4"
              onClick={() => handleSend(suggestion.title)}
              disabled={isCreating}
            >
              <suggestion.icon className="h-4 w-4 mr-2" />
              {suggestion.title}
            </Button>
          ))}
        </div>

      </div>
    </div>
  );
}
