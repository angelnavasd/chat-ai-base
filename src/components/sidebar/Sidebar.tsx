import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChats } from '@/api/queries/useChats';
import { useCreateChat } from '@/api/mutations/useCreateChat';
import { useDeleteChat } from '@/api/mutations/useDeleteChat';
import { useAuth } from '@/providers/AuthProvider';
import { ChatListItem } from './ChatListItem';
import { Button } from '@/components/ui/button';
import { Plus, LogOut, Bot, X, Settings, Search, SquarePen, Trash2, MessageSquare, ChevronRight } from 'lucide-react';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ onClose, isCollapsed, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const { data: chats = [], isLoading } = useChats();
  const createChat = useCreateChat();
  const deleteChat = useDeleteChat();
  const { user, logout } = useAuth();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width: 1023px)');

  const handleNewChat = () => {
    navigate('/chat');
    onClose?.();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredChats = searchQuery.trim()
    ? chats.filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  // ── DESKTOP VIEW (Original) ──────────────────────────────────
  if (!isMobile) {
    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className={`flex h-16 items-center ${isCollapsed ? 'justify-center' : 'justify-between px-6'} mb-2`}>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary shrink-0" />
            {!isCollapsed && <span className="text-lg font-bold tracking-tight text-foreground">{t('sidebar.title')}</span>}
          </div>
          {!isCollapsed && (
            <div className="flex items-center gap-1">
              <Button
                onClick={handleNewChat}
                disabled={createChat.isPending}
                size="icon"
                className="h-8 w-8 rounded-xl bg-foreground text-background hover:opacity-90 transition-all shadow-sm"
                title={t('sidebar.newChat')}
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="px-4 mb-6">
            <div className="relative group px-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder={t('sidebar.search')}
                className="w-full bg-sidebar-accent/20 rounded-xl border-transparent pl-9 pr-4 py-2.5 text-sm transition-all focus:bg-sidebar-accent/40 focus:outline-none placeholder:text-muted-foreground/40"
              />
            </div>
          </div>
        )}

        {/* Chat list */}
        <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'hidden' : 'px-2'}`}>
          {isLoading ? (
            <div className="space-y-2 px-2 py-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-10 animate-pulse rounded-lg bg-sidebar-accent/50" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground/60">
              {t('sidebar.empty')}
            </p>
          ) : (
            <div className="space-y-0.5">
              {chats.map((chat) => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  onClick={() => {
                    navigate(`/chat/${chat.id}`);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* User section */}
        <div className={`mt-auto ${isCollapsed ? 'px-2 pb-6 pt-4' : 'px-4 pb-6 pt-4'}`}>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className={`w-full flex items-center transition-colors cursor-pointer text-left active:scale-[0.98] ${
              isCollapsed 
                ? 'flex-col gap-4 bg-transparent hover:bg-sidebar-accent/50 p-2 rounded-2xl' 
                : 'justify-between rounded-2xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 p-3'
            }`}
          >
            <div className={`flex items-center gap-3 overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold shrink-0">
                  {user?.displayName?.[0] ?? user?.email?.[0] ?? '?'}
                </div>
              )}
              {!isCollapsed && (
                <div className="flex flex-col truncate">
                  <span className="truncate text-sm font-medium text-sidebar-foreground">
                    {user?.displayName ?? 'User'}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              )}
            </div>
          </button>
        </div>

        <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
      </div>
    );
  }

  // ── MOBILE VIEW (Gemini Style) ───────────────────────────────
  return (
    <div
      className="flex h-full flex-col bg-sidebar"
      style={{ paddingBottom: 'max(1rem, var(--sab))' }}
    >
      {/* ── App Header ── */}
      <div
        className="flex items-center px-6"
        style={{ paddingTop: 'calc(var(--sat) + 1.25rem)', paddingBottom: '1rem' }}
      >
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary shrink-0" />
          <span className="text-lg font-bold tracking-tight text-foreground">
            {t('sidebar.title')}
          </span>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('sidebar.search')}
            className="w-full h-11 bg-sidebar-accent/40 rounded-2xl pl-10 pr-4 text-[15px] text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:bg-sidebar-accent/60 transition-colors"
            style={{ fontSize: 'max(16px, 1rem)' }}
          />
        </div>
      </div>

      {/* ── Chat list ── */}
      <div className="px-5 pb-1.5 pt-2">
        <span className="text-[13px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
          Chats
        </span>
      </div>
      <div className="flex-1 overflow-y-auto px-2">
        {isLoading ? (
          <div className="space-y-1.5 px-2 py-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-11 animate-pulse rounded-xl bg-sidebar-accent/40" />
            ))}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-14 px-6 text-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground/25" />
            <p className="text-[14px] text-muted-foreground/50">
              {searchQuery ? 'Sin resultados' : t('sidebar.empty')}
            </p>
          </div>
        ) : (
          <div className="py-1">
            {filteredChats.map((chat) => {
              const isActive = chatId === chat.id;
              return (
                <div key={chat.id} className="group relative">
                  <button
                    onClick={() => {
                      navigate(`/chat/${chat.id}`);
                      onClose?.();
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-3.5 rounded-xl text-left transition-all active:scale-[0.99] ${
                      isActive
                        ? 'bg-sidebar-accent/60 text-foreground'
                        : 'hover:bg-sidebar-accent/30 text-foreground/75'
                    }`}
                  >
                    {isActive && (
                      <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    )}
                    <span
                      className={`truncate text-[15px] leading-snug ${
                        isActive ? 'font-semibold' : 'font-normal'
                      }`}
                    >
                      {chat.title || 'Nueva conversación'}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat.mutate(chat.id);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full text-muted-foreground/0 group-hover:text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 active:scale-90 transition-all opacity-0 group-hover:opacity-100"
                    aria-label="Eliminar chat"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── User section ── */}
      <div className="px-3 pt-2 border-t border-border/30">
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-sidebar-accent/30 active:bg-sidebar-accent/50 active:scale-[0.98] transition-all text-left"
        >
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-9 w-9 rounded-full object-cover shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary text-[15px] font-semibold shrink-0">
              {user?.displayName?.[0] ?? user?.email?.[0] ?? '?'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="truncate text-[14px] font-semibold text-foreground leading-tight">
              {user?.displayName ?? 'Usuario'}
            </p>
            <p className="truncate text-[12px] text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </button>
      </div>

      <SettingsModal open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />
    </div>
  );
}
