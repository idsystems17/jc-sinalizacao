import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Instagram,
  ChevronUp,
  Phone,
  Mail,
  MapPin,
  Lock,
} from 'lucide-react';

// Types and Seed Data
import { Product, Testimonial, CompanySettings, PortfolioItem } from './types';
import {
  initialProducts,
  initialTestimonials,
  initialBudgetRequests,
  initialPortfolioItems,
  defaultCompanySettings
} from './data';

// Custom Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Showcase from './components/Showcase';
import Portfolio from './components/Portfolio';
import BudgetForm from './components/BudgetForm';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import ContactMap from './components/ContactMap';
import AdminPanel from './components/AdminPanel';
import WhatsAppChat from './components/WhatsAppChat';
import LoginModal from './components/LoginModal';

// Versão dos dados — incrementar força re-seed no localStorage
const DATA_VERSION = '3';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!sessionStorage.getItem('jc_auth_user')
  );

  // Atalho secreto: Ctrl + Alt + J abre o login
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && e.ctrlKey && e.altKey) {
        e.preventDefault();
        if (!isAdmin && !showLoginModal) setShowLoginModal(true);
      }
    };
    window.addEventListener('keydown', down);
    return () => window.removeEventListener('keydown', down);
  }, [isAdmin, showLoginModal]);

  const [currentSection, setCurrentSection] = useState('home');

  // App global content states (cached in localStorage)
  const [products, setProducts] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [settings, setSettings] = useState<CompanySettings>(defaultCompanySettings);

  // Active custom quote selection draft
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Scroll back to top button visibility state
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Synchronize localStorage cache on first mount
  useEffect(() => {
    // Controle de versão: se a versão mudou, re-seed produtos e portfólio
    const storedVersion = localStorage.getItem('jc_data_version');
    const versionChanged = storedVersion !== DATA_VERSION;
    if (versionChanged) {
      localStorage.setItem('jc_data_version', DATA_VERSION);
      localStorage.removeItem('jc_products');
      localStorage.removeItem('jc_portfolio');
    }

    // 1. Seed Company Settings (nunca sobrescreve — dados do cliente)
    const cachedSettings = localStorage.getItem('jc_company_settings');
    if (cachedSettings) {
      setSettings(JSON.parse(cachedSettings));
    } else {
      localStorage.setItem('jc_company_settings', JSON.stringify(defaultCompanySettings));
    }

    // 2. Seed Products
    const cachedProducts = localStorage.getItem('jc_products');
    if (cachedProducts) {
      setProducts(JSON.parse(cachedProducts));
    } else {
      setProducts(initialProducts);
      localStorage.setItem('jc_products', JSON.stringify(initialProducts));
    }

    // 3. Seed Testimonials
    const cachedTestimonials = localStorage.getItem('jc_testimonials');
    if (cachedTestimonials) {
      setTestimonials(JSON.parse(cachedTestimonials));
    } else {
      setTestimonials(initialTestimonials);
      localStorage.setItem('jc_testimonials', JSON.stringify(initialTestimonials));
    }

    // 4. Seed Portfolio Items
    const cachedPortfolio = localStorage.getItem('jc_portfolio');
    if (cachedPortfolio) {
      setPortfolioItems(JSON.parse(cachedPortfolio));
    } else {
      setPortfolioItems(initialPortfolioItems);
      localStorage.setItem('jc_portfolio', JSON.stringify(initialPortfolioItems));
    }

    // 5. Seed initial Budget Requests (Admin demo)
    const cachedBudgets = localStorage.getItem('jc_budgets');
    if (!cachedBudgets) {
      localStorage.setItem('jc_budgets', JSON.stringify(initialBudgetRequests));
    }

    // Track scroll events to toggle scroll-to-top buttons
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update Products handler
  const handleUpdateProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('jc_products', JSON.stringify(updatedProds));
  };

  // Update Testimonials handler
  const handleUpdateTestimonials = (updatedTests: Testimonial[]) => {
    setTestimonials(updatedTests);
    localStorage.setItem('jc_testimonials', JSON.stringify(updatedTests));
  };

  // Update Portfolio handler
  const handleUpdatePortfolio = (updatedItems: PortfolioItem[]) => {
    setPortfolioItems(updatedItems);
    localStorage.setItem('jc_portfolio', JSON.stringify(updatedItems));
  };

  // Update Settings handler
  const handleUpdateSettings = (updatedSettings: CompanySettings) => {
    setSettings(updatedSettings);
    localStorage.setItem('jc_company_settings', JSON.stringify(updatedSettings));
  };

  // Add Product to Budget Selection draft handler
  const handleAddToBudget = (product: Product) => {
    if (!selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    
    // Smooth scroll down to budget request form section
    const element = document.getElementById('orcamento');
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    }
  };

  // Remove Product from Budget draft
  const handleRemoveProductFromBudget = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  // Clear entire selected budget draft
  const handleClearBudgetDraft = () => {
    setSelectedProducts([]);
  };

  // New Client Testimonial handler
  const handleAddTestimonial = (newTest: Omit<Testimonial, 'id' | 'createdAt' | 'approved'>) => {
    const testimonialWithId: Testimonial = {
      ...newTest,
      id: `test-${Date.now()}`,
      createdAt: new Date().toISOString(),
      approved: false // Starts as unapproved (must be clicked by admin)
    };

    const updated = [testimonialWithId, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('jc_testimonials', JSON.stringify(updated));
  };

  // Scroll back to top handler
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
      return;
    }
    if (isAuthenticated) {
      setIsAdmin(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setShowLoginModal(false);
    setIsAdmin(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jc_auth_user');
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const handleNavigate = (sectionId: string) => {
    setCurrentSection(sectionId);

    if (isAdmin) {
      setIsAdmin(false);
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="font-sans text-editorial-charcoal bg-editorial-cream min-h-screen flex flex-col selection:bg-editorial-gold/20 selection:text-editorial-charcoal">
      
      {showLoginModal && (
        <LoginModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      <Navbar
        currentSection={currentSection}
        onNavigate={handleNavigate}
        isAdmin={isAdmin}
        onToggleAdmin={handleRequestAdmin}
      />

      <AnimatePresence mode="wait">
        {!isAdmin ? (
          // STOREFRONT CUSTOMER VIEW
          <motion.div
            key="vitrine"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow"
          >
            {/* Hero Banner Area */}
            <Hero onNavigate={handleNavigate} settings={settings} />

            {/* Sobre a empresa */}
            <About />

            {/* Filterable Products & Services Showcase */}
            <Showcase
              products={products}
              onAddToBudget={handleAddToBudget}
              addedProductIds={selectedProducts.map(p => p.id)}
            />

            {/* Portfólio de trabalhos realizados */}
            <Portfolio items={portfolioItems} />

            {/* Como Funciona — 3 passos */}
            <HowItWorks />

            {/* Quote Calculator Interactive Budget Request Form */}
            <BudgetForm
              selectedProducts={selectedProducts}
              onRemoveProduct={handleRemoveProductFromBudget}
              onClearProducts={handleClearBudgetDraft}
              settings={settings}
            />

            {/* Customer Testimonials reviews area */}
            <Testimonials
              testimonials={testimonials}
              onAddTestimonial={handleAddTestimonial}
            />

            {/* Perguntas Frequentes */}
            <FAQ />

            {/* Google Map Location & Contact Address card */}
            <ContactMap settings={settings} />

            {/* Main Footer Block */}
            <footer className="bg-[#F2EFE9] text-editorial-charcoal pt-16 pb-12 border-t border-editorial-charcoal/10 text-left">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
                  
                  {/* Footer Col 1: About the company */}
                  <div className="md:col-span-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-editorial-charcoal flex items-center justify-center font-serif italic text-white font-bold">
                        JC
                      </div>
                      <span className="text-xl font-serif italic tracking-tighter text-editorial-charcoal">JC SINALIZAÇÃO</span>
                    </div>
                    <p className="text-xs text-editorial-charcoal/70 leading-relaxed max-w-sm">
                      Sua parceira ideal para projetos industriais, comerciais e corporativos. Fabricamos sinalização em conformidade com as normas, serigrafia premium de vestuário e produtos de comunicação visual com entrega ágil e altíssima durabilidade.
                    </p>
                    
                    {/* Social Media links */}
                    <div className="flex gap-4 pt-2">
                      {settings.instagram && (
                        <a
                          href={settings.instagram}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-full bg-editorial-charcoal/5 border border-editorial-charcoal/10 hover:bg-editorial-gold hover:text-white transition-all hover:scale-105"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Footer Col 2: Navigation Links */}
                  <div className="md:col-span-3 space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-gold">Navegação</h4>
                    <ul className="space-y-2 text-xs text-editorial-charcoal/70 font-medium">
                      {[
                        { id: 'home', label: 'Início' },
                        { id: 'sobre', label: 'Sobre a Empresa' },
                        { id: 'produtos', label: 'Produtos e Serviços' },
                        { id: 'portfolio', label: 'Portfólio' },
                        { id: 'orcamento', label: 'Solicitar Orçamento' },
                        { id: 'faq', label: 'Perguntas Frequentes' },
                        { id: 'contato', label: 'Localização & Contato' },
                      ].map(item => (
                        <li key={item.id}>
                          <button onClick={() => handleNavigate(item.id)} className="hover:text-editorial-gold transition-colors cursor-pointer text-left">
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Footer Col 3: Contact Info Quick view */}
                  <div className="md:col-span-4 space-y-4">
                    <h4 className="text-[10px] uppercase tracking-[0.2em] font-bold text-editorial-gold">Informações Rápidas</h4>
                    <ul className="space-y-3 text-xs text-editorial-charcoal/70">
                      <li className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-editorial-gold flex-shrink-0 mt-0.5" />
                        <span>{settings.address}</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <Phone className="w-4 h-4 text-editorial-gold flex-shrink-0" />
                        <span>WhatsApp: {settings.phoneFormatted}</span>
                      </li>
                      {settings.phoneLandline && (
                        <li className="flex items-center gap-2.5">
                          <Phone className="w-4 h-4 text-editorial-gold flex-shrink-0" />
                          <span>Fixo: {settings.phoneLandline}</span>
                        </li>
                      )}
                      {settings.email && (
                        <li className="flex items-center gap-2.5">
                          <Mail className="w-4 h-4 text-editorial-gold flex-shrink-0" />
                          <span className="truncate">{settings.email}</span>
                        </li>
                      )}
                    </ul>
                  </div>

                </div>

                {/* Subfooter bottom label */}
                <div className="border-t border-editorial-charcoal/10 pt-8 mt-12 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-editorial-charcoal/50 font-medium uppercase tracking-wider">
                  <p>© {new Date().getFullYear()} JC Sinalização e Serigrafia Premium. Todos os direitos reservados.</p>
                  
                  <button
                    onClick={handleRequestAdmin}
                    className="flex items-center gap-1 opacity-20 hover:opacity-60 transition-opacity cursor-pointer"
                    title="Acesso restrito"
                  >
                    <Lock className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </footer>
          </motion.div>
        ) : (
          // MANAGEMENT ADMINISTRATIVE VIEW
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-grow bg-gray-50"
          >
            <AdminPanel
              products={products}
              onUpdateProducts={handleUpdateProducts}
              testimonials={testimonials}
              onUpdateTestimonials={handleUpdateTestimonials}
              portfolioItems={portfolioItems}
              onUpdatePortfolio={handleUpdatePortfolio}
              settings={settings}
              onUpdateSettings={handleUpdateSettings}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Active WhatsApp Widget operator */}
      <WhatsAppChat settings={settings} />

      {/* Elegant scroll back to top button floating in left bottom margin */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleScrollTop}
            className="fixed bottom-6 left-6 z-40 w-11 h-11 bg-white hover:bg-gray-50 border border-gray-150 rounded-full flex items-center justify-center text-gray-700 hover:text-orange-600 shadow-lg cursor-pointer"
            title="Voltar ao topo"
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

    </div>
  );
}
