import { useState } from 'react';
import { Bot, ChevronDown, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState('GPT-4o');

  const models = [
    { id: 'GPT-4o', name: 'GPT-4o', icon: Sparkles, desc: 'Ideal para tareas complejas' },
    { id: 'Claude-3.5', name: 'Claude 3.5 Sonnet', icon: Bot, desc: 'Excelente para codificación y análisis' },
    { id: 'Gemini-1.5', name: 'Gemini 1.5 Pro', icon: Sparkles, desc: 'Contexto ultra largo' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-9 gap-2 text-md font-semibold text-muted-foreground hover:text-foreground">
          {selectedModel}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[240px]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className="flex flex-col items-start p-3 cursor-pointer"
            onClick={() => setSelectedModel(model.name)}
          >
            <div className="flex items-center gap-2 font-medium">
              <model.icon className="h-4 w-4 text-primary" />
              {model.name}
            </div>
            <p className="text-xs text-muted-foreground pl-6 mt-1">
              {model.desc}
            </p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
