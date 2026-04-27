import { useState } from 'react';
import { Bot, ChevronDown, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const models = [
  { id: 'GPT-4o', name: 'GPT-4o', shortName: 'GPT-4o', icon: Sparkles, desc: 'Ideal para tareas complejas' },
  { id: 'Claude-3.5', name: 'Claude 3.5 Sonnet', shortName: 'Claude', icon: Bot, desc: 'Excelente para codificación y análisis' },
  { id: 'Gemini-1.5', name: 'Gemini 1.5 Pro', shortName: 'Gemini', icon: Sparkles, desc: 'Contexto ultra largo' },
];

export function ModelSelector() {
  const [selectedModel, setSelectedModel] = useState(models[0]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-9 gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground px-2.5"
        >
          <span className="truncate max-w-[120px] sm:max-w-none">
            <span className="sm:hidden">{selectedModel.shortName}</span>
            <span className="hidden sm:inline">{selectedModel.name}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[240px] z-[100]">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            className="flex flex-col items-start p-3 cursor-pointer"
            onClick={() => setSelectedModel(model)}
          >
            <div className="flex items-center gap-2 font-medium">
              <model.icon className="h-4 w-4 text-primary" />
              {model.name}
            </div>
            <p className="text-xs text-muted-foreground pl-6 mt-1">{model.desc}</p>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
