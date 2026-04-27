import { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, CreditCard, Settings as SettingsIcon, LogOut, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user, logout } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { t, i18n } = useTranslation();
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleLogout = async () => {
    await logout();
    onOpenChange(false);
  };

  const tabItems = [
    { value: 'account', icon: User, label: t('settings.tabs.account') },
    { value: 'general', icon: SettingsIcon, label: t('settings.tabs.general') },
    { value: 'billing', icon: CreditCard, label: t('settings.tabs.billing') },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isMobile
            ? 'fixed left-0 top-0 m-0 p-0 flex flex-col h-[100dvh] w-screen !max-w-none translate-x-0 translate-y-0 border-0 !rounded-none bg-background overflow-hidden z-50'
            : 'sm:max-w-[800px] p-0 overflow-hidden bg-background border-border/40'
        }
      >
        {isMobile ? (
          /* ── MOBILE LAYOUT (Native Vertical Scroll) ─────────────────────────────── */
          <div className="flex flex-col h-full w-full bg-muted/30">
            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-border/40 bg-background shrink-0">
              <DialogTitle className="text-xl font-bold tracking-tight">
                {t('settings.title')}
              </DialogTitle>
              <DialogDescription className="sr-only">{t('settings.description')}</DialogDescription>
            </div>

            {/* Content — vertical scrollable list */}
            <div className="flex-1 overflow-y-auto w-full p-4 space-y-6 pb-12">
              
              {/* Account Section */}
              <section className="space-y-2">
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('settings.tabs.account')}
                </h3>
                <div className="bg-background border border-border/40 rounded-2xl p-4 space-y-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 border border-border/40 shrink-0">
                      <AvatarImage src={user?.photoURL || ''} />
                      <AvatarFallback className="text-lg bg-primary/5 text-primary">
                        {user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-base font-semibold tracking-tight truncate">
                        {user?.displayName || t('settings.account.defaultUser')}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-10 rounded-xl transition-colors active:scale-95"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    {t('settings.account.logoutBtn')}
                  </Button>
                </div>
              </section>

              {/* General Section */}
              <section className="space-y-2">
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('settings.tabs.general')}
                </h3>
                <div className="bg-background border border-border/40 rounded-2xl shadow-sm divide-y divide-border/40">
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-0.5 pr-4">
                      <p className="font-medium text-sm">{t('settings.general.darkTheme')}</p>
                      <p className="text-xs text-muted-foreground">{t('settings.general.darkThemeDesc')}</p>
                    </div>
                    <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-0.5 pr-4">
                      <p className="font-medium text-sm">{t('settings.general.sound')}</p>
                      <p className="text-xs text-muted-foreground">{t('settings.general.soundDesc')}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="space-y-0.5 pr-4">
                      <p className="font-medium text-sm">{t('settings.general.language')}</p>
                      <p className="text-xs text-muted-foreground">{t('settings.general.languageDesc')}</p>
                    </div>
                    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg shrink-0">
                      <Button
                        variant="ghost"
                        className={`h-7 px-3 rounded-md text-xs font-medium transition-all ${i18n.language === 'en' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => i18n.changeLanguage('en')}
                      >
                        EN
                      </Button>
                      <Button
                        variant="ghost"
                        className={`h-7 px-3 rounded-md text-xs font-medium transition-all ${i18n.language === 'es' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        onClick={() => i18n.changeLanguage('es')}
                      >
                        ES
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Billing Section */}
              <section className="space-y-2">
                <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {t('settings.tabs.billing')}
                </h3>
                <div className="bg-background border border-border/40 rounded-2xl shadow-sm overflow-hidden">
                  <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm flex items-center gap-2">
                          {t('settings.billing.plan')}
                          <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-semibold">Pro</span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{t('settings.billing.limits')}</p>
                      </div>
                      <div className="h-10 w-10 rounded-full border-4 border-primary flex items-center justify-center font-bold text-xs shrink-0">
                        24
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-xl flex flex-col gap-2">
                      <h4 className="font-semibold text-sm">{t('settings.billing.upgradeTitle')}</h4>
                      <p className="text-xs text-muted-foreground">{t('settings.billing.upgradeDesc')}</p>
                      <Button className="w-full h-10 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white border-0 rounded-xl active:scale-95 transition-all mt-1">
                        {t('settings.billing.upgradeBtn')}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          </div>
        ) : (
          /* ── DESKTOP LAYOUT ────────────────────────────── */
          <div className="flex h-[600px] w-full">
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
                    {tabItems.map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="w-full justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
                      >
                        <tab.icon className="h-4 w-4" />
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 bg-background/50">
                <TabsContent value="account" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight">{t('settings.account.title')}</h3>
                    <p className="text-base text-muted-foreground">{t('settings.account.description')}</p>
                  </div>
                  <div className="flex items-center gap-6 py-2">
                    <Avatar className="h-20 w-20 border border-border/40">
                      <AvatarImage src={user?.photoURL || ''} />
                      <AvatarFallback className="text-2xl bg-primary/5 text-primary">
                        {user?.email?.[0]?.toUpperCase()}
                      </AvatarFallback>
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
                      <Button
                        variant="outline"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20 h-10 px-6 rounded-full transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        {t('settings.account.logoutBtn')}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="general" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-semibold tracking-tight">{t('settings.general.title')}</h3>
                    <p className="text-base text-muted-foreground">{t('settings.general.description')}</p>
                  </div>
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{t('settings.general.darkTheme')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.general.darkThemeDesc')}</p>
                      </div>
                      <Switch checked={theme === 'dark'} onCheckedChange={(c) => setTheme(c ? 'dark' : 'light')} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{t('settings.general.sound')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.general.soundDesc')}</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{t('settings.general.language')}</p>
                        <p className="text-sm text-muted-foreground">{t('settings.general.languageDesc')}</p>
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
                      {t('settings.billing.title')}
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">Pro</span>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{t('settings.billing.description')}</p>
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
                      <div className="bg-muted p-4 rounded-lg flex flex-col gap-3">
                        <h4 className="font-semibold text-sm">{t('settings.billing.upgradeTitle')}</h4>
                        <p className="text-xs text-muted-foreground">{t('settings.billing.upgradeDesc')}</p>
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
        )}
      </DialogContent>
    </Dialog>
  );
}
