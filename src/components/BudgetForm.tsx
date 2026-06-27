import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, Phone, User, Mail, Building, Plus, Trash2, CheckCircle2, ArrowRight } from 'lucide-react';
import { Product, BudgetItem, BudgetRequest, CompanySettings } from '../types';

interface BudgetFormProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearProducts: () => void;
  settings: CompanySettings;
}

export default function BudgetForm({ selectedProducts, onRemoveProduct, onClearProducts, settings }: BudgetFormProps) {
  // Contact details state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

  // Items in current draft request
  const [items, setItems] = useState<BudgetItem[]>([]);

  // Form submission success states
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState('');

  // Sync prop selectedProducts with internal state
  useEffect(() => {
    const currentProdIds = items.map(i => i.id);
    const newItems = [...items];

    selectedProducts.forEach(prod => {
      if (!currentProdIds.includes(prod.id)) {
        newItems.push({
          id: prod.id,
          name: prod.name,
          category: prod.category,
          quantity: 1,
          observations: ''
        });
      }
    });

    const finalItems = newItems.filter(item => 
      item.id.startsWith('custom-') || selectedProducts.some(p => p.id === item.id)
    );

    setItems(finalItems);
  }, [selectedProducts]);

  // Handle phone format (Brazilian layout: (XX) XXXXX-XXXX)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    } else {
      value = value.replace(/^(\d*)$/, '($1');
    }
    setPhone(value);
  };

  const handleUpdateItem = (index: number, field: keyof BudgetItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const handleAddCustomItem = () => {
    const newItem: BudgetItem = {
      id: `custom-${Date.now()}`,
      name: 'Item Personalizado (Descreva abaixo)',
      category: 'comunicacao',
      quantity: 1,
      observations: ''
    };
    setItems([...items, newItem]);
  };

  const handleRemoveItem = (index: number, itemId: string) => {
    const updated = items.filter((_, i) => i !== index);
    setItems(updated);
    if (!itemId.startsWith('custom-')) {
      onRemoveProduct(itemId);
    }
  };

  const buildWhatsAppMessage = (requestID: string) => {
    let text = `*Solicitação de Orçamento - JC Sinalização & Serigrafia*\n`;
    text += `*ID:* ${requestID}\n`;
    text += `*Cliente:* ${name}\n`;
    if (company) text += `*Empresa:* ${company}\n`;
    text += `*Contato:* ${phone} / ${email}\n\n`;
    text += `*ITENS SOLICITADOS:*\n`;

    items.forEach((item, idx) => {
      text += `\n${idx + 1}. *${item.name}*\n`;
      text += `   - Quantidade: ${item.quantity}\n`;
      if (item.width && item.height) {
        text += `   - Dimensões: ${item.width}cm x ${item.height}cm\n`;
      }
      if (item.observations) {
        text += `   - Observações: ${item.observations}\n`;
      }
    });

    if (notes) {
      text += `\n*Anotações Gerais:* ${notes}\n`;
    }

    return text;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    const requestID = `ORC-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest: BudgetRequest = {
      id: requestID,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      customerCompany: company,
      items: items,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes: notes,
      totalEstimate: 0
    };

    const stored = localStorage.getItem('jc_budgets');
    const budgetsList: BudgetRequest[] = stored ? JSON.parse(stored) : [];
    budgetsList.unshift(newRequest);
    localStorage.setItem('jc_budgets', JSON.stringify(budgetsList));

    window.dispatchEvent(new Event('jc_new_budget_request'));

    // Abre WhatsApp automaticamente ao enviar
    const encoded = encodeURIComponent(buildWhatsAppMessage(requestID));
    window.open(`https://wa.me/${settings.phone}?text=${encoded}`, '_blank');

    setSubmittedId(requestID);
    setIsSubmitted(true);
  };

  const handleWhatsAppSend = () => {
    const encoded = encodeURIComponent(buildWhatsAppMessage(submittedId));
    window.open(`https://wa.me/${settings.phone}?text=${encoded}`, '_blank');
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setSubmittedId('');
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setNotes('');
    setItems([]);
    onClearProducts();
  };

  return (
    <section id="orcamento" className="py-20 bg-editorial-cream border-b border-editorial-charcoal/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-editorial-gold uppercase block mb-3">
            Cotação sem Compromisso
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-editorial-charcoal">
            Solicite seu Orçamento Rápido
          </h2>
          <div className="w-20 h-0.5 bg-editorial-gold mx-auto mt-4"></div>
        </div>

        <AnimatePresence mode="wait">
          {!isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-white border border-editorial-charcoal/10 rounded-xl p-6 sm:p-10 text-left"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Selected Items Block */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-serif font-bold text-editorial-charcoal flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-editorial-gold" />
                      Itens do Orçamento
                    </h3>
                    <button
                      type="button"
                      onClick={handleAddCustomItem}
                      className="flex items-center gap-1.5 text-[9px] font-mono font-bold uppercase tracking-wider text-editorial-charcoal hover:text-white bg-[#F2EFE9] hover:bg-editorial-charcoal px-4 py-2 rounded-full border border-editorial-charcoal/5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Inserir Outro Item
                    </button>
                  </div>

                  {items.length === 0 ? (
                    <div className="text-center py-10 bg-[#FAF9F6] border border-dashed border-editorial-charcoal/15 rounded-xl">
                      <p className="text-xs font-mono text-editorial-charcoal/60">
                        Nenhum produto selecionado. Vá até a nossa <a href="#produtos" className="text-editorial-gold font-bold underline">Vitrine de Produtos</a> acima ou adicione um item customizado.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {items.map((item, index) => (
                        <div
                          key={item.id}
                          className="bg-[#FAF9F6] border border-editorial-charcoal/10 rounded-xl p-4 sm:p-5 relative group transition-all hover:border-editorial-gold/45"
                        >
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(index, item.id)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-editorial-charcoal/40 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                            {/* Item Name / Title */}
                            <div className="md:col-span-6 pr-6">
                              {item.id.startsWith('custom-') ? (
                                <input
                                  type="text"
                                  value={item.name}
                                  onChange={(e) => handleUpdateItem(index, 'name', e.target.value)}
                                  className="w-full text-xs font-bold text-editorial-charcoal border-b border-editorial-charcoal/15 focus:border-editorial-gold focus:outline-none py-1 bg-transparent"
                                  placeholder="Nome do item personalizado"
                                  required
                                />
                              ) : (
                                <h4 className="text-xs font-bold text-editorial-charcoal pr-4">{item.name}</h4>
                              )}
                              <span className="text-[9px] font-mono text-editorial-charcoal/50 uppercase tracking-wider block mt-1">
                                Categoria:{' '}
                                {item.category === 'sinalizacao' ? 'Sinalização' :
                                 item.category === 'serigrafia' ? 'Serigrafia' :
                                 item.category === 'comunicacao' ? 'Comunicação' :
                                 item.category === 'peliculas' ? 'Películas' : 'Adesivos'}
                              </span>
                            </div>

                            {/* Quantity selector */}
                            <div className="md:col-span-2 flex items-center gap-2">
                              <label className="text-[10px] font-mono text-editorial-charcoal/50 md:hidden uppercase">Qtd:</label>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                className="w-16 p-2 text-center text-xs font-mono font-bold border border-editorial-charcoal/15 rounded bg-white focus:border-editorial-gold focus:outline-none"
                              />
                            </div>

                            {/* Width / Height dimensions (Optional) */}
                            <div className="md:col-span-4 flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  placeholder="L"
                                  min="0"
                                  value={item.width || ''}
                                  onChange={(e) => handleUpdateItem(index, 'width', parseFloat(e.target.value) || undefined)}
                                  className="w-14 p-2 text-center text-[10px] font-mono border border-editorial-charcoal/15 rounded bg-white focus:border-editorial-gold focus:outline-none"
                                />
                                <span className="text-[9px] text-editorial-charcoal/40 font-bold font-mono">cm</span>
                              </div>
                              <span className="text-editorial-charcoal/30 text-[10px] font-bold font-mono">x</span>
                              <div className="flex items-center gap-1">
                                <input
                                  type="number"
                                  placeholder="A"
                                  min="0"
                                  value={item.height || ''}
                                  onChange={(e) => handleUpdateItem(index, 'height', parseFloat(e.target.value) || undefined)}
                                  className="w-14 p-2 text-center text-[10px] font-mono border border-editorial-charcoal/15 rounded bg-white focus:border-editorial-gold focus:outline-none"
                                />
                                <span className="text-[9px] text-editorial-charcoal/40 font-bold font-mono">cm</span>
                              </div>
                            </div>
                          </div>

                          {/* Item observations */}
                          <div className="mt-3">
                            <input
                              type="text"
                              placeholder="Adicione observações (ex: Cores, material, acabamento, etc.)"
                              value={item.observations || ''}
                              onChange={(e) => handleUpdateItem(index, 'observations', e.target.value)}
                              className="w-full p-2.5 bg-white border border-editorial-charcoal/10 rounded text-xs text-editorial-charcoal/70 focus:border-editorial-gold focus:outline-none"
                            />
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Customer Contact Details Block */}
                <div className="border-t border-editorial-charcoal/10 pt-8">
                  <h3 className="text-base font-serif font-bold text-editorial-charcoal flex items-center gap-2 mb-6">
                    <User className="w-4.5 h-4.5 text-editorial-gold" />
                    Seus Dados de Contato
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Seu Nome *</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-3.5 w-4 h-4 text-editorial-charcoal/30" />
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="Digite seu nome completo"
                        />
                      </div>
                    </div>

                    {/* Email input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Seu E-mail *</label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-editorial-charcoal/30" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="contato@exemplo.com"
                        />
                      </div>
                    </div>

                    {/* Phone input */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Telefone / WhatsApp *</label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-editorial-charcoal/30" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={handlePhoneChange}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    {/* Company input (optional) */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Nome da Empresa (Opcional)</label>
                      <div className="relative">
                        <Building className="absolute left-3.5 top-3.5 w-4 h-4 text-editorial-charcoal/30" />
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                          placeholder="Sua empresa Ltda."
                        />
                      </div>
                    </div>
                  </div>

                  {/* General notes input */}
                  <div className="space-y-1 mt-4">
                    <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-editorial-charcoal/70">Observações Gerais / Detalhes Adicionais</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full p-4 bg-white border border-editorial-charcoal/15 rounded text-xs focus:border-editorial-gold focus:outline-none"
                      placeholder="Descreva prazos especiais de entrega, endereço de entrega se houver ou outras necessidades para o projeto..."
                    />
                  </div>
                </div>

                {/* Form submit button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={items.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-editorial-charcoal hover:bg-editorial-gold text-white font-bold text-xs uppercase tracking-widest rounded-full shadow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    Enviar Solicitação de Orçamento
                  </button>
                </div>

              </form>
            </motion.div>
          ) : (
            // Success response message panel
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FAF9F6] border border-editorial-charcoal/10 rounded-xl p-8 sm:p-12 text-center max-w-2xl mx-auto"
            >
              <div className="w-14 h-14 bg-editorial-charcoal text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow">
                <CheckCircle2 className="w-8 h-8 text-editorial-gold" />
              </div>

              <h3 className="text-2xl font-serif font-bold text-editorial-charcoal mb-2">
                Solicitação Recebida com Sucesso!
              </h3>
              <p className="text-xs font-mono text-editorial-charcoal bg-[#F2EFE9] inline-block px-3 py-1 rounded font-bold mb-6">
                Código do Orçamento: {submittedId}
              </p>

              <p className="text-xs text-editorial-charcoal/80 leading-relaxed mb-8 max-w-md mx-auto">
                Sua solicitação foi registrada e o WhatsApp já foi aberto com todos os detalhes prontos para enviar.
                Caso a janela não tenha aberto, clique no botão abaixo para tentar novamente.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleWhatsAppSend}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-full shadow transition-all cursor-pointer"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.388 1.981 13.93 1.95 12.01 1.95c-5.434 0-9.858 4.37-9.863 9.8-.001 1.77.462 3.5 1.34 5.024l-1.022 3.73 3.837-.993a9.71 9.71 0 0 0 4.755 1.243z" />
                  </svg>
                  Abrir WhatsApp Novamente
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleReset}
                  className="px-6 py-3.5 bg-white text-editorial-charcoal hover:bg-[#F2EFE9] font-bold text-xs uppercase tracking-wider rounded-full border border-editorial-charcoal/15 transition-all cursor-pointer"
                >
                  Solicitar Outro Orçamento
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
