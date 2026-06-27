import React from 'react';
import { motion } from 'motion/react';
import { Search, ClipboardList, Package } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: <Search className="w-6 h-6" />,
      title: 'Escolha o produto',
      desc: 'Navegue pela vitrine de produtos e serviços. Encontrou o que precisa? Clique em "Adicionar ao Orçamento" — você pode incluir quantos itens quiser na mesma solicitação.'
    },
    {
      number: '02',
      icon: <ClipboardList className="w-6 h-6" />,
      title: 'Solicite o orçamento',
      desc: 'Preencha o formulário com seus dados, quantidades, medidas e detalhes do projeto. A solicitação vai direto para o nosso WhatsApp — sem burocracia e sem espera.'
    },
    {
      number: '03',
      icon: <Package className="w-6 h-6" />,
      title: 'Produção e entrega',
      desc: 'Aprovado o orçamento, iniciamos a produção imediatamente. Entregamos em toda a Grande Vitória ou você retira na nossa loja em Serra-ES.'
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-editorial-charcoal text-white border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase mb-3">
            Processo Simples
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold leading-tight">
            Como funciona o orçamento
          </h2>
          <div className="w-16 h-0.5 bg-editorial-gold mx-auto mt-4 mb-4"></div>
          <p className="text-sm text-white/55 leading-relaxed">
            Do primeiro clique à entrega — três passos, sem ligações desnecessárias e sem formulários complicados.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Linha de conexão entre os cards (só desktop) */}
          <div className="absolute top-12 left-[calc(33%+3rem)] right-[calc(33%+3rem)] h-px bg-editorial-gold/20 hidden md:block"></div>

          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative text-center"
            >
              <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-editorial-gold/10 border border-editorial-gold/20 mb-6 mx-auto hover:bg-editorial-gold/20 transition-colors">
                <div className="text-editorial-gold">
                  {step.icon}
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-editorial-gold text-[10px] font-mono font-bold text-editorial-charcoal flex items-center justify-center">
                  {step.number}
                </span>
              </div>

              <h3 className="text-lg font-serif font-bold text-white mb-3">{step.title}</h3>
              <p className="text-sm text-white/55 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => {
              const el = document.getElementById('produtos');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-4 bg-editorial-gold text-white hover:brightness-110 font-bold text-xs tracking-widest uppercase rounded-full shadow-lg transition-all cursor-pointer"
          >
            Ver todos os produtos e serviços
          </button>
        </div>

      </div>
    </section>
  );
}
