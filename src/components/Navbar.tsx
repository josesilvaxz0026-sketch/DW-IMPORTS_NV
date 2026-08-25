import React from 'react';
import { 
  ShoppingBag, 
  Search, 
  MessageCircle, 
  PlusCircle, 
  Sparkles, 
  Flame, 
  Phone,
  Layers,
  Award
} from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  onOpenSupport,
  onOpenAdmin,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 border-b border-zinc-800 backdrop-blur-md">
      {/* Top micro bar for WhatsApp & Shipping info */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-zinc-950 text-[11px] font-extrabold py-1 px-4 text-center flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-2">
          <span>🚚 Frete Grátis acima de 2 camisas para todo o Brasil!</span>
        </div>

        <div className="w-full sm:w-auto text-center font-black">
          🔥 Camisas de Clubes/Seleções R$ 150 | Camisas Retrô R$ 170 | Personalização R$ 20
        </div>

        <a 
          href={`https://wa.me/55${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Gostaria+de+fazer+um+pedido+de+camisa`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1 hover:underline font-bold"
        >
          <Phone className="w-3 h-3" />
          <span>Zap: {WHATSAPP_DISPLAY}</span>
        </a>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div 
          onClick={() => onSelectCategory('all')}
          className="flex items-center gap-2.5 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-amber-500/30 overflow-hidden flex items-center justify-center p-0.5 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            <img
              src={DW_LOGO_URL}
              alt="DW IMPORTS Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1">
              DW<span className="text-amber-400">IMPORTS</span>
            </span>
            <span className="text-[10px] text-zinc-400 block -mt-1 font-semibold tracking-wider uppercase">
              Camisas Personalizadas
            </span>
          </div>
        </div>

        {/* Quick Search Bar */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-navbar-search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar por time, seleção, jogador, ano ou liga..."
              className="w-full bg-zinc-900 border border-zinc-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Actions: Admin, Support Chat, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Catalog Manager Button */}
          <button
            type="button"
            id="btn-nav-admin"
            onClick={onOpenAdmin}
            className="px-2.5 sm:px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-400 border border-zinc-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Adicionar novas camisas e imagens"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Gerenciar Catálogo</span>
          </button>

          {/* Support Chat Button */}
          <button
            type="button"
            id="btn-nav-support"
            onClick={onOpenSupport}
            className="px-2.5 sm:px-3 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            title="Chat de Suporte ao Cliente"
          >
            <MessageCircle className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Suporte</span>
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            id="btn-nav-cart"
            onClick={onOpenCart}
            className="relative px-3 sm:px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg hover:shadow-amber-500/20"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="bg-zinc-950 text-amber-400 text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar time, retrô, seleção..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Category Pills Navigation Strip */}
      <div className="border-t border-zinc-850 bg-zinc-950/80 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-bold">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-white text-zinc-950 font-black shadow'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            🔥 Todas as Camisas
          </button>

          {/* Top category 1: Camisas Retrô */}
          <button
            type="button"
            id="nav-cat-retro"
            onClick={() => onSelectCategory('retro')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'retro'
                ? 'bg-amber-500 text-zinc-950 font-black shadow'
                : 'text-amber-300 hover:text-amber-200 bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            ⭐ Camisas Retrô (R$ 170)
          </button>

          {/* Top category 2: Seleções */}
          <button
            type="button"
            id="nav-cat-selecoes"
            onClick={() => onSelectCategory('selecoes')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'selecoes'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow'
                : 'text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 border border-emerald-500/30'
            }`}
          >
            🌍 Seleções Mundiais (R$ 150)
          </button>

          <button
            type="button"
            id="nav-cat-brasileirao"
            onClick={() => onSelectCategory('brasileirao')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedCategory === 'brasileirao'
                ? 'bg-white text-zinc-950 font-black shadow'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            🇧🇷 Brasileirão Série A
          </button>

          <button
            type="button"
            id="nav-cat-europeu"
            onClick={() => onSelectCategory('europeu')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap ${
              selectedCategory === 'europeu'
                ? 'bg-white text-zinc-950 font-black shadow'
                : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            ⚡ Ligas Europeias
          </button>
        </div>
      </div>
    </header>
  );
};
