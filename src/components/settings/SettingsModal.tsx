import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Settings, User, CreditCard, Bell, Moon, LogOut, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] gap-0 p-0 overflow-hidden bg-background shadow-2xl border-border/40">
        <div className="flex h-[600px] w-full">
          {/* Sidebar Tabs */}
          <Tabs defaultValue="account" orientation="vertical" className="flex w-full h-full gap-0">
            <div className="w-[260px] border-r border-border/40 bg-sidebar/30 flex flex-col shrink-0">
              <div className="p-6 pb-4">
                <DialogTitle className="text-2xl font-bold tracking-tight">{t('settings.title')}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-2">
                  {t('settings.description')}
                </DialogDescription>
              </div>

              <div className="px-4">
                <TabsList className="flex flex-col h-auto bg-transparent space-y-1.5 w-full p-0 items-start justify-start">
                  <TabsTrigger
                    value="account"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                  >
                    <User className="h-4 w-4" />
                    {t('settings.tabs.account')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="general"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    {t('settings.tabs.general')}
                  </TabsTrigger>
                  <TabsTrigger
                    value="billing"
                    className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                  >
                    <CreditCard className="h-4 w-4" />
                    {t('settings.tabs.billing')}
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>

            {/* Tab Contents */}
            <div className="flex-1 overflow-y-auto p-10 bg-background/50">
              <TabsContent value="account" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight">{t('settings.account.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('settings.account.description')}
                  </p>
                </div>
                
                <div className="flex items-center gap-6 py-2">
                  <Avatar className="h-20 w-20 border border-border/40">
                    <AvatarImage src={user?.photoURL || ''} />
                    <AvatarFallback className="text-2xl bg-primary/5 text-primary">{user?.email?.[0]?.toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-xl font-semibold tracking-tight">{user?.displayName || t('settings.account.defaultUser')}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                <div className="space-y-6 pt-8 border-t border-border/40">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-semibold text-destructive">{t('settings.account.logoutTitle')}</p>
                      <p className="text-sm text-muted-foreground">{t('settings.account.logoutDesc')}</p>
                    </div>
                    <Button variant="outline" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-10 px-6 rounded-full transition-colors" onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('settings.account.logoutBtn')}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="general" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                <div className="space-y-1">
                  <h3 className="text-2xl font-semibold tracking-tight">{t('settings.general.title')}</h3>
                  <p className="text-base text-muted-foreground">
                    {t('settings.general.description')}
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{t('settings.general.darkTheme')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.general.darkThemeDesc')}
                      </p>
                    </div>
                    <Switch 
                      checked={theme === 'dark'} 
                      onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{t('settings.general.sound')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.general.soundDesc')}
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">{t('settings.general.language')}</p>
                      <p className="text-sm text-muted-foreground">
                        {t('settings.general.languageDesc')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg">
                      <Button 
                        variant="ghost"
                        className={`h-8 px-4 rounded-md text-sm font-medium transition-all ${i18n.language === 'en' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => i18n.changeLanguage('en')}
                      >
                        EN
                      </Button>
                      <Button 
                        variant="ghost"
                        className={`h-8 px-4 rounded-md text-sm font-medium transition-all ${i18n.language === 'es' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => i18n.changeLanguage('es')}
                      >
                        ES
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="m-0 space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    {t('settings.billing.title')} <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Pro</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('settings.billing.description')}
                  </p>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground">
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{t('settings.billing.plan')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.billing.limits')}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full border-4 border-primary flex items-center justify-center font-bold text-sm">
                        24
                      </div>
                    </div>
                    
                    {/* Placeholder para la integración futura de Paddle */}
                    <div className="bg-muted p-4 rounded-lg flex flex-col gap-3">
                      <h4 className="font-semibold text-sm">{t('settings.billing.upgradeTitle')}</h4>
                      <p className="text-xs text-muted-foreground">
                        {t('settings.billing.upgradeDesc')}
                      </p>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0">
                        {t('settings.billing.upgradeBtn')}
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
