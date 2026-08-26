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
  Award,
  LogOut,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  jerseysCount?: number;
  isAdminAuthenticated?: boolean;
  onOpenCart: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  onOpenAdminAuth?: () => void;
  onLogoutAdmin?: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  cartCount,
  jerseysCount = 0,
  isAdminAuthenticated = false,
  onOpenCart,
  onOpenSupport,
  onOpenAdmin,
  onOpenAdminAuth,
  onLogoutAdmin,
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

        {/* Right Actions: Admin (if authenticated or login lock), Support Chat, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Admin Control Center Button (If authenticated) or Discreet Admin Key Login */}
          {isAdminAuthenticated ? (
            <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/40 rounded-xl p-0.5 animate-fadeIn">
              <button
                type="button"
                id="btn-nav-admin"
                onClick={onOpenAdmin}
                className="px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 text-zinc-950 font-black rounded-lg text-xs transition-all flex items-center gap-1.5 shadow-sm hover:brightness-110"
                title="Painel de Controle: Gerenciar estoque, disponibilidade, cadastrar mantos e ver pedidos"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Painel Lojista</span>
                {jerseysCount > 0 && (
                  <span className="bg-zinc-950 text-amber-400 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded">
                    {jerseysCount}
                  </span>
                )}
              </button>
              {onLogoutAdmin && (
                <button
                  type="button"
                  onClick={onLogoutAdmin}
                  title="Encerrar Sessão de Administrador"
                  className="p-1.5 text-zinc-400 hover:text-rose-400 rounded-lg hover:bg-zinc-900 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <button
              type="button"
              id="btn-nav-admin-login"
              onClick={onOpenAdminAuth}
              className="px-2.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-amber-400 border border-zinc-700/80 hover:border-amber-500/40 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
              title="Acesso Restrito / Lojista (Senha: dw2025)"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Lojista</span>
            </button>
          )}

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
            🔥 Todas
          </button>

          <button
            type="button"
            id="nav-cat-brasileirao"
            onClick={() => onSelectCategory('brasileirao')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'brasileirao'
                ? 'bg-emerald-500 text-zinc-950 font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🇧🇷</span> Brasileirão
          </button>

          <button
            type="button"
            id="nav-cat-premier"
            onClick={() => onSelectCategory('premier_league')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'premier_league'
                ? 'bg-purple-500 text-white font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🏴󠁧󠁢󠁥󠁮󠁧󠁿</span> Premier League
          </button>

          <button
            type="button"
            id="nav-cat-laliga"
            onClick={() => onSelectCategory('la_liga')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'la_liga'
                ? 'bg-rose-500 text-white font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🇪🇸</span> La Liga
          </button>

          <button
            type="button"
            id="nav-cat-ligue1"
            onClick={() => onSelectCategory('ligue_1')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'ligue_1'
                ? 'bg-blue-500 text-white font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🇫🇷</span> Ligue 1
          </button>

          <button
            type="button"
            id="nav-cat-bundesliga"
            onClick={() => onSelectCategory('bundesliga')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'bundesliga'
                ? 'bg-amber-500 text-zinc-950 font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🇩🇪</span> Bundesliga
          </button>

          <button
            type="button"
            id="nav-cat-seriea"
            onClick={() => onSelectCategory('serie_a')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'serie_a'
                ? 'bg-teal-500 text-zinc-950 font-black shadow'
                : 'text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800'
            }`}
          >
            <span>🇮🇹</span> Serie A
          </button>

          <button
            type="button"
            id="nav-cat-selecoes"
            onClick={() => onSelectCategory('selecoes')}
            className={`px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap flex items-center gap-1.5 ${
              selectedCategory === 'selecoes'
                ? 'bg-sky-500 text-zinc-950 font-black shadow'
                : 'text-sky-300 hover:text-sky-200 bg-sky-500/10 border border-sky-500/30'
            }`}
          >
            <span>🌍</span> Seleções
          </button>

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
            <span>⭐</span> Retrô (R$ 170)
          </button>
        </div>
      </div>
    </header>
  );
};
