import React from 'react';
import { motion } from 'motion/react';
import { FileText, ArrowRight, CheckCircle2, Shield, Flame, Palette } from 'lucide-react';
import { CompanySettings } from '../types';

interface HeroProps {
  onNavigate: (section: string) => void;
  settings: CompanySettings;
}

export default function Hero({ onNavigate, settings }: HeroProps) {
  const handleWhatsAppClick = () => {
    const text = encodeURIComponent('Olá! Visitei o site da JC Sinalização e Serigrafia e gostaria de solicitar uma cotação rápida de serviços.');
    window.open(`https://wa.me/${settings.phone}?text=${text}`, '_blank');
  };

  const badgeVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.12, duration: 0.5, ease: 'easeOut' }
    })
  };

  const trustBadges = [
    { icon: <Flame className="w-5 h-5 text-editorial-gold" />, title: 'Placas Fotoluminescentes', desc: 'Conforme Norma NBR 13434' },
    { icon: <Palette className="w-5 h-5 text-editorial-gold" />, title: 'Serigrafia & Silk-Screen', desc: 'Cores vivas e alta durabilidade' },
    { icon: <Shield className="w-5 h-5 text-editorial-gold" />, title: 'Comunicação Visual', desc: 'Banners, adesivos e frotas' }
  ];

  return (
    <section id="home" className="relative pt-28 md:pt-36 pb-16 md:pb-24 overflow-hidden bg-editorial-cream border-b border-editorial-charcoal/10">
      {/* Editorial layout thin border lines */}
      <div className="absolute top-0 right-1/2 w-px h-full bg-editorial-charcoal/5 hidden lg:block pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Left Column */}
          <div className="lg:col-span-7 flex flex-col text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-editorial-gold mb-6 self-start"
            >
              <CheckCircle2 className="w-4 h-4 text-editorial-gold" />
              Sinalização de Segurança &amp; Silk Screen Premium
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold text-editorial-charcoal leading-[1.05] tracking-tight mb-6"
            >
              Sinta a essência do <br />
              <span className="font-serif italic font-normal text-editorial-gold">design de segurança</span>.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-editorial-charcoal/70 leading-relaxed mb-8 max-w-xl"
            >
              Produzimos placas de sinalização de alta visibilidade e em estrita conformidade técnica, serigrafia premium de alto impacto para vestuário corporativo, e comunicação visual contemporânea de máxima durabilidade.
            </motion.p>

            {/* CTA Buttons - Matching the design HTML standard buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <button
                onClick={() => onNavigate('orcamento')}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-editorial-charcoal hover:bg-editorial-gold text-white font-bold text-xs tracking-widest uppercase rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <FileText className="w-4 h-4" />
                Solicitar Orçamento Grátis
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white hover:brightness-115 font-bold text-xs tracking-widest uppercase rounded-full shadow-sm transition-all cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 1.981 13.93 1.95 12.01 1.95c-5.434 0-9.858 4.37-9.863 9.8-.001 1.77.462 3.5 1.34 5.024l-1.022 3.73 3.837-.993a9.71 9.71 0 0 0 4.755 1.243z" />
                </svg>
                Fale Conosco No WhatsApp
              </button>
            </motion.div>

            {/* Micro Badges styled as elegant grid dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-editorial-charcoal/10 pt-8">
              {trustBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={badgeVariants}
                  className="flex items-start gap-3 p-3 rounded bg-editorial-cream border border-editorial-charcoal/10 hover:border-editorial-gold/30 transition-colors"
                >
                  <div className="p-2 rounded bg-editorial-charcoal/5 flex-shrink-0 text-editorial-gold">
                    {badge.icon}
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-bold text-editorial-charcoal leading-snug">{badge.title}</h4>
                    <p className="text-[10px] text-editorial-charcoal/60 mt-0.5 font-mono">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Foto real da equipe / trabalho realizado */}
          <div className="lg:col-span-5 relative flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative w-full max-w-sm aspect-[4/5] rounded-3xl shadow-xl overflow-hidden group"
            >
              <img
                src="/hero-equipe.jpg"
                alt="Equipe JC Sinalização atendendo cliente na Moto Vix"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />

              {/* Overlay gradiente suave na base */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"></div>

              {/* Badge laranja no topo */}
              <div className="absolute top-4 right-4 z-10">
                <span className="text-[9px] font-mono font-bold tracking-[0.2em] text-white px-3 py-1 rounded-full bg-editorial-gold border border-white/20 uppercase shadow">
                  Clientes Satisfeitos
                </span>
              </div>

              {/* Caption na base */}
              <div className="absolute bottom-4 left-4 right-4 z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-editorial-gold animate-pulse"></span>
                  <span className="text-[9px] font-mono text-white/70 uppercase tracking-widest">Trabalho realizado</span>
                </div>
                <p className="text-sm font-serif italic text-white leading-snug">
                  Adesivação e uniformes para<br />
                  <span className="font-bold not-italic text-editorial-gold">Moto Vix — Serra, ES</span>
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
