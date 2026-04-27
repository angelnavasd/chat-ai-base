import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageCircle, Mail, Share2, Link, Globe, Send } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
}

export function ShareModal({ open, onOpenChange, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const { t } = useTranslation();

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success(t('chat.copy'));
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = [
    { icon: <MessageCircle className="h-5 w-5" />, name: 'WhatsApp', color: 'bg-[#25D366]' },
    { icon: <Globe className="h-5 w-5" />, name: 'Facebook', color: 'bg-[#1877F2]' },
    { icon: <Send className="h-5 w-5" />, name: 'X', color: 'bg-black dark:bg-white dark:text-black' },
    { icon: <Mail className="h-5 w-5" />, name: 'Email', color: 'bg-muted-foreground' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[400px] p-6 gap-6 rounded-[24px] bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">{t('chat.share')}</DialogTitle>
          <DialogDescription className="sr-only">Opciones para compartir esta conversación</DialogDescription>
        </DialogHeader>

        {/* Social icons - Distribuídos uniformemente en una línea */}
        <div className="flex items-start justify-between w-full pt-2 pb-2">
          <div className="flex flex-col items-center gap-2 group cursor-pointer w-[52px]">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:opacity-80 active:scale-95 transition-all shadow-sm border border-zinc-200 dark:border-zinc-700 shrink-0">
              <Share2 className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-700 dark:text-zinc-300" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-zinc-500 dark:text-zinc-400 text-center truncate w-full">{t('chat.insert')}</span>
          </div>
          {socialLinks.map((social) => (
            <div key={social.name} className="flex flex-col items-center gap-2 group cursor-pointer w-[52px]">
              <div className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full ${social.color} flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all shrink-0`}>
                {social.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] font-medium text-muted-foreground text-center truncate w-full">{social.name}</span>
            </div>
          ))}
        </div>

        {/* URL + copy */}
        <div className="flex items-center w-full h-14 rounded-[14px] bg-zinc-100 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 px-1.5 shadow-sm">
          <div className="flex items-center justify-center h-full w-10 shrink-0">
            <Link className="h-[18px] w-[18px] text-zinc-400 dark:text-zinc-500" />
          </div>
          <input
            readOnly
            value={shareUrl}
            className="flex-1 bg-transparent text-[13px] sm:text-sm font-medium outline-none min-w-0 text-zinc-900 dark:text-zinc-200 pl-1 pr-2"
          />
          <Button
            onClick={handleCopy}
            className="h-11 px-4 sm:px-5 rounded-xl bg-primary text-primary-foreground font-semibold active:scale-95 shrink-0 transition-transform"
          >
            {copied ? <Check className="h-[18px] w-[18px]" /> : <Copy className="h-[18px] w-[18px]" />}
            <span className="ml-1.5 hidden sm:inline">{copied ? t('chat.copied') : t('chat.copyBtn')}</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
