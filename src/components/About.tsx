import React from 'react';
import { motion } from 'motion/react';
import { Award, Clock, Ruler, ShieldCheck } from 'lucide-react';

export default function About() {
  const differentials = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: 'Normas Técnicas',
      desc: 'Sinalização produzida em conformidade com ABNT NBR 13434 e CIPA, garantindo aprovação em vistorias do Corpo de Bombeiros.'
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Entrega Ágil',
      desc: 'Produção própria em Serra-ES. Sem depender de terceiros, entregamos com agilidade e qualidade do início ao fim.'
    },
    {
      icon: <Ruler className="w-5 h-5" />,
      title: '100% Personalizado',
      desc: 'Sem tamanhos fixos. Cada projeto é desenvolvido com as medidas, o material e a necessidade específica de cada cliente.'
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: 'Atendimento Direto',
      desc: 'Você fala diretamente com quem produz. Sem intermediários, sem retrabalho, sem surpresas no resultado final.'
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-white border-b border-editorial-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Coluna de texto */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase mb-3">
              Quem Somos
            </p>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-editorial-charcoal leading-tight mb-4">
              Especialistas em sinalização e comunicação visual
            </h2>
            <div className="w-16 h-0.5 bg-editorial-gold mb-6"></div>
            <p className="text-sm text-editorial-charcoal/70 leading-relaxed mb-4">
              A <strong>JC Sinalização e Serigrafia</strong> está localizada em Serra, Espírito Santo, no Centro Comercial Planalto — e atende toda a Grande Vitória com produção própria e atendimento personalizado.
            </p>
            <p className="text-sm text-editorial-charcoal/70 leading-relaxed mb-8">
              Somos especialistas em <strong>placas de sinalização de segurança</strong> conforme as normas técnicas ABNT, em <strong>serigrafia e silk-screen</strong> para uniformes e vestuário corporativo, <strong>comunicação visual</strong> para frotas, fachadas e eventos — e contamos com uma linha completa de <strong>películas solares e decorativas</strong> para residências e comércio.
            </p>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-editorial-charcoal/10">
              {[
                { value: '10+', label: 'Anos no mercado' },
                { value: '500+', label: 'Clientes atendidos' },
                { value: '100%', label: 'Produção própria' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-serif font-bold text-editorial-gold">{stat.value}</div>
                  <div className="text-[10px] text-editorial-charcoal/55 font-mono uppercase tracking-wider mt-1 leading-tight">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Grid de diferenciais */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {differentials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, duration: 0.4 }}
                className="p-5 bg-editorial-cream border border-editorial-charcoal/10 rounded-xl hover:border-editorial-gold/40 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-editorial-gold/10 flex items-center justify-center text-editorial-gold mb-3 group-hover:bg-editorial-gold group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <h4 className="text-sm font-serif font-bold text-editorial-charcoal mb-1.5">{item.title}</h4>
                <p className="text-xs text-editorial-charcoal/65 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
