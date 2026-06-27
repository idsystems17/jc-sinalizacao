import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  FileText,
  ShoppingBag,
  MessageSquare,
  Settings,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Plus,
  Save,
  DollarSign,
  Check,
  X,
  RefreshCw,
  PhoneCall,
  LogOut,
  Images,
  Pencil
} from 'lucide-react';
import { BudgetRequest, Product, Testimonial, CompanySettings, PortfolioItem } from '../types';

interface AdminPanelProps {
  products: Product[];
  onUpdateProducts: (prods: Product[]) => void;
  testimonials: Testimonial[];
  onUpdateTestimonials: (tests: Testimonial[]) => void;
  portfolioItems: PortfolioItem[];
  onUpdatePortfolio: (items: PortfolioItem[]) => void;
  settings: CompanySettings;
  onUpdateSettings: (set: CompanySettings) => void;
  onLogout: () => void;
}

export default function AdminPanel({
  products,
  onUpdateProducts,
  testimonials,
  onUpdateTestimonials,
  portfolioItems,
  onUpdatePortfolio,
  settings,
  onUpdateSettings,
  onLogout
}: AdminPanelProps) {

  // Tab states
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budgets' | 'catalog' | 'portfolio' | 'testimonials' | 'settings'>('dashboard');

  // Budget requests local state
  const [budgets, setBudgets] = useState<BudgetRequest[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<BudgetRequest | null>(null);
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [budgetSearch, setBudgetSearch] = useState<string>('');
  
  // Custom price input for active budget cotação
  const [customPrice, setCustomPrice] = useState<string>('');

  // Catalog manager state
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<Product['category']>('sinalizacao');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdFeatures, setNewProdFeatures] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');

  // Edit product state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdCategory, setEditProdCategory] = useState<Product['category']>('sinalizacao');
  const [editProdDesc, setEditProdDesc] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdFeatures, setEditProdFeatures] = useState('');
  const [editProdPrice, setEditProdPrice] = useState('');

  // Portfolio manager state
  const [isAddingPortfolioItem, setIsAddingPortfolioItem] = useState(false);
  const [newPortTitle, setNewPortTitle] = useState('');
  const [newPortCategory, setNewPortCategory] = useState('');
  const [newPortImage, setNewPortImage] = useState('');
  const [newPortDesc, setNewPortDesc] = useState('');

  // Settings manager state
  const [editPhone, setEditPhone] = useState(settings.phone);
  const [editPhoneFormatted, setEditPhoneFormatted] = useState(settings.phoneFormatted);
  const [editPhoneLandline, setEditPhoneLandline] = useState(settings.phoneLandline || '');
  const [editEmail, setEditEmail] = useState(settings.email);
  const [editAddress, setEditAddress] = useState(settings.address);
  const [editHours, setEditHours] = useState(settings.hours);
  const [editInstagram, setEditInstagram] = useState(settings.instagram);
  const [editFacebook, setEditFacebook] = useState(settings.facebook);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sync / load budgets from localstorage
  const loadBudgetsFromStorage = () => {
    const stored = localStorage.getItem('jc_budgets');
    if (stored) {
      setBudgets(JSON.parse(stored));
    } else {
      setBudgets([]);
    }
  };

  useEffect(() => {
    loadBudgetsFromStorage();

    // Listen for custom new budget events
    const handleNewRequest = () => {
      loadBudgetsFromStorage();
    };

    window.addEventListener('jc_new_budget_request', handleNewRequest);
    return () => window.removeEventListener('jc_new_budget_request', handleNewRequest);
  }, []);

  // Update a single budget request status
  const handleUpdateBudgetStatus = (budgetId: string, newStatus: BudgetRequest['status'], updateEstimate?: number) => {
    const updated = budgets.map(b => {
      if (b.id === budgetId) {
        return { 
          ...b, 
          status: newStatus,
          totalEstimate: updateEstimate !== undefined ? updateEstimate : b.totalEstimate
        };
      }
      return b;
    });
    setBudgets(updated);
    localStorage.setItem('jc_budgets', JSON.stringify(updated));
    
    // Sync current selected details if open
    if (selectedBudget?.id === budgetId) {
      setSelectedBudget({
        ...selectedBudget,
        status: newStatus,
        totalEstimate: updateEstimate !== undefined ? updateEstimate : selectedBudget.totalEstimate
      });
    }
  };

  // Delete/Archive a budget request
  const handleDeleteBudget = (budgetId: string) => {
    if (!window.confirm('Deseja realmente arquivar/deletar essa solicitação?')) return;
    const filtered = budgets.filter(b => b.id !== budgetId);
    setBudgets(filtered);
    localStorage.setItem('jc_budgets', JSON.stringify(filtered));
    if (selectedBudget?.id === budgetId) {
      setSelectedBudget(null);
    }
  };

  // Format professional WhatsApp message for a budget quote response
  const handleSendResponseWhatsApp = (budget: BudgetRequest) => {
    const total = budget.totalEstimate && budget.totalEstimate > 0 
      ? `R$ ${budget.totalEstimate.toFixed(2)}`
      : 'sob análise';

    let text = `*JC Sinalização & Serigrafia - Resposta de Orçamento*\n\n`;
    text += `Olá, *${budget.customerName}*!\n`;
    text += `Estamos entrando em contato sobre a sua solicitação de orçamento *${budget.id}*.\n\n`;
    text += `*Valor Estimado total:* ${total}\n\n`;
    text += `*Itens avaliados:*\n`;
    
    budget.items.forEach((item, index) => {
      text += `- ${item.quantity}x ${item.name} ${item.width ? `(${item.width}x${item.height}cm)` : ''}\n`;
    });

    text += `\nNossa equipe técnica já reservou o seu pedido. Gostaria de confirmar a produção e agendar a entrega?\n`;
    
    // Clean telephone for WhatsApp link
    const cleanPhone = budget.customerPhone.replace(/\D/g, '');
    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Catalog Product actions
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdDesc) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc,
      image: newProdImage || 'https://images.unsplash.com/photo-1572375995301-40164e323067?auto=format&fit=crop&q=80&w=600',
      priceEstimate: newProdPrice || 'Sob consulta',
      features: newProdFeatures.split('\n').filter(f => f.trim() !== '')
    };

    const updated = [newProd, ...products];
    onUpdateProducts(updated);

    // Reset fields
    setNewProdName('');
    setNewProdCategory('sinalizacao');
    setNewProdDesc('');
    setNewProdImage('');
    setNewProdFeatures('');
    setNewProdPrice('');
    setIsAddingProduct(false);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!window.confirm('Tem certeza de que deseja remover este produto da vitrine?')) return;
    const filtered = products.filter(p => p.id !== productId);
    onUpdateProducts(filtered);
  };

  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setEditProdName(prod.name);
    setEditProdCategory(prod.category);
    setEditProdDesc(prod.description);
    setEditProdImage(prod.image);
    setEditProdFeatures(prod.features.join('\n'));
    setEditProdPrice(prod.priceEstimate || '');
    setIsAddingProduct(false);
  };

  const handleSaveEditProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = products.map(p => {
      if (p.id !== editingProductId) return p;
      return {
        ...p,
        name: editProdName,
        category: editProdCategory,
        description: editProdDesc,
        image: editProdImage,
        priceEstimate: editProdPrice || 'Sob consulta',
        features: editProdFeatures.split('\n').filter(f => f.trim() !== '')
      };
    });
    onUpdateProducts(updated);
    setEditingProductId(null);
  };

  // Testimonial Approval Actions
  const handleApproveTestimonial = (id: string) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, approved: true } : t);
    onUpdateTestimonials(updated);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!window.confirm('Deseja excluir permanentemente este depoimento?')) return;
    const filtered = testimonials.filter(t => t.id !== id);
    onUpdateTestimonials(filtered);
  };

  // Save Company settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSettings: CompanySettings = {
      ...settings,
      phone: editPhone,
      phoneFormatted: editPhoneFormatted,
      phoneLandline: editPhoneLandline,
      email: editEmail,
      address: editAddress,
      hours: editHours,
      instagram: editInstagram,
      facebook: editFacebook
    };

    onUpdateSettings(updatedSettings);
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  // Helper values for Dashboard Analytics Metrics
  const totalReceivedCount = budgets.length;
  const pendingCount = budgets.filter(b => b.status === 'pending').length;
  const underReviewCount = budgets.filter(b => b.status === 'review').length;
  const completedCount = budgets.filter(b => b.status === 'completed').length;
  const approvedValue = budgets
    .filter(b => b.status === 'approved' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalEstimate || 0), 0);

  // Filtered Budgets based on controls
  const filteredBudgets = budgets.filter(b => {
    const matchesFilter = budgetFilter === 'all' ? true : b.status === budgetFilter;
    const searchStr = `${b.customerName} ${b.id} ${b.customerCompany || ''}`.toLowerCase();
    const matchesSearch = searchStr.includes(budgetSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="pt-24 min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row">
      
      {/* Sidebar Controls Panel */}
      <aside className="w-full md:w-64 bg-editorial-charcoal text-white flex-shrink-0 text-left border-r border-editorial-charcoal/10 flex flex-col justify-between">
        <div className="p-6">
          <div className="mb-8 border-b border-white/10 pb-4">
            <span className="text-[10px] font-mono tracking-[0.2em] text-editorial-gold uppercase font-bold block">
              Painel Corporativo
            </span>
            <h2 className="text-lg font-serif italic text-white mt-1">JC SINALIZAÇÃO</h2>
            <p className="text-[10px] text-white/50 font-mono tracking-wide uppercase mt-1">Sistema de Gestão Ativo</p>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'dashboard' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <BarChart3 className="w-4.5 h-4.5" />
              Visão Geral
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'budgets' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <FileText className="w-4.5 h-4.5" />
                Orçamentos
              </span>
              {pendingCount > 0 && (
                <span className="bg-editorial-gold text-editorial-charcoal font-bold text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                  {pendingCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'catalog' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <ShoppingBag className="w-4.5 h-4.5" />
              Gerenciar Vitrine
            </button>

            <button
              onClick={() => setActiveTab('portfolio')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'portfolio' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Images className="w-4.5 h-4.5" />
              Portfólio
            </button>

            <button
              onClick={() => setActiveTab('testimonials')}
              className={`w-full flex items-center justify-between px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'testimonials' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <MessageSquare className="w-4.5 h-4.5" />
                Depoimentos
              </span>
              {testimonials.filter(t => !t.approved).length > 0 && (
                <span className="bg-editorial-gold text-editorial-charcoal font-bold text-[10px] px-2 py-0.5 rounded-full">
                  {testimonials.filter(t => !t.approved).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-editorial-gold text-white' : 'text-white/70 hover:bg-white/5'
              }`}
            >
              <Settings className="w-4.5 h-4.5" />
              Configurações
            </button>
          </nav>
        </div>

        {/* Footer: status + logout */}
        <div className="p-4 bg-black/40 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider text-white/50">
            <div className="w-2 h-2 rounded-full bg-editorial-gold animate-pulse"></div>
            <span>Sessão Ativa — {sessionStorage.getItem('jc_auth_user') || 'admin'}</span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-white/50 hover:text-red-400 text-[10px] font-mono uppercase tracking-wider transition-all cursor-pointer border border-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair do Painel
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 sm:p-10 overflow-y-auto max-w-7xl mx-auto w-full text-left">
        
        {/* TAB 1: VISÃO GERAL (DASHBOARD) */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header banner */}
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Painel de Métricas em Tempo Real</h1>
              <p className="text-sm text-gray-500 mt-1">Acompanhe novos orçamentos, faturamento potencial e feedbacks de clientes.</p>
            </div>

            {/* Metrics block cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="p-4 rounded-xl bg-orange-50 text-[#FF4500]">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Novos Pedidos</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">{pendingCount} pendentes</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="p-4 rounded-xl bg-amber-50 text-[#FFB100]">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Em Análise</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">{underReviewCount} em cotação</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="p-4 rounded-xl bg-green-50 text-emerald-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Faturamento Fechado</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">R$ {approvedValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5">
                <div className="p-4 rounded-xl bg-blue-50 text-blue-600">
                  <RefreshCw className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Recebidos</span>
                  <span className="text-2xl font-black text-gray-900 mt-1 block">{totalReceivedCount} cotações</span>
                </div>
              </div>

            </div>

            {/* Simulated interactive quick statistics charting using pure Tailwind & HTML */}
            <div className="grid md:grid-cols-12 gap-8">
              
              {/* Sales distribution visual bar */}
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm md:col-span-8 text-left">
                <h3 className="text-base font-extrabold text-gray-900 mb-6">Status dos Orçamentos Solicitados</h3>
                
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                      <span>Pendentes de Resposta (Início da triagem)</span>
                      <span>{pendingCount} de {totalReceivedCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-orange-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${totalReceivedCount ? (pendingCount / totalReceivedCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                      <span>Sob Análise / Elaborando Cotação técnica</span>
                      <span>{underReviewCount} de {totalReceivedCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${totalReceivedCount ? (underReviewCount / totalReceivedCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-1.5">
                      <span>Pedidos Concluídos / Faturados</span>
                      <span>{completedCount} de {totalReceivedCount}</span>
                    </div>
                    <div className="w-full bg-gray-100 h-3.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${totalReceivedCount ? (completedCount / totalReceivedCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Otimização em tempo real ativada para toda a vitrine.
                  </span>
                  <button 
                    onClick={loadBudgetsFromStorage}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#FF4500] hover:underline"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Sincronizar Banco Local
                  </button>
                </div>
              </div>

              {/* Quick instructions / Help board */}
              <div className="bg-[#111115] text-white p-6 rounded-3xl md:col-span-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#FFB100] mb-4">Apoio Operacional</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Utilize o menu lateral para navegar e gerenciar seu conteúdo em tempo real. Você pode:
                  </p>
                  <ul className="text-xs text-gray-400 space-y-2 mt-4 list-disc list-inside">
                    <li>Responder orçamentos enviando cotações via WhatsApp.</li>
                    <li>Inserir e editar novos produtos na vitrine virtual.</li>
                    <li>Aprovar ou recusar avaliações de clientes.</li>
                  </ul>
                </div>
                <div className="border-t border-white/10 pt-4 mt-6">
                  <p className="text-[10px] font-mono text-gray-500">Desenvolvido para JC Sinalização e Serigrafia.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: GERENCIADOR DE ORÇAMENTOS */}
        {activeTab === 'budgets' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gerenciamento de Solicitações</h1>
              <p className="text-sm text-gray-500 mt-1">Veja e responda aos pedidos de orçamento recebidos diretamente pela vitrine.</p>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Budgets List Panel */}
              <div className="lg:col-span-7 bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Search & Filter Controls */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Pesquisar por cliente ou ID..."
                    value={budgetSearch}
                    onChange={(e) => setBudgetSearch(e.target.value)}
                    className="flex-grow p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                  />
                  <select
                    value={budgetFilter}
                    onChange={(e) => setBudgetFilter(e.target.value)}
                    className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 focus:bg-white focus:outline-none"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="pending">Pendentes</option>
                    <option value="review">Em Cotação</option>
                    <option value="approved">Aprovados</option>
                    <option value="completed">Concluídos</option>
                  </select>
                </div>

                {/* Items List */}
                {filteredBudgets.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-500">Nenhum orçamento encontrado.</p>
                    <p className="text-xs text-gray-400 mt-0.5">Tente modificar seu termo de busca ou filtros.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBudgets.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => {
                          setSelectedBudget(budget);
                          setCustomPrice(budget.totalEstimate ? budget.totalEstimate.toString() : '');
                        }}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          selectedBudget?.id === budget.id
                            ? 'bg-[#FF4500]/5 border-[#FF4500]/30 shadow-sm'
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-gray-400">{budget.id}</span>
                            <span className="text-sm font-black text-gray-900 truncate max-w-[180px]">{budget.customerName}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {budget.items.length} {budget.items.length === 1 ? 'item' : 'itens'}
                            </span>
                            <span className="text-gray-300 text-xs">•</span>
                            <span className="text-[11px] text-gray-400">
                              {new Date(budget.createdAt).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {budget.totalEstimate && budget.totalEstimate > 0 ? (
                            <span className="text-xs font-bold text-gray-800">
                              R$ {budget.totalEstimate.toFixed(2)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                              Sob cotação
                            </span>
                          )}

                          <span className={`text-[10px] uppercase font-black tracking-wider px-2 py-1 rounded-md ${
                            budget.status === 'pending' ? 'bg-orange-50 text-orange-600' :
                            budget.status === 'review' ? 'bg-amber-50 text-amber-600' :
                            budget.status === 'approved' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-emerald-600'
                          }`}>
                            {budget.status === 'pending' ? 'Pendente' :
                             budget.status === 'review' ? 'Cotação' :
                             budget.status === 'approved' ? 'Aprovado' : 'Concluído'}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

              </div>

              {/* Budget Details Panel */}
              <div className="lg:col-span-5">
                {selectedBudget ? (
                  <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-start border-b border-gray-100 pb-4">
                      <div>
                        <span className="text-xs font-mono text-gray-400 block">{selectedBudget.id}</span>
                        <h3 className="text-base font-extrabold text-gray-900 mt-0.5">Detalhes da Cotação</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteBudget(selectedBudget.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        title="Deletar orçamento"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                    {/* Customer contact fields */}
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-400 block font-medium">Cliente:</span>
                        <span className="text-sm font-bold text-gray-800">{selectedBudget.customerName}</span>
                      </div>
                      {selectedBudget.customerCompany && (
                        <div>
                          <span className="text-gray-400 block font-medium">Empresa:</span>
                          <span className="text-sm font-bold text-gray-800">{selectedBudget.customerCompany}</span>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <span className="text-gray-400 block font-medium">Telefone:</span>
                          <span className="font-bold text-gray-800">{selectedBudget.customerPhone}</span>
                        </div>
                        <div>
                          <span className="text-gray-400 block font-medium">E-mail:</span>
                          <span className="font-bold text-gray-800 truncate block">{selectedBudget.customerEmail}</span>
                        </div>
                      </div>
                    </div>

                    {/* Budget Items list inside details */}
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-xs space-y-3">
                      <h4 className="font-black text-gray-900 uppercase tracking-wider text-[10px] border-b border-gray-200/60 pb-2">
                        Itens Solicitados
                      </h4>
                      {selectedBudget.items.map((item, index) => (
                        <div key={item.id} className="space-y-1">
                          <div className="flex justify-between items-baseline font-bold text-gray-800">
                            <span>{item.quantity}x {item.name}</span>
                          </div>
                          {item.width && item.height && (
                            <div className="text-gray-500 font-mono text-[10px]">
                              Tamanho: {item.width}cm x {item.height}cm
                            </div>
                          )}
                          {item.observations && (
                            <div className="text-gray-500 italic">
                              Obs: "{item.observations}"
                            </div>
                          )}
                          {index < selectedBudget.items.length - 1 && (
                            <div className="h-px bg-gray-200 my-2"></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {selectedBudget.notes && (
                      <div className="text-xs">
                        <span className="text-gray-400 font-medium block">Notas do Cliente:</span>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 mt-1 italic">
                          "{selectedBudget.notes}"
                        </p>
                      </div>
                    )}

                    {/* Pricing Calculator input */}
                    <div className="border-t border-gray-100 pt-5 space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">Atribuir Preço do Orçamento (R$)</label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <input
                            type="number"
                            value={customPrice}
                            onChange={(e) => setCustomPrice(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none font-bold text-gray-800"
                            placeholder="Ex: 1250.00"
                          />
                        </div>
                      </div>

                      {/* Operations buttons */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            const val = parseFloat(customPrice) || 0;
                            handleUpdateBudgetStatus(selectedBudget.id, 'review', val);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#FFB100] hover:bg-amber-500 text-gray-950 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          Salvar Valor &amp; Manter em Análise
                        </button>

                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => {
                              const val = parseFloat(customPrice) || 0;
                              handleUpdateBudgetStatus(selectedBudget.id, 'approved', val);
                            }}
                            className="flex items-center justify-center gap-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Aprovar Orçamento
                          </button>
                          
                          <button
                            onClick={() => {
                              handleUpdateBudgetStatus(selectedBudget.id, 'completed');
                            }}
                            className="flex items-center justify-center gap-1 py-2.5 bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            Marcar Concluído
                          </button>
                        </div>

                        {/* Send Response via WhatsApp Button */}
                        <button
                          onClick={() => handleSendResponseWhatsApp(selectedBudget)}
                          className="w-full flex items-center justify-center gap-2 mt-2 py-3 bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
                        >
                          <PhoneCall className="w-4 h-4" />
                          Enviar Cotação pelo WhatsApp
                        </button>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm text-center">
                    <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2 animate-bounce" />
                    <p className="text-sm font-bold text-gray-500">Selecione uma solicitação</p>
                    <p className="text-xs text-gray-400 mt-0.5">Selecione um orçamento ao lado para ver os detalhes completos, editar valores e gerar a resposta para o WhatsApp do cliente.</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: GERENCIADOR DE VITRINE (CATÁLOGO) */}
        {activeTab === 'catalog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gerenciamento do Catálogo</h1>
                <p className="text-sm text-gray-500 mt-1">Adicione, edite ou remova produtos e serviços exibidos na vitrine.</p>
              </div>

              <button
                onClick={() => setIsAddingProduct(!isAddingProduct)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF4500] text-white text-xs font-black rounded-xl hover:bg-orange-600 cursor-pointer shadow-md"
              >
                {isAddingProduct ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAddingProduct ? 'Cancelar' : 'Adicionar Produto'}
              </button>
            </div>

            {/* Product adding form */}
            {isAddingProduct && (
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm text-left">
                <h3 className="text-base font-extrabold text-gray-900 mb-6">Novo Produto/Serviço</h3>
                
                <form onSubmit={handleCreateProduct} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Nome do Produto *</label>
                      <input
                        type="text"
                        required
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                        placeholder="Ex: Letras Caixa em Chapa Galvanizada"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Categoria *</label>
                      <select
                        value={newProdCategory}
                        onChange={(e: any) => setNewProdCategory(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none font-bold text-gray-600"
                      >
                        <option value="sinalizacao">Sinalização de Segurança</option>
                        <option value="serigrafia">Serigrafia / Silk Screen</option>
                        <option value="comunicacao">Comunicação Visual</option>
                        <option value="adesivos">Adesivos Personalizados</option>
                        <option value="peliculas">Películas de Proteção Solar</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">URL da Imagem</label>
                      <input
                        type="text"
                        value={newProdImage}
                        onChange={(e) => setNewProdImage(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                        placeholder="URL de imagem Unsplash ou deixe em branco"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Preço Sugerido (Est./Lote/Medida)</label>
                      <input
                        type="text"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                        placeholder="Ex: R$ 35,00/m² ou R$ 18,00/unid"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Descrição Curta *</label>
                    <textarea
                      required
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                      placeholder="Descreva brevemente a finalidade e opções do item..."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Destaques / Especificações (Um por linha)</label>
                    <textarea
                      value={newProdFeatures}
                      onChange={(e) => setNewProdFeatures(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                      placeholder="Material resistente UV&#10;Garantia de 1 ano&#10;Fácil aplicação"
                    />
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#FF4500] to-[#FF6A00] text-white text-xs font-extrabold rounded-xl hover:shadow-lg cursor-pointer"
                    >
                      Salvar e Publicar
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Catalog Grid */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((prod) => (
                <div key={prod.id} className="flex flex-col">
                  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
                    <div className="relative aspect-video bg-gray-100">
                      <img
                        src={prod.image}
                        alt={prod.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <button
                          onClick={() => editingProductId === prod.id ? setEditingProductId(null) : handleStartEditProduct(prod)}
                          className="p-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md cursor-pointer transition-colors"
                          title="Editar produto"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md cursor-pointer transition-colors"
                          title="Excluir produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-black uppercase tracking-wider text-[#FF4500] bg-orange-50 px-1.5 py-0.5 rounded-md">
                          {prod.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-extrabold text-gray-900 mt-2 line-clamp-2 leading-snug">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="border-t border-gray-50 pt-3 mt-3 flex justify-between items-baseline text-[11px]">
                        <span className="text-gray-400">Preço Est:</span>
                        <span className="font-bold text-gray-800">{prod.priceEstimate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Formulário de edição inline */}
                  {editingProductId === prod.id && (
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-2xl p-4 col-span-full">
                      <h4 className="text-xs font-extrabold text-gray-800 mb-3 flex items-center gap-1.5">
                        <Pencil className="w-3.5 h-3.5 text-blue-500" /> Editar produto
                      </h4>
                      <form onSubmit={handleSaveEditProduct} className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 block mb-1">Nome</label>
                            <input
                              type="text"
                              required
                              value={editProdName}
                              onChange={(e) => setEditProdName(e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-400 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 block mb-1">Categoria</label>
                            <select
                              value={editProdCategory}
                              onChange={(e: any) => setEditProdCategory(e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none"
                            >
                              <option value="sinalizacao">Sinalização</option>
                              <option value="serigrafia">Serigrafia / Silk</option>
                              <option value="comunicacao">Comunicação Visual</option>
                              <option value="adesivos">Adesivos</option>
                              <option value="peliculas">Películas</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 block mb-1">URL da Foto</label>
                          <input
                            type="text"
                            value={editProdImage}
                            onChange={(e) => setEditProdImage(e.target.value)}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-400 focus:outline-none font-mono"
                            placeholder="/nome-da-foto.jpg ou https://..."
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 block mb-1">Preço Sugerido</label>
                            <input
                              type="text"
                              value={editProdPrice}
                              onChange={(e) => setEditProdPrice(e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-400 focus:outline-none"
                              placeholder="Ex: R$ 45,00/m²"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-gray-600 block mb-1">Descrição</label>
                            <input
                              type="text"
                              value={editProdDesc}
                              onChange={(e) => setEditProdDesc(e.target.value)}
                              className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-400 focus:outline-none"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-gray-600 block mb-1">Destaques (um por linha)</label>
                          <textarea
                            value={editProdFeatures}
                            onChange={(e) => setEditProdFeatures(e.target.value)}
                            rows={3}
                            className="w-full p-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-blue-400 focus:outline-none"
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setEditingProductId(null)}
                            className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            className="flex items-center gap-1 px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-extrabold rounded-xl cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" /> Salvar
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PORTFÓLIO */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Gerenciar Portfólio</h1>
                <p className="text-sm text-gray-500 mt-1">Adicione ou remova fotos exibidas na seção de portfólio do site.</p>
              </div>
              <button
                onClick={() => setIsAddingPortfolioItem(!isAddingPortfolioItem)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#FF4500] text-white text-xs font-black rounded-xl hover:bg-orange-600 cursor-pointer shadow-md"
              >
                {isAddingPortfolioItem ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {isAddingPortfolioItem ? 'Cancelar' : 'Adicionar Foto'}
              </button>
            </div>

            {/* Formulário de nova foto */}
            {isAddingPortfolioItem && (
              <div className="bg-white border border-gray-100 p-6 rounded-3xl shadow-sm">
                <h3 className="text-base font-extrabold text-gray-900 mb-5">Nova foto no portfólio</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newPortTitle || !newPortImage) return;
                    const item: PortfolioItem = {
                      id: `port-${Date.now()}`,
                      title: newPortTitle,
                      category: newPortCategory || 'Geral',
                      image: newPortImage,
                      description: newPortDesc || undefined
                    };
                    onUpdatePortfolio([item, ...portfolioItems]);
                    setNewPortTitle('');
                    setNewPortCategory('');
                    setNewPortImage('');
                    setNewPortDesc('');
                    setIsAddingPortfolioItem(false);
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Título *</label>
                      <input
                        type="text"
                        required
                        value={newPortTitle}
                        onChange={(e) => setNewPortTitle(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                        placeholder="Ex: Adesivação de frota — Empresa XYZ"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-600 block mb-1">Categoria</label>
                      <input
                        type="text"
                        value={newPortCategory}
                        onChange={(e) => setNewPortCategory(e.target.value)}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                        placeholder="Ex: Comunicação Visual, Películas..."
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">URL da Imagem *</label>
                    <input
                      type="text"
                      required
                      value={newPortImage}
                      onChange={(e) => setNewPortImage(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none font-mono"
                      placeholder="/nome-da-foto.jpg ou https://..."
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Descrição (Opcional)</label>
                    <input
                      type="text"
                      value={newPortDesc}
                      onChange={(e) => setNewPortDesc(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#FF4500] focus:outline-none"
                      placeholder="Breve descrição do trabalho..."
                    />
                  </div>
                  <div className="flex gap-2 justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingPortfolioItem(false)}
                      className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-gradient-to-r from-[#FF4500] to-[#FF6A00] text-white text-xs font-extrabold rounded-xl hover:shadow-lg cursor-pointer"
                    >
                      Publicar no Portfólio
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Grid de fotos */}
            {portfolioItems.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                <Images className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-500">Nenhuma foto no portfólio ainda.</p>
                <p className="text-xs text-gray-400 mt-0.5">Clique em "Adicionar Foto" para começar.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioItems.map((item) => (
                  <div key={item.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="relative aspect-square bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          if (!window.confirm('Remover esta foto do portfólio?')) return;
                          onUpdatePortfolio(portfolioItems.filter(i => i.id !== item.id));
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md cursor-pointer"
                        title="Remover foto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[8px] font-mono font-bold uppercase tracking-widest text-white bg-black/60 rounded-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">{item.title}</p>
                      {item.description && (
                        <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: APROVAÇÃO DE DEPOIMENTOS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Depoimentos dos Clientes</h1>
              <p className="text-sm text-gray-500 mt-1">Aprove ou exclua os depoimentos de clientes recebidos pelo site.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <div className="space-y-4">
                {testimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-gray-500">Nenhum depoimento cadastrado.</p>
                  </div>
                ) : (
                  testimonials.map((test) => (
                    <div
                      key={test.id}
                      className="p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-gray-200 transition-colors"
                    >
                      <div className="space-y-1.5 flex-grow pr-4">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black text-gray-900">{test.name}</h4>
                          {test.company && (
                            <span className="text-xs text-gray-400">({test.company})</span>
                          )}
                          <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-md ${
                            test.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {test.approved ? 'Aprovado' : 'Pendente'}
                          </span>
                        </div>

                        <p className="text-xs text-gray-600 leading-relaxed italic">
                          "{test.comment}"
                        </p>

                        <div className="flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-xs ${i < test.rating ? 'text-amber-400' : 'text-gray-200'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        {!test.approved && (
                          <button
                            onClick={() => handleApproveTestimonial(test.id)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                            Aprovar
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTestimonial(test.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                          Excluir
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CONFIGURAÇÕES GERAIS */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Configurações Gerais</h1>
              <p className="text-sm text-gray-500 mt-1">Atualize informações de contato, links sociais, e endereço físico exibidos no site.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <form onSubmit={handleSaveSettings} className="space-y-6 text-left">
                
                {settingsSaved && (
                  <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-sm font-bold">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Configurações atualizadas com sucesso e aplicadas ao site!
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">WhatsApp (Numérico para link) *</label>
                    <input
                      type="text"
                      required
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none font-mono"
                      placeholder="Ex: 5527999999999"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">WhatsApp Exibido no Site *</label>
                    <input
                      type="text"
                      required
                      value={editPhoneFormatted}
                      onChange={(e) => setEditPhoneFormatted(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                      placeholder="Ex: (27) 99999-9999"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Telefone Fixo (Opcional)</label>
                    <input
                      type="text"
                      value={editPhoneLandline}
                      onChange={(e) => setEditPhoneLandline(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                      placeholder="Ex: (27) 3000-0000"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">E-mail Corporativo (Opcional)</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                      placeholder="contato@suaempresa.com.br"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Horário de Funcionamento *</label>
                    <input
                      type="text"
                      required
                      value={editHours}
                      onChange={(e) => setEditHours(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                    />
                  </div>
                  <div className="hidden sm:block">{/* spacer */}</div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Endereço Físico Exibido *</label>
                  <input
                    type="text"
                    required
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Instagram (URL completa)</label>
                    <input
                      type="text"
                      value={editInstagram}
                      onChange={(e) => setEditInstagram(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                      placeholder="https://instagram.com/suapagina"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Facebook (URL completa, Opcional)</label>
                    <input
                      type="text"
                      value={editFacebook}
                      onChange={(e) => setEditFacebook(e.target.value)}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none"
                      placeholder="https://facebook.com/suapagina"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-[#E8650C] text-white font-extrabold text-sm rounded-xl hover:bg-orange-600 cursor-pointer shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
