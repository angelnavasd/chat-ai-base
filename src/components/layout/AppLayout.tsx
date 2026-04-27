import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { useState } from 'react';
import { Menu, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModelSelector } from './ModelSelector';
import { toast } from 'sonner';
import { ShareModal } from '@/components/chat/ShareModal';

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      <ShareModal 
        open={shareModalOpen} 
        onOpenChange={setShareModalOpen} 
        shareUrl="https://chat-ai-base.vercel.app/share/3WVGxnU9SHM"
      />
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 transform bg-sidebar border-r border-border/40 transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)]
          lg:relative lg:translate-x-0
          ${sidebarCollapsed ? 'w-[80px]' : 'w-[280px]'}
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar 
          onClose={() => setSidebarOpen(false)} 
          isCollapsed={sidebarCollapsed} 
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Main content area */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Header (Mobile & Desktop) */}
        <div className="flex h-16 items-center justify-between border-b border-border/40 bg-background/80 backdrop-blur-md px-6 py-2 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full bg-sidebar-accent/50"
              onClick={() => {
                if (window.innerWidth >= 1024) {
                  setSidebarCollapsed(!sidebarCollapsed);
                } else {
                  setSidebarOpen(true);
                }
              }}
            >
              <Menu className="h-4 w-4" />
            </Button>
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <span className="font-semibold tracking-tight lg:hidden">AI Chat Base</span>
            )}
          </div>
          
          <div className="flex-1 flex justify-center">
            <ModelSelector />
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:flex h-9 w-9 rounded-full text-muted-foreground hover:text-foreground" 
              onClick={() => setShareModalOpen(true)}
            >
              <Share className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <Outlet />
      </main>
    </div>
  );
}
