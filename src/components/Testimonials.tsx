import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, Check, X, ShieldCheck } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onAddTestimonial?: (newTest: Omit<Testimonial, 'approved' | 'id' | 'createdAt'>) => void;
}

export default function Testimonials({ testimonials: initialTestimonials, onAddTestimonial }: TestimonialsProps) {
  const [list, setList] = useState<Testimonial[]>(initialTestimonials);
  const [showForm, setShowForm] = useState(false);

  // New testimonial states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // Synchronize initial prop data with localStorage
  useEffect(() => {
    const cached = localStorage.getItem('jc_testimonials');
    if (cached) {
      setList(JSON.parse(cached));
    } else {
      setList(initialTestimonials);
      localStorage.setItem('jc_testimonials', JSON.stringify(initialTestimonials));
    }
  }, [initialTestimonials]);

  // Handle new testimonial registration
  useEffect(() => {
    const handleUpdate = () => {
      const cached = localStorage.getItem('jc_testimonials');
      if (cached) {
        setList(JSON.parse(cached));
      }
    };
    window.addEventListener('jc_new_testimonial_added', handleUpdate);
    return () => window.removeEventListener('jc_new_testimonial_added', handleUpdate);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;

    const companyStr = company ? (role ? `${role} na ${company}` : company) : 'Cliente Particular';

    if (onAddTestimonial) {
      onAddTestimonial({
        name: name,
        company: companyStr,
        rating: rating,
        comment: text
      });
    } else {
      const newTestimonial: Testimonial = {
        id: `test-${Date.now()}`,
        name: name,
        company: companyStr,
        rating: rating,
        comment: text,
        approved: true,
        createdAt: new Date().toLocaleDateString('pt-BR')
      };

      const updatedList = [newTestimonial, ...list];
      setList(updatedList);
      localStorage.setItem('jc_testimonials', JSON.stringify(updatedList));
      window.dispatchEvent(new Event('jc_new_testimonial_added'));
    }

    // Reset form states
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setShowForm(false);
      setName('');
      setCompany('');
      setRole('');
      setRating(5);
      setText('');
    }, 2000);
  };

  return (
    <section id="depoimentos" className="py-20 bg-[#FAF9F6] border-b border-editorial-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6 text-left">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase block mb-3">
              Satisfação Comprovada
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-editorial-charcoal leading-tight">
              O que dizem nossos clientes
            </h2>
            <div className="w-20 h-0.5 bg-editorial-gold mt-4"></div>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-editorial-charcoal hover:bg-editorial-gold text-white font-mono text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors cursor-pointer self-start"
          >
            <Plus className="w-4 h-4" />
            Deixar Depoimento
          </button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {list.filter(t => t.approved).map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#F2EFE9] border border-editorial-charcoal/10 rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-editorial-gold/45 transition-colors relative group text-left"
            >
              {/* Star Rating Panel */}
              <div className="flex items-center gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < testimonial.rating
                        ? 'fill-editorial-gold text-editorial-gold'
                        : 'text-editorial-charcoal/15'
                    }`}
                  />
                ))}
              </div>

              {/* Quote Description Text */}
              <blockquote className="text-xs sm:text-sm text-editorial-charcoal/80 leading-relaxed font-serif italic mb-6">
                "{testimonial.comment}"
              </blockquote>

              {/* Author details */}
              <div className="border-t border-editorial-charcoal/10 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-serif font-bold text-editorial-charcoal">
                    {testimonial.name}
                  </h4>
                  <p className="text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-wider mt-0.5">
                    {testimonial.company || 'Cliente'}
                  </p>
                </div>
                
                <span className="text-[8px] font-mono text-editorial-charcoal/40 font-bold uppercase tracking-wider">
                  {testimonial.createdAt || 'Recente'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Floating Modal for submitting testimonials */}
        <AnimatePresence>
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-editorial-charcoal/40 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="bg-white border border-editorial-charcoal/10 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl relative text-left"
              >
                {/* Modal Header */}
                <div className="bg-[#F2EFE9] px-6 py-4 border-b border-editorial-charcoal/10 flex justify-between items-center">
                  <h3 className="text-sm font-serif font-bold text-editorial-charcoal flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-editorial-gold" />
                    Enviar Depoimento Comercial
                  </h3>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-1 rounded-full text-editorial-charcoal/50 hover:bg-editorial-charcoal/5 transition-colors cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                {/* Success Screen */}
                {isSuccess ? (
                  <div className="p-8 text-center space-y-4">
                    <div className="w-12 h-12 bg-editorial-charcoal text-white rounded-full flex items-center justify-center mx-auto shadow">
                      <Check className="w-6 h-6 text-editorial-gold" />
                    </div>
                    <h4 className="text-base font-serif font-bold text-editorial-charcoal">Muito obrigado!</h4>
                    <p className="text-xs text-editorial-charcoal/70 max-w-sm mx-auto">
                      Seu depoimento foi enviado e registrado com sucesso em nosso painel administrativo de controle!
                    </p>
                  </div>
                ) : (
                  // Testimonial submission form
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Seu Nome *</label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full p-2.5 bg-[#FAF9F6] border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="Ex: João da Silva"
                        />
                      </div>

                      {/* Company input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Empresa / Negócio</label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full p-2.5 bg-[#FAF9F6] border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="Ex: Alfa Transportes"
                        />
                      </div>

                      {/* Role input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Seu Cargo</label>
                        <input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="w-full p-2.5 bg-[#FAF9F6] border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="Ex: Gerente de Compras"
                        />
                      </div>

                      {/* Rating selection */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Sua Nota *</label>
                        <div className="flex items-center gap-1.5 h-10">
                          {[1, 2, 3, 4, 5].map((val) => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setRating(val)}
                              className="p-1 rounded hover:bg-[#F2EFE9] transition-colors cursor-pointer"
                            >
                              <Star
                                className={`w-5 h-5 ${
                                  val <= rating
                                    ? 'fill-editorial-gold text-editorial-gold'
                                    : 'text-editorial-charcoal/15'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Text area description */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Seu Depoimento *</label>
                      <textarea
                        required
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full p-3.5 bg-[#FAF9F6] border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                        placeholder="Conte-nos como foi sua experiência com nossos prazos de entrega, atendimento técnico, ou qualidade do material..."
                      />
                    </div>

                    {/* Submit action buttons */}
                    <div className="pt-2 border-t border-editorial-charcoal/10 flex justify-end gap-3 text-xs">
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="px-5 py-2.5 bg-[#F2EFE9] text-editorial-charcoal hover:bg-[#E5E2D9] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-editorial-charcoal hover:bg-editorial-gold text-white font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
                      >
                        Enviar Avaliação
                      </button>
                    </div>

                    <div className="flex gap-2 items-center text-[10px] font-mono text-editorial-charcoal/50 uppercase tracking-widest mt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-editorial-gold" />
                      <span>Sua opinião será exibida publicamente na vitrine</span>
                    </div>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
