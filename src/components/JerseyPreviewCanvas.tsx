import React from 'react';
import { Jersey, CustomizationOptions } from '../types';
import { Sparkles, Shield, Award } from 'lucide-react';

interface JerseyPreviewCanvasProps {
  jersey: Jersey;
  customization: CustomizationOptions;
  viewSide: 'front' | 'back';
  onToggleViewSide?: () => void;
  interactive?: boolean;
}

export const JerseyPreviewCanvas: React.FC<JerseyPreviewCanvasProps> = ({
  jersey,
  customization,
  viewSide,
  onToggleViewSide,
  interactive = true,
}) => {
  const nameToDisplay = (customization.hasCustomNameNumber && customization.customName.trim())
    ? customization.customName.toUpperCase().slice(0, 15)
    : (jersey.defaultPlayerName || 'SEU NOME');

  const numberToDisplay = (customization.hasCustomNameNumber && customization.customNumber.trim())
    ? customization.customNumber.slice(0, 2)
    : (jersey.defaultNumber || '10');

  const patchSelected = jersey.availablePatches.find(p => p.id === customization.selectedPatch);

  // Determine jersey design characteristics
  const isVasco = jersey.team.toLowerCase().includes('vasco');
  const isStriped = jersey.name.toLowerCase().includes('rubro-negro') || 
                    jersey.name.toLowerCase().includes('tricolor') || 
                    jersey.name.toLowerCase().includes('alvinegr') ||
                    jersey.team.toLowerCase().includes('milan') ||
                    jersey.team.toLowerCase().includes('barcelona') ||
                    jersey.team.toLowerCase().includes('inter de milão') ||
                    jersey.team.toLowerCase().includes('atlético-mg') ||
                    jersey.team.toLowerCase().includes('grêmio');
  
  const isYellowBrasil = jersey.team.toLowerCase().includes('brasil') && !jersey.name.toLowerCase().includes('azul');

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto select-none">
      {/* Jersey View Toggle Badge */}
      {interactive && (
        <div className="flex items-center gap-2 mb-3 bg-zinc-900/90 text-white px-3 py-1.5 rounded-full border border-zinc-700 shadow-md text-xs font-semibold">
          <button
            type="button"
            id="btn-view-front"
            onClick={() => onToggleViewSide && onToggleViewSide()}
            className={`px-3 py-1 rounded-full transition-all ${
              viewSide === 'front' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Frente
          </button>
          <button
            type="button"
            id="btn-view-back"
            onClick={() => onToggleViewSide && onToggleViewSide()}
            className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
              viewSide === 'back' ? 'bg-amber-500 text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Costas (Nome & Nº)
            {customization.hasCustomNameNumber && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            )}
          </button>
        </div>
      )}

      {/* SVG Canvas for Photorealistic Jersey Vector */}
      <div 
        className="relative w-full aspect-[4/4.2] max-h-[210px] sm:max-h-[270px] md:max-h-[360px] rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800/80 p-3 sm:p-4 flex items-center justify-center shadow-2xl overflow-hidden cursor-pointer group"
        onClick={() => interactive && onToggleViewSide && onToggleViewSide()}
        title="Clique para virar a camisa"
      >
        {/* Subtle Stadium Light / Ambient Glow */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none blur-3xl rounded-full"
          style={{ backgroundColor: jersey.primaryColor }}
        />

        {/* Floating Patch Badge Indicator */}
        {patchSelected && (
          <div className="absolute top-2.5 right-2.5 z-20 bg-zinc-900/90 border border-amber-500/50 text-amber-400 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-lg backdrop-blur">
            <Award className="w-3 h-3 text-amber-400" />
            <span>{patchSelected.name.split(' ')[1] || 'Patch Oficial'}</span>
          </div>
        )}

        {/* Sponsor Badge Indicator */}
        {customization.hasSponsor && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-emerald-950/90 border border-emerald-500/40 text-emerald-400 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-medium tracking-wide">
            Com Patrocínio (+R$20)
          </div>
        )}

        {/* SVG Football Jersey Drawing */}
        <svg
          viewBox="0 0 400 460"
          className="w-full h-full max-h-full drop-shadow-[0_20px_25px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:scale-[1.02]"
        >
          <defs>
            {/* Jersey Fabric Shading Filter */}
            <linearGradient id={`grad-body-${jersey.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={jersey.primaryColor} stopOpacity="1" />
              <stop offset="70%" stopColor={jersey.primaryColor} stopOpacity="0.92" />
              <stop offset="100%" stopColor={jersey.secondaryColor || '#000'} stopOpacity="0.85" />
            </linearGradient>

            <linearGradient id="fabric-fold-overlay" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#000000" stopOpacity="0.15" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.35" />
            </linearGradient>

            {/* Diagonal Sash pattern for Vasco */}
            <pattern id="sash-vasco" width="400" height="460" patternUnits="userSpaceOnUse">
              <polygon points="0,70 120,440 180,440 60,70" fill="#FFFFFF" opacity="0.95" />
            </pattern>

            {/* Vertical Stripes pattern for Milan, Barça, Grêmio, Inter etc */}
            <pattern id={`stripes-${jersey.id}`} width="40" height="460" patternUnits="userSpaceOnUse">
              <rect x="0" y="0" width="20" height="460" fill={jersey.primaryColor} />
              <rect x="20" y="0" width="20" height="460" fill={jersey.secondaryColor} />
            </pattern>

            {/* Clip path for Jersey Silhouette */}
            <clipPath id={`jersey-clip-${jersey.id}-${viewSide}`}>
              <path d="M 130 50 Q 200 85 270 50 L 375 110 Q 365 175 330 190 L 295 160 L 295 425 Q 200 440 105 425 L 105 160 L 70 190 Q 35 175 25 110 Z" />
            </clipPath>
          </defs>

          {/* Base Jersey Body & Sleeves Shape */}
          <path
            d="M 130 50 Q 200 85 270 50 L 375 110 Q 365 175 330 190 L 295 160 L 295 425 Q 200 440 105 425 L 105 160 L 70 190 Q 35 175 25 110 Z"
            fill={`url(#grad-body-${jersey.id})`}
            stroke="#1e293b"
            strokeWidth="2"
          />

          {/* Texture / Pattern overlay within jersey clip */}
          <g clipPath={`url(#jersey-clip-${jersey.id}-${viewSide})`}>
            {isStriped && (
              <rect x="0" y="0" width="400" height="460" fill={`url(#stripes-${jersey.id})`} opacity="0.9" />
            )}

            {isVasco && (
              <polygon points="40,50 330,440 380,440 90,50" fill="#FFFFFF" opacity="0.95" />
            )}

            {/* Fabric creases / 3D realistic lighting simulation */}
            <rect x="0" y="0" width="400" height="460" fill="url(#fabric-fold-overlay)" />

            {/* Breathable Mesh Side Panels */}
            <path d="M 105 160 L 125 425 L 105 425 Z" fill="#000000" opacity="0.25" />
            <path d="M 295 160 L 275 425 L 295 425 Z" fill="#000000" opacity="0.25" />

            {/* Sleeve Ends / Cuffs */}
            <path d="M 25 110 L 70 190 L 60 195 L 18 115 Z" fill={jersey.secondaryColor || '#111'} opacity="0.8" />
            <path d="M 375 110 L 330 190 L 340 195 L 382 115 Z" fill={jersey.secondaryColor || '#111'} opacity="0.8" />

            {/* Competition Patch on Right/Left Sleeve */}
            {patchSelected && (
              <g transform="translate(325, 130) scale(0.65)">
                <circle cx="20" cy="20" r="18" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="2" />
                <circle cx="20" cy="20" r="14" fill="#0A192F" />
                <polygon points="20,8 23,16 32,16 25,21 28,30 20,24 12,30 15,21 8,16 17,16" fill="#D4AF37" />
              </g>
            )}
          </g>

          {/* Collar / Gola */}
          <path
            d="M 130 50 Q 200 88 270 50 Q 200 110 130 50 Z"
            fill={jersey.secondaryColor || '#111827'}
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* VIEW: COSTAS (BACK) - Name & Number */}
          {viewSide === 'back' && (
            <g id="jersey-back-details">
              {/* Custom Player / Customer Name */}
              <text
                x="200"
                y="148"
                textAnchor="middle"
                fontSize="26"
                fontWeight="900"
                fontFamily="'Montserrat', 'Arial Black', sans-serif"
                letterSpacing="4"
                fill={jersey.fontColor || '#FFFFFF'}
                stroke={jersey.fontStrokeColor || 'none'}
                strokeWidth={jersey.fontStrokeColor ? '1' : '0'}
                className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] transition-all duration-300"
              >
                {nameToDisplay}
              </text>

              {/* Custom Player / Customer Number */}
              <text
                x="200"
                y="275"
                textAnchor="middle"
                fontSize="118"
                fontWeight="900"
                fontFamily="'Impact', 'Arial Black', sans-serif"
                letterSpacing="-2"
                fill={jersey.fontColor || '#FFFFFF'}
                stroke={jersey.fontStrokeColor || '#000000'}
                strokeWidth={jersey.fontStrokeColor ? '3.5' : '1.5'}
                className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)] transition-all duration-300"
              >
                {numberToDisplay}
              </text>

              {/* Authentic Lower Back Sponsor (if selected) */}
              {customization.hasSponsor && (
                <g transform="translate(140, 360)">
                  <rect x="0" y="0" width="120" height="26" rx="4" fill="#000000" opacity="0.75" />
                  <text
                    x="60"
                    y="18"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="12"
                    fontWeight="800"
                    fontFamily="sans-serif"
                    letterSpacing="2"
                  >
                    PATROCÍNIO
                  </text>
                </g>
              )}

              {/* Bottom Authentic Dri-Fit / Hologram Tag */}
              <rect x="255" y="395" width="26" height="16" rx="2" fill="#C0C0C0" stroke="#71717A" strokeWidth="1" opacity="0.85" />
              <text x="268" y="407" textAnchor="middle" fontSize="7" fill="#18181B" fontWeight="bold">OFFICIAL</text>
            </g>
          )}

          {/* VIEW: FRENTE (FRONT) - Crest, Sponsor, Brand */}
          {viewSide === 'front' && (
            <g id="jersey-front-details">
              {/* Club Crest / Escudo (Chest Left) */}
              <g transform="translate(145, 125)">
                <circle cx="16" cy="16" r="18" fill="#FFFFFF" opacity="0.95" stroke="#D4AF37" strokeWidth="1.5" />
                <Shield className="w-6 h-6 text-zinc-900" x="4" y="4" />
                <text x="16" y="22" textAnchor="middle" fontSize="7" fontWeight="900" fill="#09090b">
                  {jersey.team.slice(0, 3).toUpperCase()}
                </text>
              </g>

              {/* Manufacturer Brand Logo (Chest Right) */}
              <g transform="translate(225, 130)">
                <path d="M 0 10 Q 15 2 30 18 Q 18 10 0 10 Z" fill={jersey.fontColor || '#FFFFFF'} />
              </g>

              {/* Central Master Sponsor */}
              <g transform="translate(130, 220)">
                {customization.hasSponsor ? (
                  <>
                    <rect x="0" y="0" width="140" height="38" rx="6" fill="#000000" opacity="0.75" stroke="#FFFFFF" strokeWidth="1" />
                    <text
                      x="70"
                      y="24"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="14"
                      fontWeight="900"
                      fontFamily="sans-serif"
                      letterSpacing="3"
                    >
                      PATROCÍNIO
                    </text>
                  </>
                ) : (
                  <text
                    x="70"
                    y="24"
                    textAnchor="middle"
                    fill={jersey.fontColor || '#FFFFFF'}
                    opacity="0.4"
                    fontSize="11"
                    fontWeight="600"
                    fontStyle="italic"
                  >
                    (Versão Limpa)
                  </text>
                )}
              </g>

              {/* Front Small Number (for National Teams like Brasil, Argentina) */}
              {jersey.type === 'selecao' && (
                <text
                  x="200"
                  y="180"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="900"
                  fill={jersey.fontColor || '#FFFFFF'}
                >
                  {numberToDisplay}
                </text>
              )}

              {/* Bottom Authentic Gold / Silver Seal */}
              <rect x="115" y="395" width="28" height="18" rx="3" fill="#D4AF37" opacity="0.9" />
              <text x="129" y="408" textAnchor="middle" fontSize="8" fill="#18181B" fontWeight="900">AUTHENTIC</text>
            </g>
          )}
        </svg>

        {/* Interactive Flip Overlay Prompt */}
        <div className="absolute bottom-2 text-zinc-400 text-[11px] bg-zinc-900/80 px-2.5 py-0.5 rounded-full backdrop-blur border border-zinc-800 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>Clique na camisa para virar ({viewSide === 'front' ? 'ver costas' : 'ver frente'})</span>
        </div>
      </div>

      {/* Live Customization Summary Tag */}
      <div className="mt-2 text-center">
        <p className="text-xs text-zinc-400">
          Visualização em Tempo Real: <strong className="text-zinc-200">{jersey.name}</strong>
        </p>
      </div>
    </div>
  );
};
