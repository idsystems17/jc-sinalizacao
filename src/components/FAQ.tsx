import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle } from 'lucide-react';

const faqs = [
  {
    question: 'Qual é o prazo médio de entrega?',
    answer: 'Depende do produto e da quantidade. Placas de sinalização e banners simples costumam ficar prontos em 2 a 3 dias úteis. Serigrafia em camisetas e adesivos especiais levam em média 5 a 7 dias úteis. Para projetos grandes ou urgentes, entre em contato pelo WhatsApp para uma previsão exata.'
  },
  {
    question: 'A sinalização está em conformidade com as normas ABNT e Corpo de Bombeiros?',
    answer: 'Sim. Todas as placas de sinalização de segurança são produzidas em conformidade com a ABNT NBR 13434 (sinalização de segurança contra incêndio e pânico). Emitimos declaração de conformidade quando solicitado, facilitando vistorias do Corpo de Bombeiros e CIPA.'
  },
  {
    question: 'Qual é o pedido mínimo para serigrafia?',
    answer: 'Para camisetas e uniformes em silk-screen, o pedido mínimo é de 10 a 20 peças, dependendo do modelo e do número de cores. Para sacolas e outros itens, o mínimo pode variar. Consulte-nos pelo WhatsApp para seu caso específico.'
  },
  {
    question: 'Vocês fazem entrega fora de Serra/ES?',
    answer: 'Sim! Entregamos em toda a Grande Vitória (Vitória, Vila Velha, Cariacica, Viana, Guarapari). Para outras regiões do ES e Brasil, podemos enviar via transportadora — o frete é cotado separadamente.'
  },
  {
    question: 'Como funciona o orçamento?',
    answer: 'Simples: escolha os produtos na vitrine, clique em "Adicionar ao Orçamento" e preencha o formulário com seus dados, quantidades e detalhes. A solicitação vai direto para o nosso WhatsApp e retornamos com o valor em poucas horas no horário comercial.'
  },
  {
    question: 'Posso personalizar tamanho, cor e material?',
    answer: 'Totalmente. Trabalhamos com medidas customizadas, sem tamanhos fixos. Você define o tamanho, o material (PVC, ACM, acrílico, lona, vinil etc.) e a quantidade. Nossa equipe orienta sobre o material mais adequado para cada aplicação.'
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos Pix, dinheiro e transferência bancária. Para pedidos corporativos e de maior volume, consulte sobre parcelamento. O pagamento é combinado diretamente pelo WhatsApp após aprovação do orçamento.'
  },
  {
    question: 'Vocês trabalham com grandes volumes?',
    answer: 'Sim. Atendemos desde o cliente avulso que precisa de uma placa até empresas e construtoras que precisam de kits completos de sinalização, uniformes para equipes ou adesivação de frotas inteiras. Quanto maior o volume, melhor o preço unitário.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-20 bg-white border-b border-editorial-charcoal/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase mb-3">
            Dúvidas Frequentes
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-editorial-charcoal leading-tight">
            Perguntas frequentes
          </h2>
          <div className="w-16 h-0.5 bg-editorial-gold mx-auto mt-4"></div>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
              className="border border-editorial-charcoal/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left bg-editorial-cream hover:bg-editorial-accent-bg transition-colors cursor-pointer gap-4"
              >
                <span className="text-sm font-serif font-bold text-editorial-charcoal leading-snug pr-4">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 text-editorial-gold"
                >
                  <ChevronDown className="w-5 h-5" />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 pt-3 bg-white border-t border-editorial-charcoal/5">
                      <p className="text-sm text-editorial-charcoal/70 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA no final */}
        <div className="mt-12 p-6 bg-editorial-cream border-l-4 border-editorial-gold rounded-r-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-3 items-start">
            <MessageCircle className="w-5 h-5 text-editorial-gold flex-shrink-0 mt-0.5" />
            <p className="text-sm text-editorial-charcoal/80 leading-relaxed">
              Ainda tem dúvidas? Fale diretamente com nossa equipe pelo WhatsApp — respondemos no horário comercial.
            </p>
          </div>
          <button
            onClick={() => {
              const el = document.getElementById('contato');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-6 py-3 bg-editorial-charcoal hover:bg-editorial-gold text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full cursor-pointer whitespace-nowrap transition-colors"
          >
            Falar com a equipe
          </button>
        </div>

      </div>
    </section>
  );
}
