import { Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useState } from 'react';
import { Menu, Share, SquarePen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModelSelector } from './ModelSelector';
import { ShareModal } from '@/components/chat/ShareModal';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';

// Width of the mobile sidebar in vw units — also used for the push transform
const MOBILE_SIDEBAR_VW = 80;

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/chat');
    setSidebarOpen(false);
  };

  // Swipe right anywhere on the screen to open sidebar; left to close
  const swipeAreaRef = useSwipeGesture<HTMLDivElement>({
    onSwipeRight: () => setSidebarOpen(true),
    onSwipeLeft: () => setSidebarOpen(false),
    threshold: 40,
  });

  return (
    <div
      ref={swipeAreaRef}
      className="relative flex h-svh overflow-hidden bg-background"
    >
      <ShareModal
        open={shareModalOpen}
        onOpenChange={setShareModalOpen}
        shareUrl="https://chat-ai-base.vercel.app/share/3WVGxnU9SHM"
      />

      {/* ── Mobile sidebar: fixed panel that slides in ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          bg-sidebar border-r border-border/30
          transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          lg:hidden
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          width: `${MOBILE_SIDEBAR_VW}vw`,
          paddingLeft: 'var(--sal)',
        }}
      >
        <Sidebar
          onClose={() => setSidebarOpen(false)}
          isCollapsed={false}
          onToggleCollapse={() => {}}
        />
      </aside>

      {/* ── Desktop sidebar: always visible in flex flow ── */}
      <aside
        className={`
          hidden lg:flex flex-col
          bg-sidebar border-r border-border/30
          transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          ${sidebarCollapsed ? 'w-[80px]' : 'w-[280px]'}
        `}
      >
        <Sidebar
          onClose={() => {}}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* ── Main content — pushed right when mobile sidebar opens ── */}
      <main
        className="flex flex-1 flex-col overflow-hidden min-w-0 transition-transform duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]"
        style={{
          transform: sidebarOpen ? `translateX(${MOBILE_SIDEBAR_VW}vw)` : 'translateX(0)',
        }}
      >
        {/* Dim overlay on the visible sliver of main content — tap to close */}
        {sidebarOpen && (
          <div
            className="absolute inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Header */}
        <div
          className="flex items-center justify-between border-b border-border/30 bg-background/90 backdrop-blur-md px-4 sticky top-0 z-10"
          style={{
            height: 'calc(3.25rem + var(--sat))',
            paddingTop: 'var(--sat)',
          }}
        >
          {/* Left: menu */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-muted/60 shrink-0"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarCollapsed(!sidebarCollapsed);
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* Center: model selector (Left aligned) */}
          <div className="flex-1 flex justify-start ml-1">
            <ModelSelector />
          </div>

          {/* Right: share + new chat */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
              onClick={() => setShareModalOpen(true)}
            >
              <Share className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 lg:hidden"
              onClick={handleNewChat}
            >
              <SquarePen className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}
