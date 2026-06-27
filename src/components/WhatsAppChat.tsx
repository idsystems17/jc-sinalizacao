import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send } from 'lucide-react';
import { CompanySettings } from '../types';

interface WhatsAppChatProps {
  settings: CompanySettings;
}

export default function WhatsAppChat({ settings }: WhatsAppChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${settings.phone}?text=${encoded}`, '_blank');
    setMessage('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-45">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-[#FAF9F6] rounded-xl border border-editorial-charcoal/10 shadow-2xl overflow-hidden w-80 sm:w-85 text-left mb-4"
          >
            {/* Header Panel */}
            <div className="bg-editorial-charcoal p-4 text-white flex justify-between items-center border-b border-editorial-charcoal/10">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-serif italic text-white font-bold border border-white/20">
                    JC
                  </div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-editorial-gold border-2 border-editorial-charcoal rounded-full"></div>
                </div>
                <div>
                  <h4 className="text-sm font-serif italic font-bold">Atendimento JC</h4>
                  <p className="text-[10px] text-editorial-gold/90 font-mono tracking-wider uppercase">Online • Retorno Imediato</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Bubble Message Area */}
            <div className="p-4 bg-[#F2EFE9] h-36 overflow-y-auto space-y-3 flex flex-col justify-end">
              <div className="bg-white border border-editorial-charcoal/10 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm text-left">
                <p className="text-xs text-editorial-charcoal/90 leading-relaxed">
                  Olá! Seja muito bem-vindo à <strong className="font-bold">JC Sinalização &amp; Serigrafia</strong>.
                </p>
              </div>
              <div className="bg-white border border-editorial-charcoal/10 p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm text-left">
                <p className="text-xs text-editorial-charcoal/90 leading-relaxed">
                  Como podemos te ajudar hoje? Digite sua mensagem para conversar diretamente no nosso WhatsApp comercial!
                </p>
              </div>
            </div>

            {/* Form Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-editorial-charcoal/10 flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escreva sua mensagem..."
                className="flex-grow p-2.5 bg-[#FAF9F6] border border-editorial-charcoal/10 rounded text-xs focus:border-editorial-gold focus:outline-none text-editorial-charcoal"
                required
              />
              <button
                type="submit"
                className="p-2.5 bg-[#25D366] text-white hover:brightness-105 rounded-full shadow transition-all cursor-pointer flex items-center justify-center shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Circle Trigger Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-editorial-charcoal hover:bg-editorial-gold text-white rounded-full flex items-center justify-center shadow-xl cursor-pointer focus:outline-none relative group border border-white/15"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <X className="w-6 h-6 text-white" key="close" />
          ) : (
            <svg 
              className="w-7 h-7 fill-current text-white" 
              viewBox="0 0 24 24"
              key="chat"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 1.981 13.93 1.95 12.01 1.95c-5.434 0-9.858 4.37-9.863 9.8-.001 1.77.462 3.5 1.34 5.024l-1.022 3.73 3.837-.993a9.71 9.71 0 0 0 4.755 1.243z" />
            </svg>
          )}
        </AnimatePresence>

        {/* Pulse light dot decoration */}
        {!isOpen && (
          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-gold opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-editorial-gold text-[9px] font-mono font-black items-center justify-center text-editorial-charcoal">1</span>
          </span>
        )}
      </motion.button>
    </div>
  );
}
