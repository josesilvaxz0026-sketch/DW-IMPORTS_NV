import React, { useState, useEffect, useMemo } from 'react';
import { Jersey, CartItem, CustomizationOptions, OrderRecord } from './types';
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
import { AdminAuthModal } from './components/AdminAuthModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Footer } from './components/Footer';
import { 
  MessageCircle, 
  Phone, 
  Check,
  SearchX,
  Sparkles,
  Layers,
  Plus,
  ShieldCheck,
  Truck
} from 'lucide-react';

const JERSEYS_STORAGE_KEY = 'manto_store_jerseys_catalog_v1';
const CART_STORAGE_KEY = 'manto_store_cart_v1';
const ORDERS_STORAGE_KEY = 'manto_store_orders_v1';
const ADMIN_PIN_STORAGE_KEY = 'manto_store_admin_pin_v1';
const ADMIN_AUTH_STORAGE_KEY = 'manto_store_admin_auth_v1';

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

  // Load orders from LocalStorage
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
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
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('all');
  const [selectedStockFilter, setSelectedStockFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');

  // Modal Dialogs State
  const [customizingJersey, setCustomizingJersey] = useState<Jersey | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(0);

  // Admin PIN and Authentication State (Default PIN: dw2025)
  const [adminPin, setAdminPin] = useState<string>(() => {
    try {
      return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || 'dw2025';
    } catch {
      return 'dw2025';
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_AUTH_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Global keyboard shortcut to open Admin dialog (Ctrl+Shift+A or Alt+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (isAdminAuthenticated) {
          setIsAdminOpen(true);
        } else {
          setIsAdminAuthModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAdminAuthenticated]);

  // Admin Authentication handlers
  const handleAuthenticateAdmin = (enteredPin: string): boolean => {
    if (enteredPin === adminPin) {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem(ADMIN_AUTH_STORAGE_KEY, 'true');
      } catch {
        // ignore
      }
      setIsAdminAuthModalOpen(false);
      setIsAdminOpen(true);
      showToast('Acesso de Administrador desbloqueado com sucesso!');
      return true;
    }
    return false;
  };

  const handleLogoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem(ADMIN_AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsAdminOpen(false);
    showToast('Sessão de Administrador encerrada.');
  };

  const handleChangePin = (newPin: string) => {
    setAdminPin(newPin);
    try {
      localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin);
    } catch {
      // ignore
    }
    showToast('Nova senha de administrador salva com sucesso!');
  };

  const handleOpenAdminTrigger = () => {
    if (isAdminAuthenticated) {
      setIsAdminOpen(true);
    } else {
      setIsAdminAuthModalOpen(true);
    }
  };

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

  // Sync orders to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart actions
  const handleAddToCart = (jersey: Jersey, customization: CustomizationOptions, unitPrice: number) => {
    const newItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      jersey,
      customization,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };

    setCart(prev => {
      // Check if exact same item exists (same jersey, name, number, size, patch, sponsor)
      const existingIdx = prev.findIndex(
        i => i.jersey.id === newItem.jersey.id &&
             i.customization.size === newItem.customization.size &&
             i.customization.hasCustomNameNumber === newItem.customization.hasCustomNameNumber &&
             i.customization.customName === newItem.customization.customName &&
             i.customization.customNumber === newItem.customization.customNumber &&
             i.customization.hasSponsor === newItem.customization.hasSponsor &&
             i.customization.selectedPatch === newItem.customization.selectedPatch
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += 1;
        updated[existingIdx].totalPrice = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
        return updated;
      }

      return [newItem, ...prev];
    });

    showToast(`Manto do ${jersey.team} adicionado ao carrinho!`);
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

  // Order actions
  const handleRegisterOrder = (newOrder: OrderRecord) => {
    setOrders(prev => [newOrder, ...prev]);
    showToast(`Pedido registrado no Painel de Controle!`);
  };

  const handleUpdateOrder = (orderId: string, status: OrderRecord['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Status do pedido atualizado!`);
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    showToast(`Pedido removido do histórico.`);
  };

  // Admin Catalog actions
  const handleAddJersey = (newJersey: Jersey) => {
    setJerseys(prev => [newJersey, ...prev]);
    showToast(`Manto ${newJersey.name} adicionado ao catálogo com sucesso!`);
  };

  const handleUpdateJersey = (updatedJersey: Jersey) => {
    setJerseys(prev => prev.map(j => j.id === updatedJersey.id ? updatedJersey : j));
    showToast(`Manto ${updatedJersey.name} atualizado com sucesso!`);
  };

  const handleDeleteJersey = (id: string) => {
    if (confirm('Deseja realmente excluir este manto do catálogo?')) {
      setJerseys(prev => prev.filter(j => j.id !== id));
      showToast('Camisa excluída do catálogo.');
    }
  };

  const handleResetCatalog = () => {
    setJerseys(INITIAL_JERSEYS);
    showToast('Catálogo restaurado com as camisas oficiais padrão!');
  };

  const handleImportCatalog = (imported: Jersey[]) => {
    setJerseys(imported);
    showToast(`${imported.length} camisas importadas com sucesso!`);
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

  // Extract unique seasons / years
  const availableYears = useMemo(() => {
    const yearsSet = new Set<string>();
    jerseys.forEach(j => {
      if (matchesLeagueFilter(j, selectedLeague) && j.season) {
        yearsSet.add(j.season);
      }
    });
    return Array.from(yearsSet).sort().reverse();
  }, [jerseys, selectedLeague]);

  // Extract unique models
  const availableModels = useMemo(() => {
    const modelsSet = new Set<string>();
    jerseys.forEach(j => {
      if (matchesLeagueFilter(j, selectedLeague) && j.modelType) {
        modelsSet.add(j.modelType);
      }
    });
    return Array.from(modelsSet).sort();
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

      // Year filter
      if (selectedYear !== 'all' && j.season !== selectedYear) {
        return false;
      }

      // Model filter
      if (selectedModel !== 'all' && j.modelType !== selectedModel) {
        return false;
      }

      // Stock status filter
      if (selectedStockFilter === 'in_stock') {
        if (j.stockStatus === 'out_of_stock' || j.stockStatus === 'pre_order' || j.inStock === false) return false;
      } else if (selectedStockFilter === 'pre_order') {
        if (j.stockStatus !== 'pre_order') return false;
      } else if (selectedStockFilter === 'promo') {
        if (!j.promoPrice || j.promoPrice <= 0) return false;
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
        const matchesModel = j.modelType?.toLowerCase().includes(q);

        if (!matchesName && !matchesTeam && !matchesLeague && !matchesSeason && !matchesPlayer && !matchesDesc && !matchesModel) {
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
  }, [jerseys, selectedLeague, selectedTeam, selectedYear, selectedModel, selectedStockFilter, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const cartTotalAmount = Math.max(0, cartSubtotal - discountApplied);

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
        jerseysCount={jerseys.length}
        isAdminAuthenticated={isAdminAuthenticated}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAdminAuth={handleOpenAdminTrigger}
        onLogoutAdmin={handleLogoutAdmin}
        selectedCategory={selectedLeague}
        onSelectCategory={(cat) => {
          setSelectedLeague(cat);
          setSelectedTeam('');
          setSelectedYear('all');
          setSelectedModel('all');
        }}
      />

      {/* Direct on-screen League Cards with Country Flags */}
      <LeagueCards
        selectedLeague={selectedLeague}
        onSelectLeague={(leagueId) => {
          setSelectedLeague(leagueId);
          setSelectedTeam('');
          setSelectedYear('all');
          setSelectedModel('all');
        }}
        jerseys={jerseys}
      />

      {/* League, Team, Year, Stock & Sort Filter Sub-Bar */}
      <LeagueFilter
        selectedLeague={selectedLeague}
        onSelectLeague={(leagueId) => {
          setSelectedLeague(leagueId);
          setSelectedTeam('');
          setSelectedYear('all');
          setSelectedModel('all');
        }}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        availableYears={availableYears}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        availableModels={availableModels}
        selectedStockFilter={selectedStockFilter}
        onSelectStockFilter={setSelectedStockFilter}
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

          {/* Pricing Highlight Badges & Conditional Admin Control Button */}
          <div className="flex items-center gap-2 text-xs flex-wrap">
            {isAdminAuthenticated ? (
              <button
                type="button"
                onClick={() => setIsAdminOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-3.5 py-1.5 rounded-xl font-black flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Gerenciar Catálogo & Estoque
              </button>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1.5 bg-zinc-950 border border-zinc-800 text-amber-400 font-bold px-3 py-1.5 rounded-xl">
                <Truck className="w-3.5 h-3.5" /> Frete Grátis na compra de 2+ mantos
              </span>
            )}
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
            <div className="flex justify-center flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedLeague('all');
                  setSelectedTeam('');
                  setSelectedYear('all');
                  setSelectedModel('all');
                  setSelectedStockFilter('all');
                }}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs py-2.5 px-5 rounded-xl transition-colors"
              >
                Ver Todas as Camisas
              </button>

              <a
                href={`https://wa.me/55${WHATSAPP_NUMBER}?text=Ol%C3%A1%21+Procuro+uma+camisa+espec%C3%ADfica+que+n%C3%A3o+encontrei+no+site`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-5 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" />
                Pedir Manto no WhatsApp
              </a>

              {isAdminAuthenticated && (
                <button
                  type="button"
                  onClick={() => setIsAdminOpen(true)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-bold text-xs py-2.5 px-5 rounded-xl transition-colors border border-zinc-750 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Cadastrar Este Modelo no Painel
                </button>
              )}
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
        isAdminAuthenticated={isAdminAuthenticated}
        onSelectCategory={(cat) => {
          setSelectedLeague(cat);
          setSelectedTeam('');
          setSelectedYear('all');
          setSelectedModel('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
        onOpenAdminAuth={handleOpenAdminTrigger}
      />

      {/* ALL MODALS */}
      {/* 1. Jersey 3D Customizer Modal */}
      <JerseyCustomizerModal
        jersey={customizingJersey}
        isOpen={!!customizingJersey}
        onClose={() => setCustomizingJersey(null)}
        onAddToCart={(j, cust, price) => handleAddToCart(j, cust, price)}
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
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 3. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        totalAmount={cartTotalAmount}
        discountApplied={discountApplied}
        onClearCart={handleClearCart}
        onRegisterOrder={handleRegisterOrder}
      />

      {/* 4. Support Chat Modal */}
      <SupportChatModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
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

      {/* 6. Admin Authentication Modal (Área Restrita / PIN) */}
      <AdminAuthModal
        isOpen={isAdminAuthModalOpen}
        onClose={() => setIsAdminAuthModalOpen(false)}
        onAuthenticate={handleAuthenticateAdmin}
        storedPin={adminPin}
      />

      {/* 7. Admin Control Center Modal (Painel de Controle DW IMPORTS - Somente com Acesso Autorizado) */}
      {isAdminAuthenticated && (
        <AdminCatalogModal
          isOpen={isAdminOpen}
          onClose={() => setIsAdminOpen(false)}
          jerseys={jerseys}
          orders={orders}
          currentPin={adminPin}
          onAddJersey={handleAddJersey}
          onUpdateJersey={handleUpdateJersey}
          onDeleteJersey={handleDeleteJersey}
          onResetCatalog={handleResetCatalog}
          onImportCatalog={handleImportCatalog}
          onUpdateOrder={handleUpdateOrder}
          onDeleteOrder={handleDeleteOrder}
          onLogout={handleLogoutAdmin}
          onChangePin={handleChangePin}
        />
      )}
    </div>
  );
}
