import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import Logo from './Logo';

// SHA-256 da senha de acesso: jc2026
const SENHA_HASH = '6de11ed320879c99959d522c3ec178cef2d57cb3d21dd6b55daaf65dc8e9b87a';

async function sha256(message: string): Promise<string> {
  const buffer = new TextEncoder().encode(message);
  const hash = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

interface LoginModalProps {
  onLogin: (username: string) => void;
  onClose: () => void;
}

export default function LoginModal({ onLogin, onClose }: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const hash = await sha256(password);

      if (hash === SENHA_HASH) {
        sessionStorage.setItem('jc_auth_user', username || 'admin');
        onLogin(username || 'admin');
      } else {
        setError('Senha incorreta. Tente novamente.');
      }
    } catch {
      setError('Erro ao verificar credenciais. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

        {/* Header laranja */}
        <div className="bg-gradient-to-r from-[#E8650C] to-[#FFB100] p-6 text-center">
          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-lg font-black text-white">Acesso Restrito</h2>
          <p className="text-[11px] text-white/80 mt-0.5 font-mono">Painel de Gestão — JC Sinalização</p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-500 block mb-1.5">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none transition-colors"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono uppercase tracking-wider font-bold text-gray-500 block mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-[#E8650C] focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <p className="text-xs font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#E8650C] to-[#FFB100] text-white font-black text-sm rounded-xl hover:shadow-lg transition-all disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? 'Verificando...' : 'Entrar no Painel'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
            >
              Cancelar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
