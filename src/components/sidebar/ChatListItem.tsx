import { useParams } from 'react-router-dom';
import { useDeleteChat } from '@/api/mutations/useDeleteChat';
import type { Chat } from '@/types';
import { MoreHorizontal, Trash2, ExternalLink, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from 'react-i18next';

interface ChatListItemProps {
  chat: Chat;
  onClick: () => void;
}

export function ChatListItem({ chat, onClick }: ChatListItemProps) {
  const { chatId } = useParams();
  const deleteChat = useDeleteChat();
  const { t } = useTranslation();
  const isActive = chatId === chat.id;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat.mutate(chat.id);
  };

  return (
    <div
      onClick={onClick}
      className={`
        group flex h-9 cursor-pointer items-center justify-between gap-2.5 rounded-lg px-3 text-[13px] transition-all duration-200
        ${isActive
          ? 'bg-sidebar-accent/50 text-foreground font-semibold'
          : 'text-muted-foreground font-medium hover:bg-sidebar-accent/30 hover:text-foreground'
        }
      `}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        {isActive && <div className="h-2 w-2 rounded-full bg-primary shrink-0" />}
        <span className="truncate">{chat.title}</span>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 shrink-0 rounded-full hover:bg-muted transition-all focus-visible:ring-0 focus-visible:border-transparent data-[state=open]:bg-muted ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          sideOffset={4}
          className="w-40 p-1 rounded-xl border border-white/5 shadow-2xl bg-zinc-950/90 backdrop-blur-md"
        >
          <DropdownMenuItem 
            onClick={onClick} 
            className="gap-2.5 rounded-lg px-2.5 py-1.5 cursor-pointer text-[13px] hover:bg-white/5 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-medium">{t('common.open')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="gap-2.5 rounded-lg px-2.5 py-1.5 cursor-pointer text-[13px] hover:bg-white/5 transition-colors"
          >
            <Pencil className="h-3.5 w-3.5 text-muted-foreground/70" />
            <span className="font-medium">{t('common.rename')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDelete} 
            className="gap-2.5 rounded-lg px-2.5 py-1.5 text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer text-[13px] transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span className="font-medium">{t('common.delete')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
