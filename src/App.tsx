import React, { useState, useEffect, useMemo } from 'react';
import { Jersey, CartItem, CustomizationOptions, JerseyCategory } from './types';
import { INITIAL_JERSEYS, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from './data/initialJerseys';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { LeagueFilter } from './components/LeagueFilter';
import { JerseyCard } from './components/JerseyCard';
import { JerseyCustomizerModal } from './components/JerseyCustomizerModal';
import { CartDrawer } from './components/CartDrawer';
import { SupportChatModal } from './components/SupportChatModal';
import { SizeGuideModal } from './components/SizeGuideModal';
import { AdminCatalogModal } from './components/AdminCatalogModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { 
  MessageCircle, 
  ShoppingBag, 
  Phone, 
  Sparkles, 
  Layers, 
  Check,
  SearchX,
  Flame,
  Award
} from 'lucide-react';

const JERSEYS_STORAGE_KEY = 'manto_store_jerseys_catalog_v1';
const CART_STORAGE_KEY = 'manto_store_cart_v1';

export default function App() {
  // Load jerseys from LocalStorage or fall back to INITIAL_JERSEYS
  const [jerseys, setJerseys] = useState<Jersey[]>(() => {
    try {
      const saved = localStorage.getItem(JERSEYS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_JERSEYS;
  });

  // Load cart from LocalStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return [];
  });

  // Navigation and Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Modal Dialogs State
  const [customizingJersey, setCustomizingJersey] = useState<Jersey | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(0);

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync jerseys to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(JERSEYS_STORAGE_KEY, JSON.stringify(jerseys));
    } catch {
      // ignore
    }
  }, [jerseys]);

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add customized jersey to cart
  const handleAddToCart = (jersey: Jersey, customization: CustomizationOptions, unitPrice: number) => {
    const cartItemId = `${jersey.id}-${customization.size}-${customization.customName}-${customization.customNumber}-${customization.hasSponsor}-${customization.selectedPatch || 'none'}`;
    
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.cartItemId === cartItemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        updated[existingIndex].totalPrice = updated[existingIndex].quantity * updated[existingIndex].unitPrice;
        return updated;
      } else {
        const newItem: CartItem = {
          cartItemId,
          jersey,
          customization,
          unitPrice,
          quantity: 1,
          totalPrice: unitPrice,
        };
        return [...prev, newItem];
      }
    });

    showToast(`"${jersey.name}" adicionado ao carrinho!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 
              ? { ...item, quantity: newQty, totalPrice: newQty * item.unitPrice } 
              : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Admin actions
  const handleAddJersey = (newJersey: Jersey) => {
    setJerseys(prev => [newJersey, ...prev]);
    showToast(`Manto ${newJersey.name} cadastrado com sucesso!`);
  };

  const handleDeleteJersey = (id: string) => {
    if (confirm('Deseja realmente excluir este manto do catálogo?')) {
      setJerseys(prev => prev.filter(j => j.id !== id));
      showToast('Camisa excluída do catálogo.');
    }
  };

  const handleResetCatalog = () => {
    setJerseys(INITIAL_JERSEYS);
    showToast('Catálogo restaurado com as camisas oficiais!');
  };

  // Extract unique popular teams for filtering
  const availableTeams = useMemo(() => {
    const teamsSet = new Set<string>();
    jerseys.forEach(j => {
      if (j.team) teamsSet.add(j.team);
    });
    return Array.from(teamsSet).sort();
  }, [jerseys]);

  // Filter and Sort Jerseys
  const filteredJerseys = useMemo(() => {
    return jerseys.filter(j => {
      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'retro' && j.type !== 'retro' && j.category !== 'retro') return false;
        if (selectedCategory === 'selecoes' && j.type !== 'selecao' && j.category !== 'selecoes') return false;
        if (selectedCategory === 'brasileirao' && j.category !== 'brasileirao') return false;
        if (selectedCategory === 'europeu' && j.category !== 'europeu') return false;
        if (selectedCategory === 'outros' && j.category !== 'outros') return false;
      }

      // Team filter
      if (selectedTeam && j.team.toLowerCase() !== selectedTeam.toLowerCase()) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = j.name.toLowerCase().includes(q);
        const matchesTeam = j.team.toLowerCase().includes(q);
        const matchesLeague = j.league.toLowerCase().includes(q);
        const matchesSeason = j.season.toLowerCase().includes(q);
        const matchesPlayer = j.defaultPlayerName?.toLowerCase().includes(q);
        const matchesDesc = j.description.toLowerCase().includes(q);

        if (!matchesName && !matchesTeam && !matchesLeague && !matchesSeason && !matchesPlayer && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'season-desc') return b.season.localeCompare(a.season);
      // Default: featured first, then bestsellers
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      if (a.isBestSeller && !b.isBestSeller) return -1;
      if (!a.isBestSeller && b.isBestSeller) return 1;
      return 0;
    });
  }, [jerseys, selectedCategory, selectedTeam, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Filter subsets for quick section views
  const retroJerseys = useMemo(() => jerseys.filter(j => j.type === 'retro' || j.category === 'retro'), [jerseys]);
  const selecoesJerseys = useMemo(() => jerseys.filter(j => j.type === 'selecao' || j.category === 'selecoes'), [jerseys]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans flex flex-col selection:bg-amber-500 selection:text-zinc-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-amber-500 text-zinc-950 font-black text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-300">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setSelectedTeam('');
        }}
      />

      {/* Hero Banner (Only shown if no active search to keep focus clean) */}
      {!searchQuery && selectedCategory === 'all' && (
        <HeroBanner
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          onOpenCustomizerWithSample={() => {
            const sample = jerseys.find(j => j.id === 'retro-brasil-2002') || jerseys[0];
            setCustomizingJersey(sample);
          }}
        />
      )}

      {/* League & Team Filter Bar */}
      <LeagueFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        availableTeams={availableTeams}
        totalResults={filteredJerseys.length}
      />

      {/* Main Product Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Heading & Highlights */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              {selectedCategory === 'retro' && '⭐ Camisas Retrô Históricas'}
              {selectedCategory === 'selecoes' && '🌍 Camisas de Seleções Mundiais'}
              {selectedCategory === 'brasileirao' && '🇧🇷 Mantos do Brasileirão Série A'}
              {selectedCategory === 'europeu' && '⚡ Gigantes das Ligas Europeias'}
              {selectedCategory === 'all' && '🔥 Todas as Camisas Disponíveis'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              {selectedCategory === 'retro' 
                ? 'Mantos históricos lendários por R$ 170,00 com personalização oficial'
                : 'Camisas tailandesas 1:1 de alta precisão por R$ 150,00 com frete para todo o Brasil'}
            </p>
          </div>

          {/* Quick Highlight Pills */}
          <div className="flex items-center gap-2 text-xs">
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-bold">
              Nome & Número: <strong className="text-amber-400">+R$ 20</strong>
            </span>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full font-bold">
              Patrocínio: <strong className="text-amber-400">+R$ 20</strong>
            </span>
          </div>
        </div>

        {/* Product Grid */}
        {filteredJerseys.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredJerseys.map((jersey) => (
              <JerseyCard
                key={jersey.id}
                jersey={jersey}
                onCustomize={(j) => setCustomizingJersey(j)}
              />
            ))}
          </div>
        ) : (
          /* Empty Search State */
          <div className="text-center py-16 px-4 bg-zinc-900/50 rounded-2xl border border-zinc-800/80 my-4">
            <SearchX className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">Nenhuma camisa encontrada</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Não encontramos resultados para sua busca atual. Tente buscar por outro time ou limpe os filtros.
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedTeam('');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl transition-colors"
              >
                Limpar Todos os Filtros
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors border border-zinc-700"
              >
                Adicionar Nova Camisa no Admin
              </button>
            </div>
          </div>
        )}

        {/* Special Highlight Row for Retrô and Seleções when viewing 'all' */}
        {selectedCategory === 'all' && !searchQuery && (
          <div className="mt-14 space-y-12">
            {/* Retrô Showcase Section */}
            <div className="bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-3xl border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    ⭐ Seção Especial
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    Camisas Retrô Clássicas (R$ 170,00)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Mantos lendários: Pelé 70, Zico 81, Romário 94, Ronaldo 2002, Ronaldinho 2006 e Zidane 2002.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('retro')}
                  className="self-start sm:self-auto bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-black py-2.5 px-5 rounded-xl shadow-lg transition-colors"
                >
                  Ver Todas as Retrô ({retroJerseys.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {retroJerseys.slice(0, 4).map((jersey) => (
                  <JerseyCard
                    key={jersey.id}
                    jersey={jersey}
                    onCustomize={(j) => setCustomizingJersey(j)}
                  />
                ))}
              </div>
            </div>

            {/* Seleções Showcase Section */}
            <div className="bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 p-6 sm:p-8 rounded-3xl border border-emerald-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    🌍 Coleção Internacional
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    Seleções Mundiais (R$ 150,00)
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Brasil, Argentina 3 Estrelas, França, Alemanha, Portugal e edições especiais.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('selecoes')}
                  className="self-start sm:self-auto bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-xs font-black py-2.5 px-5 rounded-xl shadow-lg transition-colors"
                >
                  Ver Todas as Seleções ({selecoesJerseys.length})
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {selecoesJerseys.slice(0, 4).map((jersey) => (
                  <JerseyCard
                    key={jersey.id}
                    jersey={jersey}
                    onCustomize={(j) => setCustomizingJersey(j)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Floating Quick Action Buttons (WhatsApp & Support Chat) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
        {/* Live Support Trigger */}
        <button
          type="button"
          id="btn-floating-support"
          onClick={() => setIsSupportOpen(true)}
          className="bg-zinc-900 hover:bg-zinc-800 text-sky-400 border border-zinc-700 hover:border-sky-500/50 p-3 rounded-full shadow-2xl transition-all flex items-center gap-2 group"
          title="Abrir Chat de Suporte"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold text-white whitespace-nowrap">
            Dúvidas & Suporte
          </span>
        </button>

        {/* WhatsApp Floating CTA */}
        <a
          href={`https://wa.me/55${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Vim+pelo+site+e+gostaria+de+fazer+um+pedido`}
          target="_blank"
          rel="noopener noreferrer"
          id="btn-floating-whatsapp"
          className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black p-3.5 rounded-full shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          title={`Falar no WhatsApp: ${WHATSAPP_DISPLAY}`}
        >
          <Phone className="w-5 h-5 text-zinc-950" />
          <span className="text-xs font-black hidden sm:inline">
            Falar no WhatsApp
          </span>
        </a>
      </div>

      {/* Footer */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* ALL MODALS */}

      {/* 1. Jersey Live Customizer Modal */}
      <JerseyCustomizerModal
        jersey={customizingJersey}
        isOpen={!!customizingJersey}
        onClose={() => setCustomizingJersey(null)}
        onAddToCart={handleAddToCart}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* 2. Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={(discount) => {
          setDiscountApplied(discount);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onOpenSizeGuide={() => {
          setIsSupportOpen(false);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* 4. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 5. Admin Catalog Manager Modal ("Adicionar camisas e imagens futuramente") */}
      <AdminCatalogModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        jerseys={jerseys}
        onAddJersey={handleAddJersey}
        onDeleteJersey={handleDeleteJersey}
        onResetCatalog={handleResetCatalog}
      />

      {/* 6. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        totalAmount={Math.max(0, cart.reduce((acc, i) => acc + i.totalPrice, 0) - discountApplied)}
        discountApplied={discountApplied}
        onClearCart={handleClearCart}
      />
    </div>
  );
}
