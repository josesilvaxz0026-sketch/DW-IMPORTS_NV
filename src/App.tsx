import React, { useState, useEffect, useMemo } from 'react';
import { Jersey, CartItem, CustomizationOptions } from './types';
import { INITIAL_JERSEYS, WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from './data/initialJerseys';
import { Navbar } from './components/Navbar';
import { LeagueCards, LEAGUES_DATA } from './components/LeagueCards';
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
  Phone, 
  Check,
  SearchX,
  Sparkles
} from 'lucide-react';

const JERSEYS_STORAGE_KEY = 'manto_store_jerseys_catalog_v1';
const CART_STORAGE_KEY = 'manto_store_cart_v1';

export function matchesLeagueFilter(j: Jersey, leagueId: string): boolean {
  if (leagueId === 'all') return true;
  const l = j.league.toLowerCase();
  const t = j.team.toLowerCase();
  const cat = j.category;
  const type = j.type;

  if (leagueId === 'la_liga') {
    return l.includes('la liga') || l.includes('espanha') || t.includes('real madrid') || t.includes('barcelona') || t.includes('atlético');
  }
  if (leagueId === 'premier_league') {
    return l.includes('premier') || l.includes('inglaterra') || t.includes('manchester') || t.includes('arsenal') || t.includes('liverpool') || t.includes('chelsea');
  }
  if (leagueId === 'ligue_1') {
    return l.includes('ligue 1') || l.includes('frança') || t.includes('psg');
  }
  if (leagueId === 'bundesliga') {
    return l.includes('bundesliga') || l.includes('alemanha') || t.includes('bayern') || t.includes('dortmund') || t.includes('leverkusen');
  }
  if (leagueId === 'serie_a') {
    return l.includes('serie a') || l.includes('itália') || t.includes('milan') || t.includes('inter') || t.includes('juventus') || t.includes('roma');
  }
  if (leagueId === 'brasileirao') {
    return cat === 'brasileirao' || l.includes('brasileir') || (
      t.includes('flamengo') || t.includes('palmeiras') || t.includes('corinthians') || 
      t.includes('são paulo') || t.includes('vasco') || t.includes('botafogo') || 
      t.includes('fluminense') || t.includes('grêmio') || t.includes('internacional') || 
      t.includes('santos') || t.includes('atlético-mg') || t.includes('cruzeiro')
    );
  }
  if (leagueId === 'selecoes') {
    return cat === 'selecoes' || type === 'selecao' || l.includes('seleç');
  }
  if (leagueId === 'retro') {
    return cat === 'retro' || type === 'retro' || l.includes('retrô') || l.includes('clássicos');
  }
  return true;
}

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
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
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

  // Cart actions
  const handleAddToCart = (item: CartItem) => {
    setCart(prev => {
      // Check if exact same item exists (same jersey, name, number, size, patch, sponsor)
      const existingIdx = prev.findIndex(
        i => i.jersey.id === item.jersey.id &&
             i.customization.size === item.customization.size &&
             i.customization.hasCustomNameNumber === item.customization.hasCustomNameNumber &&
             i.customization.customName === item.customization.customName &&
             i.customization.customNumber === item.customization.customNumber &&
             i.customization.hasSponsor === item.customization.hasSponsor &&
             i.customization.selectedPatch === item.customization.selectedPatch
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += item.quantity;
        updated[existingIdx].totalPrice = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
        return updated;
      }

      return [item, ...prev];
    });

    showToast(`Manto do ${item.jersey.team} adicionado ao carrinho!`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.cartItemId === cartItemId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              totalPrice: newQty * item.unitPrice,
            };
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

  // Extract unique popular teams for the selected league
  const availableTeams = useMemo(() => {
    const teamsSet = new Set<string>();
    jerseys.forEach(j => {
      if (matchesLeagueFilter(j, selectedLeague) && j.team) {
        teamsSet.add(j.team);
      }
    });
    return Array.from(teamsSet).sort();
  }, [jerseys, selectedLeague]);

  // Filter and Sort Jerseys
  const filteredJerseys = useMemo(() => {
    return jerseys.filter(j => {
      // League filter
      if (!matchesLeagueFilter(j, selectedLeague)) {
        return false;
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
  }, [jerseys, selectedLeague, selectedTeam, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const selectedLeagueObj = LEAGUES_DATA.find(l => l.id === selectedLeague) || LEAGUES_DATA[0];

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
        selectedCategory={selectedLeague}
        onSelectCategory={(cat) => {
          setSelectedLeague(cat);
          setSelectedTeam('');
        }}
      />

      {/* Direct on-screen League Cards with Country Flags */}
      <LeagueCards
        selectedLeague={selectedLeague}
        onSelectLeague={(leagueId) => {
          setSelectedLeague(leagueId);
          setSelectedTeam('');
        }}
        jerseys={jerseys}
      />

      {/* League & Team Filter Sub-Bar */}
      <LeagueFilter
        selectedLeague={selectedLeague}
        onSelectLeague={(leagueId) => {
          setSelectedLeague(leagueId);
          setSelectedTeam('');
        }}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        availableTeams={availableTeams}
        totalResults={filteredJerseys.length}
      />

      {/* Main Product Catalog Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Active League Title & Pricing Summary */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/60 border border-zinc-800/80 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-700 flex items-center justify-center text-2xl shadow-inner">
              {selectedLeagueObj.flag}
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{selectedLeagueObj.name}</span>
                <span className="text-xs font-semibold text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                  {selectedLeagueObj.country}
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                {selectedLeague === 'retro' 
                  ? 'Mantos históricos clássicos por R$ 170,00 com personalização'
                  : 'Camisas oficiais tailandesas 1:1 por R$ 150,00 com frete grátis acima de 2 unidades'}
              </p>
            </div>
          </div>

          {/* Pricing Highlight Badges */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-xl font-bold">
              Nome & Número: <strong className="text-amber-400">+R$ 20</strong>
            </span>
            <span className="bg-zinc-950 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-xl font-bold">
              Patrocínio/Patch: <strong className="text-amber-400">+R$ 20</strong>
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
            <h3 className="text-base font-bold text-white mb-1">Nenhum manto encontrado</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto mb-4">
              Não encontramos camisas para os filtros selecionados. Tente selecionar outra liga ou limpe os filtros.
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLeague('all');
                  setSelectedTeam('');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl transition-colors"
              >
                Ver Todas as Camisas
              </button>
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors border border-zinc-700"
              >
                Adicionar Nova Camisa
              </button>
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
          setSelectedLeague(cat);
          setSelectedTeam('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* ALL MODALS */}
      {/* 1. Jersey 3D Customizer Modal */}
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
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        discountApplied={discountApplied}
        onClearCart={handleClearCart}
      />

      {/* 4. Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        onSelectCategory={(cat) => {
          setSelectedLeague(cat);
          setIsSupportOpen(false);
        }}
        onOpenSizeGuide={() => {
          setIsSupportOpen(false);
          setIsSizeGuideOpen(true);
        }}
      />

      {/* 5. Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* 6. Admin Catalog Modal */}
      <AdminCatalogModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        jerseys={jerseys}
        onAddJersey={handleAddJersey}
        onDeleteJersey={handleDeleteJersey}
        onResetCatalog={handleResetCatalog}
      />
    </div>
  );
}
