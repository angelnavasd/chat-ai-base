import { useState } from 'react';
import { Bot, ChevronDown, Sparkles, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
          className="h-8 gap-1.5 text-[14px] font-bold text-muted-foreground hover:text-foreground hover:bg-white/5 px-2 rounded-lg transition-all"
        >
          <span className="truncate max-w-[120px] sm:max-w-none">
            <span className="sm:hidden">{selectedModel.shortName}</span>
            <span className="hidden sm:inline">{selectedModel.name}</span>
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="start" 
        sideOffset={8}
        className="w-[280px] p-1 bg-[#121212] border border-white/10 shadow-2xl rounded-xl backdrop-blur-xl z-[100]"
      >
        {models.map((model) => {
          const isSelected = selectedModel.id === model.id;
          return (
            <DropdownMenuItem
              key={model.id}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors",
                isSelected ? "bg-white/5" : "hover:bg-white/5"
              )}
              onClick={() => setSelectedModel(model)}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 mt-0.5">
                <model.icon className={cn("h-4 w-4", isSelected ? "text-primary" : "text-muted-foreground/70")} />
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className={cn("text-[13px] font-bold", isSelected ? "text-foreground" : "text-muted-foreground")}>
                    {model.name}
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                </div>
                <p className="text-[11px] text-muted-foreground/60 leading-snug mt-0.5 font-medium">
                  {model.desc}
                </p>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
