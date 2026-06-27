import React, { useState } from 'react';
import { Menu, X, ShieldAlert, FileText } from 'lucide-react';
import Logo from './Logo';

interface NavbarProps {
  currentSection: string;
  onNavigate: (section: string) => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export default function Navbar({ currentSection, onNavigate, isAdmin, onToggleAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início' },
    { id: 'produtos', label: 'Produtos e Serviços' },
    { id: 'orcamento', label: 'Solicitar Orçamento' },
    { id: 'depoimentos', label: 'Depoimentos' },
    { id: 'contato', label: 'Localização & Contato' }
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-editorial-charcoal/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex-shrink-0 flex items-center">
            <button onClick={() => handleLinkClick('home')} className="flex items-center gap-2 cursor-pointer focus:outline-none">
              <Logo className="h-11" />
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {!isAdmin ? (
              <>
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.id)}
                    className={`px-3 py-2 rounded text-xs uppercase tracking-wider font-semibold transition-all duration-200 cursor-pointer ${
                      currentSection === item.id
                        ? 'text-editorial-gold border-b-2 border-editorial-gold font-bold'
                        : 'text-editorial-charcoal/70 hover:text-editorial-charcoal hover:bg-editorial-charcoal/5'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            ) : (
              <span className="text-xs font-mono font-bold text-editorial-charcoal/50 uppercase tracking-widest px-3 py-1 bg-[#F2EFE9] border border-editorial-charcoal/10 rounded">
                Modo Administrador
              </span>
            )}

            <div className="h-6 w-px bg-editorial-charcoal/10 mx-2"></div>

            <button
              onClick={() => {
                onToggleAdmin();
                setIsOpen(false);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer ${
                isAdmin
                  ? 'bg-[#F2EFE9] text-editorial-charcoal hover:bg-[#E5E2D9] border border-editorial-charcoal/15'
                  : 'bg-editorial-charcoal text-white shadow-sm hover:bg-editorial-gold'
              }`}
            >
              {isAdmin ? (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  Ir para a Vitrine
                </>
              ) : (
                <>
                  <ShieldAlert className="w-3.5 h-3.5" />
                  Painel de Gestão
                </>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-editorial-charcoal hover:bg-[#F2EFE9] focus:outline-none"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden bg-[#FAF9F6] border-b border-editorial-charcoal/10 shadow-lg absolute w-full left-0 transition-all duration-300">
              <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
                {!isAdmin ? (
                  menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.id)}
                      className={`block w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-bold ${
                        currentSection === item.id
                          ? 'text-editorial-gold bg-editorial-gold/5'
                          : 'text-editorial-charcoal/75 hover:text-editorial-gold hover:bg-editorial-charcoal/5'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2 text-[10px] font-mono font-bold text-editorial-charcoal/50 uppercase tracking-widest">
                    Painel Administrativo Ativo
                  </div>
                )}

                <div className="border-t border-editorial-charcoal/10 my-2 pt-2 px-2">
                  <button
                    onClick={() => {
                      onToggleAdmin();
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-200 ${
                      isAdmin
                        ? 'bg-[#F2EFE9] text-editorial-charcoal border border-editorial-charcoal/15'
                        : 'bg-editorial-charcoal text-white'
                    }`}
                  >
                    {isAdmin ? (
                      <>
                        <FileText className="w-4 h-4" />
                        Voltar para a Vitrine
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        Acessar Painel de Gestão
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
    </nav>
  );
}
