import React from 'react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';
import { Phone, ShieldCheck, Truck, Sparkles, MessageCircle, Heart, Lock, KeyRound } from 'lucide-react';

interface FooterProps {
  onSelectCategory: (cat: string) => void;
  onOpenSupport: () => void;
  onOpenSizeGuide: () => void;
  onOpenAdminAuth: () => void;
  isAdminAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenSupport,
  onOpenSizeGuide,
  onOpenAdminAuth,
  isAdminAuthenticated = false,
}) => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-850 text-zinc-400 text-xs py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: Brand & WhatsApp */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-amber-500/30 overflow-hidden flex items-center justify-center p-0.5 shadow-md">
              <img
                src={DW_LOGO_URL}
                alt="DW IMPORTS"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-base font-black text-white tracking-tight">
              DW<span className="text-amber-400">IMPORTS</span>
            </span>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            DW IMPORTS • Sua loja de camisas de futebol com personalização oficial de nome, número, patrocínio e patches de competição.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/55${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Gostaria+de+atendimento`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-2 rounded-xl transition-colors text-xs"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>

        {/* Col 2: Categories */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Categorias</h4>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('retro')}
                className="hover:text-amber-400 transition-colors text-left"
              >
                ⭐ Camisas Retrô Históricas (R$ 170)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('selecoes')}
                className="hover:text-emerald-400 transition-colors text-left"
              >
                🌍 Seleções Mundiais (R$ 150)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('brasileirao')}
                className="hover:text-white transition-colors text-left"
              >
                🇧🇷 Brasileirão Série A (R$ 150)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onSelectCategory('europeu')}
                className="hover:text-white transition-colors text-left"
              >
                ⚡ Ligas Europeias (R$ 150)
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Customer Service & Guarantees */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Atendimento & Ajuda</h4>
          <ul className="space-y-2">
            <li>
              <button
                type="button"
                onClick={onOpenSupport}
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-sky-400" />
                Chat de Suporte ao Vivo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onOpenSizeGuide}
                className="hover:text-white transition-colors text-left"
              >
                📏 Tabela de Medidas e Tamanhos
              </button>
            </li>
            <li className="flex items-center gap-1.5 text-zinc-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Garantia de Qualidade Tailandesa 1:1</span>
            </li>
            <li className="flex items-center gap-1.5 text-zinc-300">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>Envio com Rastreamento Correios</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Pricing Policies */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Tabela de Preços</h4>
          <div className="bg-zinc-900/80 p-3 rounded-xl border border-zinc-800 space-y-1.5 text-[11px]">
            <div className="flex justify-between">
              <span>Camisa Atual / Seleção:</span>
              <strong className="text-white">R$ 150,00</strong>
            </div>
            <div className="flex justify-between">
              <span>Camisa Retrô:</span>
              <strong className="text-amber-400">R$ 170,00</strong>
            </div>
            <div className="flex justify-between">
              <span>Personalizar Nome & Nº:</span>
              <strong className="text-zinc-300">+ R$ 20,00</strong>
            </div>
            <div className="flex justify-between">
              <span>Patrocínio Oficial:</span>
              <strong className="text-zinc-300">+ R$ 20,00</strong>
            </div>
            <div className="flex justify-between">
              <span>Patch de Competição:</span>
              <strong className="text-zinc-300">+ R$ 20,00</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-zinc-500">
        <p>© {new Date().getFullYear()} DW IMPORTS • Todos os direitos reservados.</p>
        
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-1 justify-center">
            Atendimento Oficial WhatsApp: <strong className="text-zinc-300">{WHATSAPP_DISPLAY}</strong>
          </p>

          <button
            type="button"
            id="btn-footer-area-restrita"
            onClick={onOpenAdminAuth}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border shadow-sm ${
              isAdminAuthenticated
                ? 'bg-amber-500/15 border-amber-500/50 text-amber-400 hover:bg-amber-500/25'
                : 'bg-zinc-900 hover:bg-zinc-850 border-amber-500/30 hover:border-amber-500/60 text-zinc-300 hover:text-amber-400'
            }`}
            title="Acesso Restrito da Gerência da Loja (Senha de Administrador)"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAdminAuthenticated ? '⚙️ Painel Lojista (Conectado)' : '🔒 Área Restrita (Lojista)'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
