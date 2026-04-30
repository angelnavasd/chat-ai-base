import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useChats } from '@/api/queries/useChats';
import { useCreateChat } from '@/api/mutations/useCreateChat';
import { useDeleteChat } from '@/api/mutations/useDeleteChat';
import { useAuth } from '@/providers/AuthProvider';
import { ChatListItem } from './ChatListItem';
import { Button } from '@/components/ui/button';
import { 
  Plus, Search, MessageSquare, PanelLeft, Trash2, Bot,
  LogOut, Settings as SettingsIcon, CreditCard, HelpCircle,
  Sparkles, X, Check
} from 'lucide-react';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

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

  const filteredChats = searchQuery.trim()
    ? chats.filter((c) => c.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    : chats;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (e) {
      console.error('Error signing out:', e);
    }
  };

  // ── DESKTOP VIEW ─────────────────────────────────────────────
  if (!isMobile) {
    return (
      <div className="flex h-full flex-col overflow-hidden bg-sidebar">
        {/* Header: Logo Box Only (Filled "S") */}
        <div className="flex h-16 shrink-0 items-center px-4 mb-2">
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={isCollapsed ? onToggleCollapse : undefined}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-all duration-300 bg-transparent border border-white/20 ${
                isCollapsed ? 'cursor-pointer hover:bg-sidebar-accent/50 hover:border-white/40' : 'cursor-default'
              }`}
            >
              <span 
                className="text-xl leading-none select-none transition-colors text-white/80"
                style={{ 
                  fontFamily: "'Geist Pixel Square', monospace", 
                  paddingTop: '1px'
                }}
              >
                S
              </span>
            </button>
            
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleCollapse}
                className="h-7 w-7 rounded-md hover:bg-white/[0.05] text-muted-foreground/40 hover:text-foreground transition-all duration-300 shrink-0"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* New Chat Button (Pure H-9 Grid) */}
        <div className="px-4 mb-4">
          <button
            onClick={handleNewChat}
            disabled={createChat.isPending}
            className={`flex items-center transition-all duration-300 cursor-pointer overflow-hidden rounded-lg ${
              isCollapsed 
                ? 'h-9 w-9 justify-center bg-foreground text-background hover:opacity-90 mx-0' 
                : 'w-full h-9 px-1.5 justify-start gap-2.5 bg-sidebar-accent/30 hover:bg-sidebar-accent/60 active:scale-[0.98]'
            }`}
          >
            {isCollapsed ? (
              <Plus className="h-4.5 w-4.5 shrink-0" />
            ) : (
              <>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#10b981] text-white shadow-lg shadow-emerald-500/20">
                  <Plus className="h-4 w-4" strokeWidth={3} />
                </div>
                <span className="text-[13px] font-semibold text-foreground whitespace-nowrap">
                  Nuevo chat
                </span>
              </>
            )}
          </button>
        </div>

        {/* Search & List - Hide smoothly when collapsed */}
        <div className={`flex flex-col flex-1 overflow-hidden transition-all duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          {/* Search */}
          <div className="px-4 mb-4">
            <div className="relative group focus-glow rounded-lg transition-all duration-500">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/20 group-focus-within:text-foreground/50 transition-all duration-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('sidebar.search')}
                className="w-full h-9 bg-white/[0.02] hover:bg-white/[0.04] focus:bg-white/[0.05] rounded-lg pl-8 pr-4 text-[12px] text-foreground transition-all duration-500 focus:outline-none placeholder:text-muted-foreground/20 focus:placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
            <div className="px-2 mb-2">
              <h2 className="text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground/20 select-none">
                Chats
              </h2>
            </div>
            {isLoading ? (
              <div className="space-y-2 px-2 py-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-9 animate-pulse rounded-lg bg-sidebar-accent/50" />
                ))}
              </div>
            ) : filteredChats.length === 0 ? (
              <p className="py-12 text-center text-[13px] text-muted-foreground/60">
                {t('sidebar.empty')}
              </p>
            ) : (
              <div className="space-y-0.5">
                {filteredChats.map((chat) => (
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
        </div>

        {/* Pro Promo Banner + User section */}
        <div className="mt-auto shrink-0">
          {/* Syntable Pro Promo (only when expanded) */}
          {!isCollapsed && (
            <div className="px-4 mb-3">
              <div className="relative rounded-xl overflow-hidden group cursor-pointer border border-emerald-500/15">
                {/* Animated breathing radial glows */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <motion.div 
                    className="absolute -top-1/2 -left-1/3 w-[160%] h-[140%] rounded-full"
                    style={{ background: 'radial-gradient(ellipse at center, hsl(160 84% 39% / 0.45), transparent 65%)' }}
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2],
                      scale: [1, 1.15, 1],
                      x: [0, 15, 0],
                      y: [0, -8, 0],
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  <motion.div 
                    className="absolute -bottom-1/3 -right-1/4 w-[120%] h-[100%] rounded-full"
                    style={{ background: 'radial-gradient(ellipse at center, hsl(160 84% 39% / 0.3), transparent 65%)' }}
                    animate={{ 
                      opacity: [0.1, 0.25, 0.1],
                      scale: [1, 1.2, 1],
                      x: [0, -10, 0],
                      y: [0, 5, 0],
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  />
                </div>

                {/* Floating particles */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full"
                      style={{
                        width: 3 + (i % 3),
                        height: 3 + (i % 3),
                        left: `${15 + i * 14}%`,
                        bottom: -4,
                        backgroundColor: `hsl(${155 + i * 5} ${75 + i * 3}% ${55 + i * 5}%)`,
                      }}
                      animate={{
                        y: [0, -120 - i * 15],
                        x: [0, (i % 2 === 0 ? 8 : -8)],
                        opacity: [0, 0.7, 0],
                      }}
                      transition={{
                        duration: 3.5 + i * 0.5,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: 'easeOut',
                      }}
                    />
                  ))}
                </div>

                {/* Content */}
                <div className="relative z-10 p-3.5">
                  {/* Badge */}
                  <motion.div 
                    className="flex items-center gap-2.5 mb-2.5"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                  >
                    <div 
                      className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                    >
                      <span 
                        className="text-lg leading-none select-none text-white"
                        style={{ fontFamily: "'Geist Pixel Square', monospace", paddingTop: '1px' }}
                      >
                        S
                      </span>
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-foreground leading-none block">Syntable Pro</span>
                      <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-widest mt-0.5 block">Upgrade</span>
                    </div>
                  </motion.div>

                  {/* Features */}
                  <div className="space-y-1.5 mb-3">
                    {[
                      'Chat ilimitado con IA',
                      'Modelos premium',
                      'Respuestas prioritarias',
                    ].map((feat, i) => (
                      <motion.div 
                        key={feat}
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + i * 0.12 }}
                      >
                        <motion.div 
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/25"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', damping: 10, stiffness: 300, delay: 0.6 + i * 0.12 }}
                        >
                          <Check className="h-2.5 w-2.5 text-emerald-400" strokeWidth={3} />
                        </motion.div>
                        <span className="text-[11px] font-medium text-muted-foreground/80">{feat}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA with shimmer sweep */}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.7 }}
                    className="relative overflow-hidden rounded-lg"
                  >
                    <button className="relative w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold rounded-lg active:scale-[0.97] transition-all shadow-md shadow-emerald-500/20 z-10">
                      Comenzar
                    </button>
                    {/* Shimmer sweep */}
                    <motion.div
                      className="absolute inset-0 z-20 pointer-events-none"
                      style={{
                        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                      }}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                    />
                  </motion.div>
                </div>

                {/* Dismiss */}
                <button
                  className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 bg-black/20 hover:bg-black/30 text-white/50 hover:text-white transition-all z-20"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}


          {/* User Dropdown */}
          <div className="p-4 pt-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex items-center transition-all duration-300 cursor-pointer text-left active:scale-[0.98] group overflow-hidden border border-transparent outline-none",
                  isCollapsed 
                    ? 'h-9 w-9 justify-center rounded-lg bg-transparent hover:bg-sidebar-accent/50 mx-0 p-0' 
                    : 'w-full h-9 px-1.5 justify-start rounded-lg bg-transparent hover:bg-sidebar-accent/30 gap-2.5'
                )}
              >
                {isCollapsed ? (
                  user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt=""
                      className="h-9 w-9 object-cover rounded-lg shrink-0"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center bg-primary/10 text-primary font-semibold rounded-lg text-sm shrink-0">
                      {user?.displayName?.[0] ?? user?.email?.[0] ?? '?'}
                    </div>
                  )
                ) : (
                  <>
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="h-7 w-7 object-cover rounded-lg shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center bg-primary/10 text-primary font-semibold rounded-lg text-[10px] shrink-0">
                        {user?.displayName?.[0] ?? user?.email?.[0] ?? '?'}
                      </div>
                    )}
                    <div className="flex items-center min-w-0 flex-1">
                      <span className="truncate text-[13px] font-semibold text-foreground leading-tight">
                        {user?.displayName ?? user?.email?.split('@')[0]}
                      </span>
                    </div>
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 p-0 bg-[#121212] border border-white/10 shadow-2xl rounded-xl backdrop-blur-xl overflow-hidden" 
              align={isCollapsed ? "center" : "start"} 
              side={isCollapsed ? "right" : "top"} 
              sideOffset={8}
            >
              <div className="p-3 pb-2.5">
                <div className="flex items-center gap-3">
                  <div className="relative h-9 w-9 rounded-lg shrink-0 border border-white/10 overflow-hidden bg-muted flex items-center justify-center">
                    {user?.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="text-muted-foreground font-bold text-sm uppercase">
                        {user?.email?.[0] || 'U'}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[13px] font-bold text-foreground truncate leading-tight">
                      {user?.displayName || user?.email?.split('@')[0]}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md w-fit mt-1 bg-primary/10 text-primary uppercase tracking-wider">
                      Syntable Free
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3.5">
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center justify-center gap-1.5 h-7.5 px-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                  >
                    <SettingsIcon className="h-3.5 w-3.5" />
                    Ajustes
                  </button>
                  <button
                    className="flex items-center justify-center gap-1.5 h-7.5 px-2 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-all"
                  >
                    <CreditCard className="h-3.5 w-3.5" />
                    Sub
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/5 m-0" />
              <div className="p-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-muted-foreground/30 truncate select-none">
                  {user?.email}
                </div>
                <DropdownMenuItem 
                  className="h-9 px-3 rounded-lg text-[13px] text-muted-foreground/70 hover:text-foreground focus:bg-white/5 cursor-pointer gap-3 transition-colors" 
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="font-medium">Cerrar sesión</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="h-9 px-3 rounded-lg text-[13px] text-muted-foreground/70 hover:text-foreground focus:bg-white/5 cursor-pointer gap-3 transition-colors"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span className="font-medium">Soporte</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          </div>
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
