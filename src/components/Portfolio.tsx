import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Images, ChevronLeft, ChevronRight } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
}

export default function Portfolio({ items }: PortfolioProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = activeCategory === 'Todos' ? items : items.filter(i => i.category === activeCategory);

  const selectedItem = selectedIndex !== null ? filtered[selectedIndex] : null;

  const handlePrev = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === 0 ? filtered.length - 1 : selectedIndex - 1);
  };

  const handleNext = () => {
    if (selectedIndex === null) return;
    setSelectedIndex(selectedIndex === filtered.length - 1 ? 0 : selectedIndex + 1);
  };

  return (
    <section id="portfolio" className="py-20 bg-editorial-cream border-b border-editorial-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase mb-3">
            Trabalhos Realizados
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-editorial-charcoal leading-tight">
            Portfólio
          </h2>
          <div className="w-16 h-0.5 bg-editorial-gold mx-auto mt-4 mb-4"></div>
          <p className="text-sm text-editorial-charcoal/70 leading-relaxed">
            Alguns dos projetos entregues com qualidade e dentro do prazo. Clique em qualquer foto para ampliar.
          </p>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-editorial-charcoal text-white'
                  : 'bg-[#F2EFE9] text-editorial-charcoal/70 hover:text-editorial-charcoal border border-editorial-charcoal/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-editorial-charcoal/40">
            <Images className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-mono">Nenhuma foto nesta categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((item, i) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04, duration: 0.3 }}
                  onClick={() => setSelectedIndex(i)}
                  className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-editorial-bg-alt"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-editorial-charcoal/0 group-hover:bg-editorial-charcoal/50 transition-all duration-300 flex items-center justify-center">
                    <ZoomIn className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className="px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-white bg-editorial-charcoal/80 rounded-sm">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedItem && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
            onClick={() => setSelectedIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={e => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[90vh] rounded-2xl overflow-hidden bg-editorial-charcoal shadow-2xl"
            >
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full max-h-[70vh] object-contain"
              />
              <div className="p-4">
                <p className="text-[9px] font-mono font-bold text-editorial-gold uppercase tracking-widest mb-1">{selectedItem.category}</p>
                <h3 className="text-sm font-serif font-bold text-white">{selectedItem.title}</h3>
                {selectedItem.description && (
                  <p className="text-xs text-white/55 mt-1">{selectedItem.description}</p>
                )}
              </div>

              {/* Fechar */}
              <button
                onClick={() => setSelectedIndex(null)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Navegação prev/next */}
              {filtered.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 cursor-pointer transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-[72px] left-0 right-0 flex justify-center">
                    <span className="text-[9px] font-mono text-white/40">{selectedIndex + 1} / {filtered.length}</span>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
