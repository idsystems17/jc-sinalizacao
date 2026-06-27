import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2, Copy, Check, MessageCircle } from 'lucide-react';
import { CompanySettings } from '../types';

interface ContactMapProps {
  settings: CompanySettings;
}

export default function ContactMap({ settings }: ContactMapProps) {
  const [name, setName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(settings.address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    let text = `Olá, JC Sinalização! Meu nome é *${name}*`;
    if (contactPhone) text += ` e meu telefone é *${contactPhone}*`;
    text += `.\n\n${message}`;
    window.open(`https://wa.me/${settings.phone}?text=${encodeURIComponent(text)}`, '_blank');
    setName('');
    setContactPhone('');
    setMessage('');
  };

  return (
    <section id="contato" className="py-20 bg-editorial-cream border-b border-editorial-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase block mb-3">
            Onde Estamos
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-editorial-charcoal leading-tight">
            Nossa Localização &amp; Contato
          </h2>
          <div className="w-20 h-0.5 bg-editorial-gold mx-auto mt-4"></div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Column 1: Contact Details & Quick Mail Form */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-[#F2EFE9] border border-editorial-charcoal/10 rounded-xl p-6 sm:p-8 text-left">
            
            {/* Contact cards */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-serif font-bold text-editorial-charcoal">Canais de Atendimento</h3>
              </div>

              {/* Address card */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-editorial-charcoal/5 border border-editorial-charcoal/5 rounded text-editorial-gold flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-editorial-charcoal/50">Endereço de Produção</h4>
                  <p className="text-sm font-bold text-editorial-charcoal mt-1 leading-snug">{settings.address}</p>
                  <button
                    onClick={handleCopyAddress}
                    className="flex items-center gap-1.5 text-[10px] font-mono text-editorial-gold hover:text-editorial-charcoal font-bold mt-2 cursor-pointer transition-colors"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-green-600" />
                        Endereço Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copiar Endereço Completo
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Contact info card */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-editorial-charcoal/5 border border-editorial-charcoal/5 rounded text-editorial-gold flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-wider text-editorial-charcoal/50">WhatsApp</h4>
                    <a
                      href={`https://wa.me/${settings.phone}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-editorial-charcoal mt-1 font-mono hover:text-editorial-gold transition-colors block"
                    >
                      {settings.phoneFormatted}
                    </a>
                  </div>
                </div>

                {settings.phoneLandline && (
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-editorial-charcoal/5 border border-editorial-charcoal/5 rounded text-editorial-gold flex-shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase tracking-wider text-editorial-charcoal/50">Telefone Fixo</h4>
                      <p className="text-xs font-bold text-editorial-charcoal mt-1 font-mono">{settings.phoneLandline}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Working Hours Card */}
              <div className="flex items-start gap-4 border-t border-editorial-charcoal/10 pt-6">
                <div className="p-3 bg-editorial-charcoal/5 border border-editorial-charcoal/5 rounded text-editorial-gold flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-editorial-charcoal/50">Atendimento Técnico</h4>
                  <p className="text-xs font-semibold text-editorial-charcoal/80 mt-1 leading-snug">{settings.hours}</p>
                </div>
              </div>
            </div>

            {/* Quick message form → WhatsApp */}
            <div className="border-t border-editorial-charcoal/10 pt-8 mt-8">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-editorial-charcoal mb-4">Envie uma Mensagem Rápida</h4>
              <form onSubmit={handleSubmitContact} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="p-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Seu telefone (Opcional)"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="p-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                  />
                </div>
                <textarea
                  required
                  placeholder="Escreva sua dúvida ou necessidade..."
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-3.5 bg-[#25D366] hover:brightness-110 text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  Enviar pelo WhatsApp
                </button>
              </form>
            </div>

          </div>

          {/* Column 2: Elegant Map Wrapper with Editorial overlay */}
          <div className="lg:col-span-7 relative bg-white border border-editorial-charcoal/10 rounded-xl p-3 overflow-hidden flex flex-col justify-between">
            <div className="w-full h-full rounded-lg overflow-hidden relative border border-editorial-charcoal/5 min-h-[350px]">
              
              {/* Actual Google Maps standard embed */}
              <iframe
                src={settings.locationUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '350px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full"
              ></iframe>

              {/* Digital control map overlay HUD representing luxury custom craftsmanship */}
              <div className="absolute bottom-4 left-4 bg-editorial-charcoal/90 backdrop-blur-md text-white p-3.5 rounded border border-white/10 flex items-center gap-3 shadow-lg pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-editorial-gold animate-pulse"></div>
                <div className="text-left">
                  <span className="text-[8px] font-mono text-editorial-gold block tracking-widest uppercase font-bold">Unidade de Produção</span>
                  <span className="text-[10px] font-serif italic text-white/95 mt-0.5">JC Sinalização Corporativa</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
