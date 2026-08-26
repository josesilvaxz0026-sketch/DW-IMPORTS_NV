import React, { useState } from 'react';
import { Lock, KeyRound, ShieldAlert, CheckCircle2, X, Eye, EyeOff } from 'lucide-react';
import { DW_LOGO_URL } from '../assets/logo';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticate: (pin: string) => boolean;
  storedPin: string;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthenticate,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError(true);
      setErrorMessage('Por favor, digite a senha de administrador.');
      return;
    }

    const success = onAuthenticate(pin.trim());
    if (success) {
      setError(false);
      setErrorMessage('');
      setPin('');
      onClose();
    } else {
      setError(true);
      setErrorMessage('Senha incorreta! Acesso restrito aos administradores da DW IMPORTS.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-zinc-900 border border-zinc-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-zinc-950 p-6 border-b border-zinc-800 text-center relative">
          <button
            type="button"
            onClick={() => {
              setError(false);
              setErrorMessage('');
              setPin('');
              onClose();
            }}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-850 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-500/40 mx-auto flex items-center justify-center mb-3 shadow-lg p-1">
            <img
              src={DW_LOGO_URL}
              alt="DW IMPORTS"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Lock className="w-3 h-3" />
            Acesso Restrito
          </div>

          <h3 className="text-lg font-black text-white">Painel de Controle DW IMPORTS</h3>
          <p className="text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
            Área protegida para gerenciamento de estoque, pedidos e catálogo de mantos.
          </p>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Senha de Acesso / Master PIN</span>
              <span className="text-[10px] text-zinc-400 font-normal">Padrão: dw2025</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <KeyRound className="w-4 h-4 text-amber-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (error) {
                    setError(false);
                    setErrorMessage('');
                  }
                }}
                placeholder="Digite a senha de administrador..."
                autoFocus
                className={`w-full bg-zinc-950 border ${
                  error ? 'border-rose-500 focus:border-rose-500' : 'border-zinc-700 focus:border-amber-500'
                } rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors shadow-inner`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="mt-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2 text-xs text-rose-300 animate-fadeIn">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-400 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberSession}
                onChange={(e) => setRememberSession(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-amber-500 focus:ring-0 w-3.5 h-3.5"
              />
              <span>Lembrar login neste navegador</span>
            </label>
            <span className="text-[10px] text-zinc-400 font-mono">Atalho: Ctrl+Shift+A</span>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => {
                setError(false);
                setPin('');
                onClose();
              }}
              className="flex-1 px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 font-bold text-xs transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              Desbloquear Painel
            </button>
          </div>
        </form>

        {/* Footer tip */}
        <div className="bg-zinc-950/80 px-6 py-3 border-t border-zinc-850 text-center text-[11px] text-zinc-400">
          🔒 Apenas a gerência da DW IMPORTS possui autorização para alterar estoques e produtos.
        </div>
      </div>
    </div>
  );
};
