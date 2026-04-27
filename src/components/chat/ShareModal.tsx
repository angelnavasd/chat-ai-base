import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, MessageCircle, Mail, Share2, Link, Code, Globe, Send } from 'lucide-react';
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
    { icon: <Send className="h-5 w-5" />, name: 'X', color: 'bg-black' },
    { icon: <Mail className="h-5 w-5" />, name: 'Email', color: 'bg-muted-foreground' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] gap-0 p-0 overflow-hidden border-border/40 shadow-2xl rounded-xl bg-muted/90 backdrop-blur-2xl">
        <div className="p-6 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold tracking-tight">{t('chat.share')}</DialogTitle>
            <DialogDescription className="sr-only">Opciones para compartir esta conversación</DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-4 overflow-x-auto pb-2 justify-center sm:justify-start no-scrollbar">
            <div className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
              <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors">
                <Share2 className="h-6 w-6 text-foreground" />
              </div>
              <span className="text-xs font-medium text-muted-foreground">{t('chat.insert')}</span>
            </div>
            {socialLinks.map((social) => (
              <div key={social.name} className="flex flex-col items-center gap-2 group cursor-pointer shrink-0">
                <div className={`h-14 w-14 rounded-full ${social.color} flex items-center justify-center text-white hover:opacity-90 transition-opacity`}>
                  {social.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{social.name}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <div className="relative flex items-center">
              <div className="flex-1 flex items-center h-12 rounded-xl bg-muted/30 border border-border/40 px-4 overflow-hidden focus-within:border-primary/50 transition-all">
                <Link className="h-4 w-4 text-muted-foreground/50 mr-3 shrink-0" />
                <input 
                  readOnly 
                  value={shareUrl} 
                  className="flex-1 bg-transparent text-sm font-medium outline-none truncate"
                />
              </div>
              <Button 
                onClick={handleCopy}
                className="ml-3 h-12 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 font-bold transition-all active:scale-95 shrink-0"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? t('chat.copied') : t('chat.copyBtn')}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
