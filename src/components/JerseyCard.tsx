import React, { useState } from 'react';
import { Jersey } from '../types';
import { Sparkles, Award, Eye, ShoppingBag, Shield } from 'lucide-react';

interface JerseyCardProps {
  jersey: Jersey;
  onCustomize: (jersey: Jersey) => void;
}

export const JerseyCard: React.FC<JerseyCardProps> = ({ jersey, onCustomize }) => {
  const [isHovered, setIsHovered] = useState(false);

  const isRetro = jersey.type === 'retro';
  const isSelecao = jersey.type === 'selecao';

  return (
    <div
      id={`jersey-card-${jersey.id}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-zinc-900/90 rounded-2xl border border-zinc-800/80 hover:border-amber-500/60 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {isRetro ? (
          <span className="bg-amber-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
            ⭐ Camisa Retrô
          </span>
        ) : isSelecao ? (
          <span className="bg-emerald-500 text-zinc-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-md">
            🌍 Seleção
          </span>
        ) : (
          <span className="bg-zinc-800/90 text-zinc-200 border border-zinc-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {jersey.league.split(' ')[0]}
          </span>
        )}

        {jersey.isBestSeller && (
          <span className="bg-rose-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full w-fit">
            Mais Vendida
          </span>
        )}
      </div>

      {/* Season Badge Top Right */}
      <div className="absolute top-3 right-3 z-10">
        <span className="bg-zinc-950/80 text-zinc-400 border border-zinc-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md backdrop-blur">
          {jersey.season}
        </span>
      </div>

      {/* Jersey Visual Preview Area */}
      <div 
        onClick={() => onCustomize(jersey)}
        className="relative w-full aspect-[4/3.8] bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 flex items-center justify-center p-4 cursor-pointer overflow-hidden"
      >
        {/* Glow ambient background */}
        <div 
          className="absolute inset-0 opacity-15 blur-2xl transition-opacity duration-300 group-hover:opacity-30"
          style={{ backgroundColor: jersey.primaryColor }}
        />

        {/* Photorealistic stylized vector jersey representation */}
        <div className="relative w-36 h-40 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 400 460" className="w-full h-full drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]">
            <defs>
              <linearGradient id={`card-grad-${jersey.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={jersey.primaryColor} />
                <stop offset="100%" stopColor={jersey.secondaryColor || '#111'} />
              </linearGradient>
            </defs>

            {/* Silhouette */}
            <path
              d="M 130 50 Q 200 85 270 50 L 375 110 Q 365 175 330 190 L 295 160 L 295 425 Q 200 440 105 425 L 105 160 L 70 190 Q 35 175 25 110 Z"
              fill={`url(#card-grad-${jersey.id})`}
              stroke="#334155"
              strokeWidth="2"
            />

            {/* Collar */}
            <path
              d="M 130 50 Q 200 88 270 50 Q 200 110 130 50 Z"
              fill={jersey.secondaryColor || '#111827'}
            />

            {/* Back preview (Name and Number preview on hover or default) */}
            <text
              x="200"
              y="160"
              textAnchor="middle"
              fontSize="28"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="3"
              fill={jersey.fontColor || '#FFFFFF'}
            >
              {jersey.defaultPlayerName || 'PERSONALIZAR'}
            </text>

            <text
              x="200"
              y="280"
              textAnchor="middle"
              fontSize="115"
              fontWeight="900"
              fontFamily="sans-serif"
              fill={jersey.fontColor || '#FFFFFF'}
              stroke={jersey.fontStrokeColor || '#000'}
              strokeWidth="2"
            >
              {jersey.defaultNumber || '10'}
            </text>
          </svg>
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
          <span className="bg-amber-500 text-zinc-950 text-xs font-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            Personalizar Agora
          </span>
        </div>
      </div>

      {/* Info & Footer */}
      <div className="p-4 bg-zinc-900/60 flex-1 flex flex-col justify-between border-t border-zinc-800/80">
        <div>
          <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
            <span>{jersey.team}</span>
            <span className="font-semibold text-zinc-300">{jersey.league}</span>
          </div>

          <h3 
            onClick={() => onCustomize(jersey)}
            className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 cursor-pointer leading-tight"
          >
            {jersey.name}
          </h3>

          <p className="text-[11px] text-zinc-400 mt-1 line-clamp-1">
            {jersey.description}
          </p>
        </div>

        {/* Customization Add-on note */}
        <div className="mt-3 pt-2.5 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-400">
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            + Nome/Nº (R$20)
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <Award className="w-3 h-3" />
            Patches (R$20)
          </span>
        </div>

        {/* Price & Action button */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] text-zinc-500 block leading-none">A partir de</span>
            <span className="text-base font-black text-white">
              R$ {jersey.basePrice.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onCustomize(jersey)}
            className="bg-zinc-800 hover:bg-amber-500 text-zinc-200 hover:text-zinc-950 text-xs font-bold py-2 px-3.5 rounded-xl transition-all border border-zinc-700 hover:border-amber-400 flex items-center gap-1.5 shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Personalizar</span>
          </button>
        </div>
      </div>
    </div>
  );
};
