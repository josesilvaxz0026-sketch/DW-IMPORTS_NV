import React from 'react';
import { Sparkles, Shield, Award, Phone, ArrowRight, Flame } from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';

interface HeroBannerProps {
  onSelectCategory: (cat: string) => void;
  onOpenCustomizerWithSample: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSelectCategory,
  onOpenCustomizerWithSample,
}) => {
  return (
    <div className="relative bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 border-b border-zinc-800/80 overflow-hidden py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
      {/* Stadium Light Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12">
        {/* Left Column: Headlines & Benefits */}
        <div className="max-w-2xl text-center lg:text-left space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 via-zinc-900 to-amber-500/10 border border-amber-500/40 text-amber-300 pl-2 pr-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            <img
              src={DW_LOGO_URL}
              alt="DW IMPORTS"
              referrerPolicy="no-referrer"
              className="w-5 h-5 object-contain rounded"
            />
            <span>DW IMPORTS • Coleção 2025/2026 & Mantos Históricos</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]">
            O Manto do Seu Time com{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
              Seu Nome e Número
            </span>{' '}
            Personalizados
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
            Escolha seu clube, seleção mundial ou camisa retrô histórica. Personalize nome e número nas costas, patrocínio oficial e patches de campeão com visualização em tempo real!
          </p>

          {/* Pricing Highlight Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-zinc-400 block text-[11px]">Camisas de Clubes</span>
              <strong className="text-white font-black text-sm">R$ 150,00</strong>
            </div>

            <div className="bg-zinc-900/90 border border-amber-500/40 p-2.5 rounded-xl text-center">
              <span className="text-amber-400 block text-[11px] font-bold">Camisas Retrô</span>
              <strong className="text-amber-300 font-black text-sm">R$ 170,00</strong>
            </div>

            <div className="bg-zinc-900/90 border border-emerald-500/40 p-2.5 rounded-xl text-center">
              <span className="text-emerald-400 block text-[11px] font-bold">Seleções Mundiais</span>
              <strong className="text-emerald-300 font-black text-sm">R$ 150,00</strong>
            </div>

            <div className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-xl text-center">
              <span className="text-zinc-400 block text-[11px]">Nome / Patch / Patrocínio</span>
              <strong className="text-zinc-200 font-black text-sm">+ R$ 20,00 cada</strong>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
            <button
              type="button"
              id="hero-btn-retro"
              onClick={() => onSelectCategory('retro')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-5 py-3 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ver Camisas Retrô (R$ 170)</span>
            </button>

            <button
              type="button"
              id="hero-btn-selecoes"
              onClick={() => onSelectCategory('selecoes')}
              className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Ver Seleções (R$ 150)</span>
            </button>

            <a
              href={`https://wa.me/55${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Gostaria+de+fazer+um+pedido+personalizado`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600/90 hover:bg-emerald-500 text-white px-4 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Right Column: Interactive Featured Card Teaser */}
        <div className="w-full max-w-sm bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-700/80 rounded-2xl p-5 shadow-2xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full">
              Simulador Interativo
            </span>
            <span className="text-xs text-zinc-400 font-mono">Costas 3D</span>
          </div>

          {/* Mini Mockup Visual */}
          <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 flex flex-col items-center justify-center">
            <div className="w-32 h-36 relative flex items-center justify-center">
              <svg viewBox="0 0 400 460" className="w-full h-full drop-shadow-xl">
                <path
                  d="M 130 50 Q 200 85 270 50 L 375 110 Q 365 175 330 190 L 295 160 L 295 425 Q 200 440 105 425 L 105 160 L 70 190 Q 35 175 25 110 Z"
                  fill="#FDD835"
                  stroke="#2E7D32"
                  strokeWidth="4"
                />
                <text x="200" y="160" textAnchor="middle" fontSize="30" fontWeight="900" fill="#1B5E20" letterSpacing="4">
                  SEU NOME
                </text>
                <text x="200" y="285" textAnchor="middle" fontSize="120" fontWeight="900" fill="#1B5E20" stroke="#FFFFFF" strokeWidth="2">
                  10
                </text>
              </svg>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 text-center">
              Digite seu nome e escolha qualquer número de 1 a 99
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenCustomizerWithSample}
            className="w-full mt-3 bg-zinc-800 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-all border border-zinc-700 hover:border-amber-400"
          >
            <span>Testar Personalização Agora</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
