import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, PlusCircle, Check } from 'lucide-react';
import { Product } from '../types';

interface ShowcaseProps {
  products: Product[];
  onAddToBudget: (product: Product) => void;
  addedProductIds: string[];
}

export default function Showcase({ products, onAddToBudget, addedProductIds }: ShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Todos' },
    { id: 'sinalizacao', label: 'Sinalização' },
    { id: 'serigrafia', label: 'Serigrafia / Silk' },
    { id: 'comunicacao', label: 'Comunicação Visual' },
    { id: 'adesivos', label: 'Adesivos & Rótulos' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="produtos" className="py-20 bg-editorial-cream border-b border-editorial-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase mb-3">
            Vitrine Virtual de Serviços
          </p>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-editorial-charcoal leading-[1.1]">
            Nossos Principais Produtos
          </h2>
          <div className="w-20 h-0.5 bg-editorial-gold mx-auto mt-4 mb-6"></div>
          <p className="text-editorial-charcoal/70 text-sm sm:text-base leading-relaxed">
            Selecione e explore os itens abaixo. Você pode adicionar quantos itens quiser à sua solicitação de orçamento em tempo real para obter uma cotação exata e personalizada.
          </p>
        </div>

        {/* Categories Navigation Bar - Refined Editorial Style */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-editorial-charcoal text-white shadow-sm'
                  : 'bg-[#F2EFE9] text-editorial-charcoal/80 hover:text-editorial-charcoal hover:bg-editorial-accent-bg border border-editorial-charcoal/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => {
              const isAdded = addedProductIds.includes(product.id);
              
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={product.id}
                  className="bg-white border border-editorial-charcoal/10 rounded-xl overflow-hidden flex flex-col hover:border-editorial-gold transition-colors duration-300 group text-left"
                >
                  {/* Product Image Panel */}
                  <div className="relative aspect-video overflow-hidden bg-editorial-bg-alt">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale hover:grayscale-0"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-2.5 py-1 text-[8px] font-mono font-bold uppercase tracking-widest text-white bg-editorial-charcoal/90 rounded-sm">
                        {product.category === 'sinalizacao' ? 'Sinalização' :
                         product.category === 'serigrafia' ? 'Serigrafia' :
                         product.category === 'comunicacao' ? 'Comunicação' : 'Adesivos'}
                      </span>
                    </div>
                  </div>

                  {/* Product Details Panel */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-serif font-bold text-editorial-charcoal group-hover:text-editorial-gold transition-colors leading-snug mb-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-editorial-charcoal/70 leading-relaxed mb-4">
                        {product.description}
                      </p>

                      {/* Product Specifications with custom gold bullet points */}
                      <div className="space-y-1.5 mb-5">
                        {product.features.slice(0, 3).map((feat, index) => (
                          <div key={index} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-editorial-gold flex-shrink-0"></span>
                            <span className="text-[11px] text-editorial-charcoal/85 font-medium truncate">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Section */}
                    <div>
                      <div className="border-t border-editorial-charcoal/10 pt-4 mt-2 flex flex-col gap-3">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[9px] font-mono text-editorial-charcoal/40 uppercase tracking-widest">Preço Sugerido:</span>
                          <span className="text-xs font-mono font-bold text-editorial-charcoal">{product.priceEstimate || 'Sob medida'}</span>
                        </div>

                        <button
                          onClick={() => onAddToBudget(product)}
                          className={`w-full flex items-center justify-center gap-2 py-3 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer ${
                            isAdded
                              ? 'bg-[#E5E2D9] text-editorial-charcoal border border-editorial-charcoal/20'
                              : 'bg-editorial-charcoal text-white hover:bg-editorial-gold'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-editorial-charcoal" />
                              Item no Orçamento
                            </>
                          ) : (
                            <>
                              <PlusCircle className="w-3.5 h-3.5" />
                              Adicionar ao Orçamento
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Quick Question Panel styled beautifully as a quote-testimonial style banner */}
        <div className="mt-16 bg-[#F2EFE9] border-l-4 border-editorial-gold p-6 sm:p-8 rounded-r-xl flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex gap-4 items-start text-left">
            <div className="p-3 bg-editorial-charcoal/5 rounded-full flex-shrink-0 text-editorial-gold hidden sm:block">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-serif italic font-bold text-editorial-charcoal">Não encontrou o tamanho ou material exato?</h4>
              <p className="text-xs text-editorial-charcoal/70 mt-1 max-w-xl">
                Nós trabalhamos com projetos 100% personalizados, corte a laser, formatos customizados e grande volume. Descreva sua necessidade diretamente no formulário de cotação abaixo!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('orcamento');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-editorial-charcoal hover:bg-editorial-gold text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full cursor-pointer whitespace-nowrap transition-colors"
          >
            Fazer Cotação Especial
          </button>
        </div>

      </div>
    </section>
  );
}
