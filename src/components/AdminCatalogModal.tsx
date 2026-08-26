import React, { useState, useEffect, useMemo } from 'react';
import { Jersey, JerseyCategory, JerseyType, CompetitionPatch, StockStatus, JerseySize, OrderRecord } from '../types';
import { COMMON_PATCHES } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';
import { 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  RotateCcw, 
  Sparkles,
  Layers,
  Save,
  Edit3,
  Copy,
  Download,
  UploadCloud,
  Search,
  Calendar,
  Tag,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Star,
  Sliders,
  DollarSign,
  Package,
  ShoppingBag,
  Phone,
  User,
  MapPin,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Lock,
  KeyRound,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface AdminCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  jerseys: Jersey[];
  orders?: OrderRecord[];
  currentPin?: string;
  onAddJersey: (jersey: Jersey) => void;
  onUpdateJersey: (jersey: Jersey) => void;
  onDeleteJersey: (id: string) => void;
  onResetCatalog: () => void;
  onImportCatalog?: (jerseys: Jersey[]) => void;
  onUpdateOrder?: (orderId: string, status: OrderRecord['status']) => void;
  onDeleteOrder?: (orderId: string) => void;
  onLogout?: () => void;
  onChangePin?: (newPin: string) => void;
}

const YEAR_SUGGESTIONS = [
  '2025/26',
  '2024/25',
  '2023/24',
  '2022/23',
  '2022',
  '2020',
  '2014',
  '2006',
  '2002',
  '1998',
  '1994',
  '1981',
  '1970',
];

const MODEL_TYPES = [
  { id: 'Titular (Home 1)', label: 'Titular (Uniforme 1)', short: 'Home 1' },
  { id: 'Reserva (Away 2)', label: 'Reserva (Uniforme 2)', short: 'Away 2' },
  { id: '3º Uniforme (Third 3)', label: '3º Uniforme (Third 3)', short: '3º Uniforme' },
  { id: 'Edição Especial / Comemorativa', label: 'Especial / Comemorativa', short: 'Especial' },
  { id: 'Camisa Retrô Histórica', label: 'Retrô Histórica', short: 'Retrô' },
  { id: 'Treino / Pré-Jogo', label: 'Treino / Aquecimento', short: 'Treino' },
  { id: 'Goleiro', label: 'Uniforme de Goleiro', short: 'Goleiro' },
];

const ALL_SIZES: JerseySize[] = ['P', 'M', 'G', 'GG', 'XGG'];

const POPULAR_TEAMS = [
  'Flamengo',
  'Palmeiras',
  'Corinthians',
  'São Paulo',
  'Vasco',
  'Fluminense',
  'Botafogo',
  'Santos',
  'Grêmio',
  'Internacional',
  'Atlético-MG',
  'Cruzeiro',
  'Real Madrid',
  'Barcelona',
  'Manchester City',
  'Arsenal',
  'Liverpool',
  'Chelsea',
  'Paris Saint-Germain (PSG)',
  'Bayern de Munique',
  'Inter de Milão',
  'Milan',
  'Juventus',
  'Brasil',
  'Argentina',
  'Portugal',
  'França',
  'Alemanha',
];

export const AdminCatalogModal: React.FC<AdminCatalogModalProps> = ({
  isOpen,
  onClose,
  jerseys,
  orders = [],
  currentPin = 'dw2025',
  onAddJersey,
  onUpdateJersey,
  onDeleteJersey,
  onResetCatalog,
  onImportCatalog,
  onUpdateOrder,
  onDeleteOrder,
  onLogout,
  onChangePin,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'add' | 'orders' | 'settings'>('inventory');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Security / PIN state
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMessage, setPinMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [modelType, setModelType] = useState('Titular (Home 1)');
  const [season, setSeason] = useState('2025/26');
  const [league, setLeague] = useState('Brasileirão Série A');
  const [category, setCategory] = useState<JerseyCategory>('brasileirao');
  const [type, setType] = useState<JerseyType>('normal');
  const [basePrice, setBasePrice] = useState<number>(150);
  const [promoPrice, setPromoPrice] = useState<number | undefined>(undefined);
  const [stockStatus, setStockStatus] = useState<StockStatus>('in_stock');
  const [availableSizes, setAvailableSizes] = useState<JerseySize[]>(['P', 'M', 'G', 'GG', 'XGG']);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  const [imageFront, setImageFront] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#B71C1C');
  const [secondaryColor, setSecondaryColor] = useState('#111111');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontStrokeColor, setFontStrokeColor] = useState('#000000');
  const [defaultNumber, setDefaultNumber] = useState('10');
  const [defaultPlayerName, setDefaultPlayerName] = useState('');
  const [selectedPatchIds, setSelectedPatchIds] = useState<string[]>([
    'champions',
    'libertadores',
    'brasileirao',
  ]);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Inventory Filter & Search
  const [listSearch, setListSearch] = useState('');
  const [listStockFilter, setListStockFilter] = useState<string>('all');
  const [listYearFilter, setListYearFilter] = useState('all');
  const [listLeagueFilter, setListLeagueFilter] = useState('all');

  // Lock background scroll on mobile when admin is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Auto generate name if not manually modified
  const handleAutoName = (newTeam: string, newModel: string, newSeason: string) => {
    if (!newTeam) return;
    const modelClean = newModel.split('(')[0].trim();
    setName(`Camisa ${newTeam} ${modelClean} ${newSeason}`);
  };

  // Handle Type Change (auto sets default price)
  const handleTypeChange = (newType: JerseyType) => {
    setType(newType);
    if (newType === 'retro') {
      setBasePrice(170);
      setCategory('retro');
      setModelType('Camisa Retrô Histórica');
    } else if (newType === 'selecao') {
      setBasePrice(150);
      setCategory('selecoes');
    } else {
      setBasePrice(150);
    }
  };

  // Image Upload handler (Base64 file reader)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageFront(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePatchToggle = (patchId: string) => {
    setSelectedPatchIds(prev => 
      prev.includes(patchId) ? prev.filter(id => id !== patchId) : [...prev, patchId]
    );
  };

  const handleToggleFormSize = (sz: JerseySize) => {
    setAvailableSizes(prev => 
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  // Start Editing an existing Jersey
  const handleStartEdit = (item: Jersey) => {
    setEditingId(item.id);
    setName(item.name);
    setTeam(item.team);
    setLeague(item.league);
    setCategory(item.category);
    setType(item.type);
    setSeason(item.season || '2025/26');
    setModelType(item.modelType || 'Titular (Home 1)');
    setBasePrice(item.basePrice || (item.type === 'retro' ? 170 : 150));
    setPromoPrice(item.promoPrice);
    setStockStatus(item.stockStatus || (item.inStock === false ? 'out_of_stock' : 'in_stock'));
    setAvailableSizes(item.availableSizes && item.availableSizes.length > 0 ? item.availableSizes : ['P', 'M', 'G', 'GG', 'XGG']);
    setIsBestSeller(Boolean(item.isBestSeller));
    setIsFeatured(Boolean(item.isFeatured));
    setImageFront(item.imageFront || '');
    setDescription(item.description || '');
    setPrimaryColor(item.primaryColor || '#B71C1C');
    setSecondaryColor(item.secondaryColor || '#111111');
    setFontColor(item.fontColor || '#FFFFFF');
    setFontStrokeColor(item.fontStrokeColor || '#000000');
    setDefaultNumber(item.defaultNumber || '10');
    setDefaultPlayerName(item.defaultPlayerName || '');
    setSelectedPatchIds(item.availablePatches ? item.availablePatches.map(p => p.id) : ['champions', 'libertadores', 'brasileirao']);
    setActiveTab('add');
  };

  // Duplicate a Jersey to quickly create another year or model
  const handleDuplicate = (item: Jersey) => {
    setEditingId(null);
    setName(`${item.name} (Cópia)`);
    setTeam(item.team);
    setLeague(item.league);
    setCategory(item.category);
    setType(item.type);
    setSeason(item.season || '2025/26');
    setModelType('Reserva (Away 2)');
    setBasePrice(item.basePrice);
    setPromoPrice(item.promoPrice);
    setStockStatus(item.stockStatus || 'in_stock');
    setAvailableSizes(item.availableSizes || ['P', 'M', 'G', 'GG', 'XGG']);
    setIsBestSeller(false);
    setIsFeatured(false);
    setImageFront(item.imageFront || '');
    setDescription(item.description || '');
    setPrimaryColor(item.secondaryColor || '#FFFFFF');
    setSecondaryColor(item.primaryColor || '#111111');
    setFontColor(item.primaryColor || '#111111');
    setFontStrokeColor(item.secondaryColor || '#FFFFFF');
    setDefaultNumber(item.defaultNumber || '10');
    setDefaultPlayerName(item.defaultPlayerName || '');
    setSelectedPatchIds(item.availablePatches ? item.availablePatches.map(p => p.id) : []);
    setActiveTab('add');
    setFeedbackMsg(`Manto ${item.team} duplicado! Modifique o ano/modelo e salve.`);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setName('');
    setTeam('');
    setImageFront('');
    setDescription('');
    setDefaultPlayerName('');
    setDefaultNumber('10');
    setPromoPrice(undefined);
    setStockStatus('in_stock');
    setAvailableSizes(['P', 'M', 'G', 'GG', 'XGG']);
    setIsBestSeller(false);
    setIsFeatured(false);
  };

  const handleSaveJersey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !team.trim()) {
      alert('Por favor, preencha o Nome e o Time da camisa.');
      return;
    }

    const availablePatches: CompetitionPatch[] = COMMON_PATCHES.filter(p => 
      selectedPatchIds.includes(p.id)
    );

    const savedJersey: Jersey = {
      id: editingId || `custom-jersey-${Date.now()}`,
      name: name.trim(),
      team: team.trim(),
      league: league.trim(),
      category,
      type,
      season: season.trim(),
      modelType: modelType.trim(),
      basePrice: Number(basePrice) || (type === 'retro' ? 170 : 150),
      promoPrice: promoPrice && promoPrice > 0 ? Number(promoPrice) : undefined,
      inStock: stockStatus !== 'out_of_stock',
      stockStatus,
      availableSizes: availableSizes.length > 0 ? availableSizes : ['P', 'M', 'G', 'GG', 'XGG'],
      isBestSeller,
      isFeatured,
      imageFront: imageFront.trim() || undefined,
      description: description.trim() || `Camisa oficial ${team} temporada ${season} com tecnologia respirável e escudo de alta definição.`,
      primaryColor,
      secondaryColor,
      fontColor,
      fontStrokeColor,
      defaultNumber: defaultNumber.trim() || '10',
      defaultPlayerName: defaultPlayerName.trim().toUpperCase() || undefined,
      availablePatches,
    };

    if (editingId) {
      onUpdateJersey(savedJersey);
      setFeedbackMsg(`Manto "${savedJersey.name}" atualizado com sucesso!`);
    } else {
      onAddJersey(savedJersey);
      setFeedbackMsg(`Novo manto "${savedJersey.name}" cadastrado no catálogo!`);
    }

    handleCancelEdit();
    setTimeout(() => {
      setActiveTab('inventory');
      setFeedbackMsg('');
    }, 1200);
  };

  // Quick Inline Status Update from Inventory Table
  const handleQuickStockChange = (jersey: Jersey, newStatus: StockStatus) => {
    const updated: Jersey = {
      ...jersey,
      stockStatus: newStatus,
      inStock: newStatus !== 'out_of_stock',
    };
    onUpdateJersey(updated);
  };

  // Quick Inline Size Toggle from Inventory Table
  const handleQuickSizeToggle = (jersey: Jersey, sz: JerseySize) => {
    const current = jersey.availableSizes && jersey.availableSizes.length > 0
      ? jersey.availableSizes
      : ALL_SIZES;
    const newSizes = current.includes(sz)
      ? current.filter(s => s !== sz)
      : [...current, sz];

    const updated: Jersey = {
      ...jersey,
      availableSizes: newSizes,
    };
    onUpdateJersey(updated);
  };

  // Quick Inline Toggle BestSeller / Featured
  const handleQuickToggleBestSeller = (jersey: Jersey) => {
    const updated: Jersey = {
      ...jersey,
      isBestSeller: !jersey.isBestSeller,
    };
    onUpdateJersey(updated);
  };

  const handleQuickToggleFeatured = (jersey: Jersey) => {
    const updated: Jersey = {
      ...jersey,
      isFeatured: !jersey.isFeatured,
    };
    onUpdateJersey(updated);
  };

  // Export JSON Catalog
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jerseys, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `catalogo-dw-imports-${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON Catalog
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImportCatalog) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportCatalog(parsed);
            setFeedbackMsg(`${parsed.length} camisas importadas com sucesso!`);
          } else {
            alert('Arquivo JSON inválido.');
          }
        } catch {
          alert('Erro ao processar arquivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Metrics Calculations
  const totalInStock = jerseys.filter(j => j.stockStatus === 'in_stock' || (j.inStock !== false && !j.stockStatus)).length;
  const totalPreOrder = jerseys.filter(j => j.stockStatus === 'pre_order').length;
  const totalOutOfStock = jerseys.filter(j => j.stockStatus === 'out_of_stock' || j.inStock === false).length;
  const totalOrdersCount = orders.length;
  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  // Filtered jerseys for the inventory management table
  const filteredCatalog = useMemo(() => {
    return jerseys.filter(j => {
      // Search
      if (listSearch.trim()) {
        const q = listSearch.toLowerCase().trim();
        const matches = 
          j.name.toLowerCase().includes(q) ||
          j.team.toLowerCase().includes(q) ||
          j.season.toLowerCase().includes(q) ||
          j.league.toLowerCase().includes(q) ||
          (j.modelType && j.modelType.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // Stock status filter
      if (listStockFilter === 'in_stock') {
        if (j.stockStatus === 'out_of_stock' || j.stockStatus === 'pre_order' || j.inStock === false) return false;
      } else if (listStockFilter === 'pre_order') {
        if (j.stockStatus !== 'pre_order') return false;
      } else if (listStockFilter === 'out_of_stock') {
        if (j.stockStatus !== 'out_of_stock' && j.inStock !== false) return false;
      } else if (listStockFilter === 'promo') {
        if (!j.promoPrice || j.promoPrice <= 0) return false;
      }

      // Year filter
      if (listYearFilter !== 'all' && j.season !== listYearFilter) {
        return false;
      }

      // League filter
      if (listLeagueFilter !== 'all' && j.category !== listLeagueFilter) {
        return false;
      }

      return true;
    });
  }, [jerseys, listSearch, listStockFilter, listYearFilter, listLeagueFilter]);

  // Unique seasons for list filter
  const uniqueSeasons = Array.from(new Set(jerseys.map(j => j.season))).filter(Boolean).sort().reverse();

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-hidden">
      <div 
        id="modal-admin-control-center"
        className="relative w-full max-w-5xl bg-zinc-900 border border-zinc-700 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden h-[95dvh] sm:h-[88vh] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-md flex items-center justify-center">
              <img
                src={DW_LOGO_URL}
                alt="DW IMPORTS"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Painel de Controle • DW IMPORTS</h3>
                <span className="text-[10px] bg-amber-500 text-zinc-950 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Admin Master
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Gerencie disponibilidade, estoque de tamanhos, preços, novos modelos e pedidos da loja
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onLogout && (
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="px-3 py-1.5 bg-zinc-900 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-400 border border-zinc-750 hover:border-rose-700/50 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                title="Encerrar sessão de administrador e bloquear painel"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bloquear / Sair</span>
              </button>
            )}

            <button
              type="button"
              id="btn-close-admin-panel"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Stats Banner */}
        <div className="bg-zinc-900/90 border-b border-zinc-800 px-4 py-2.5 grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs flex-shrink-0">
          <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-400 flex items-center gap-1">
              <Package className="w-3.5 h-3.5 text-zinc-300" /> Total Mantos:
            </span>
            <span className="font-black text-white text-sm">{jerseys.length}</span>
          </div>

          <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pronta Entrega:
            </span>
            <span className="font-black text-emerald-400 text-sm">{totalInStock}</span>
          </div>

          <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-purple-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Sob Encomenda:
            </span>
            <span className="font-black text-purple-400 text-sm">{totalPreOrder}</span>
          </div>

          <div className="bg-zinc-950/80 p-2 rounded-xl border border-zinc-800 flex items-center justify-between">
            <span className="text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Esgotados:
            </span>
            <span className="font-black text-rose-400 text-sm">{totalOutOfStock}</span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-amber-500/10 p-2 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <span className="text-amber-400 font-bold flex items-center gap-1">
              <ShoppingBag className="w-3.5 h-3.5" /> Pedidos Site:
            </span>
            <span className="font-black text-amber-300 text-sm">{totalOrdersCount}</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-4 py-2 bg-zinc-950 border-b border-zinc-800 flex-shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            id="tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'inventory'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Controle de Estoque & Disponibilidade</span>
            <span className="bg-zinc-950/40 text-current text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {jerseys.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-add"
            onClick={() => {
              setActiveTab('add');
              if (!editingId) handleCancelEdit();
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'add'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingId ? 'Editar Manto Selecionado' : 'Cadastrar Novo Manto'}</span>
          </button>

          <button
            type="button"
            id="tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Pedidos & Vendas</span>
            {orders.length > 0 && (
              <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {orders.length}
              </span>
            )}
          </button>

          <button
            type="button"
            id="tab-settings"
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 flex-shrink-0 ${
              activeTab === 'settings'
                ? 'bg-amber-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Backup & Configurações</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="bg-emerald-500 text-zinc-950 font-black text-xs px-4 py-2.5 flex items-center justify-between flex-shrink-0 animate-in fade-in duration-200">
            <span className="flex items-center gap-2">
              <Check className="w-4 h-4" /> {feedbackMsg}
            </span>
            <button onClick={() => setFeedbackMsg('')} className="text-zinc-950 hover:opacity-75">✕</button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-900/50">
          {/* ======================================================== */}
          {/* TAB 1: GESTÃO RÁPIDA DE ESTOQUE & DISPONIBILIDADE        */}
          {/* ======================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Filter Sub-bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-zinc-950/80 p-3 rounded-2xl border border-zinc-800">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={listSearch}
                    onChange={(e) => setListSearch(e.target.value)}
                    placeholder="Buscar camisa por clube, modelo, ano..."
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                  />
                  {listSearch && (
                    <button
                      onClick={() => setListSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  {/* Status filter */}
                  <select
                    value={listStockFilter}
                    onChange={(e) => setListStockFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">Todos os Status</option>
                    <option value="in_stock">🟢 Pronta Entrega</option>
                    <option value="pre_order">🟣 Sob Encomenda</option>
                    <option value="out_of_stock">🔴 Esgotados</option>
                    <option value="promo">🏷️ Em Promoção</option>
                  </select>

                  {/* Season filter */}
                  <select
                    value={listYearFilter}
                    onChange={(e) => setListYearFilter(e.target.value)}
                    className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="all">Todos os Anos</option>
                    {uniqueSeasons.map(yr => (
                      <option key={yr} value={yr}>{yr}</option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      handleCancelEdit();
                      setActiveTab('add');
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Manto
                  </button>
                </div>
              </div>

              {/* Items Inventory Grid / Table */}
              <div className="space-y-3">
                {filteredCatalog.length > 0 ? (
                  filteredCatalog.map((jersey) => {
                    const currentStatus = jersey.stockStatus || (jersey.inStock === false ? 'out_of_stock' : 'in_stock');
                    const jerseySizes = jersey.availableSizes && jersey.availableSizes.length > 0 
                      ? jersey.availableSizes 
                      : ALL_SIZES;
                    const hasPromo = Boolean(jersey.promoPrice && jersey.promoPrice > 0 && jersey.promoPrice < jersey.basePrice);

                    return (
                      <div
                        key={jersey.id}
                        className={`p-4 bg-zinc-950/80 rounded-2xl border ${
                          currentStatus === 'out_of_stock'
                            ? 'border-rose-900/60 bg-rose-950/10'
                            : currentStatus === 'pre_order'
                            ? 'border-purple-900/60 bg-purple-950/10'
                            : 'border-zinc-800 hover:border-zinc-700'
                        } transition-all space-y-3`}
                      >
                        {/* Top Line: Jersey basic details, Year badge, Pricing */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            {/* Color Avatar */}
                            <div 
                              className="w-10 h-10 rounded-xl border border-zinc-700 flex items-center justify-center font-bold text-xs shadow-inner flex-shrink-0"
                              style={{ 
                                background: `linear-gradient(135deg, ${jersey.primaryColor}, ${jersey.secondaryColor || '#111'})`,
                                color: jersey.fontColor || '#fff'
                              }}
                            >
                              {jersey.defaultNumber || '10'}
                            </div>

                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-white leading-tight">
                                  {jersey.name}
                                </h4>
                                <span className="bg-zinc-800 text-zinc-300 text-[10px] font-mono px-2 py-0.5 rounded-md border border-zinc-700">
                                  {jersey.season}
                                </span>
                                {jersey.modelType && (
                                  <span className="bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                                    {jersey.modelType.split('(')[0].trim()}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-zinc-400 mt-0.5">
                                {jersey.league} • Clube: <strong className="text-zinc-300">{jersey.team}</strong>
                              </p>
                            </div>
                          </div>

                          {/* Price & Highlights Quick Toggles */}
                          <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                            <div className="text-right mr-2">
                              <span className="text-[10px] text-zinc-500 block">Preço de Venda</span>
                              <div className="flex items-baseline gap-1">
                                {hasPromo && (
                                  <span className="text-[10px] text-zinc-500 line-through">
                                    R${jersey.basePrice}
                                  </span>
                                )}
                                <span className="text-xs font-black text-amber-400">
                                  R$ {(hasPromo && jersey.promoPrice ? jersey.promoPrice : jersey.basePrice).toFixed(2).replace('.', ',')}
                                </span>
                              </div>
                            </div>

                            {/* Flame Bestseller toggle */}
                            <button
                              type="button"
                              onClick={() => handleQuickToggleBestSeller(jersey)}
                              title="Marcar como Mais Vendida"
                              className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                                jersey.isBestSeller 
                                  ? 'bg-rose-600 text-white border-rose-500 shadow-md' 
                                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                              }`}
                            >
                              <Flame className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">Mais Vendida</span>
                            </button>

                            {/* Star Featured toggle */}
                            <button
                              type="button"
                              onClick={() => handleQuickToggleFeatured(jersey)}
                              title="Marcar como Destaque"
                              className={`p-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1 ${
                                jersey.isFeatured 
                                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md' 
                                  : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:text-zinc-300'
                              }`}
                            >
                              <Star className="w-3.5 h-3.5" />
                              <span className="text-[10px] hidden sm:inline">Destaque</span>
                            </button>
                          </div>
                        </div>

                        {/* Middle Line: Stock Availability Status Control + Size Manager */}
                        <div className="pt-2 border-t border-zinc-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 bg-zinc-900/40 p-2.5 rounded-xl">
                          {/* Stock Status Buttons (1-Click Availability) */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
                              Disponibilidade:
                            </span>

                            {/* 1. In Stock */}
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(jersey, 'in_stock')}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'in_stock'
                                  ? 'bg-emerald-500 text-zinc-950 border-emerald-400 shadow-md font-black'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white hover:border-emerald-500/50'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Pronta Entrega</span>
                            </button>

                            {/* 2. Pre Order */}
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(jersey, 'pre_order')}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'pre_order'
                                  ? 'bg-purple-600 text-white border-purple-500 shadow-md font-black'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white hover:border-purple-500/50'
                              }`}
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span>Sob Encomenda</span>
                            </button>

                            {/* 3. Out of Stock */}
                            <button
                              type="button"
                              onClick={() => handleQuickStockChange(jersey, 'out_of_stock')}
                              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                                currentStatus === 'out_of_stock'
                                  ? 'bg-rose-600 text-white border-rose-500 shadow-md font-black'
                                  : 'bg-zinc-900 text-zinc-400 border-zinc-700 hover:text-white hover:border-rose-500/50'
                              }`}
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              <span>Esgotado / Pausado</span>
                            </button>
                          </div>

                          {/* Available Sizes Matrix for this jersey */}
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mr-1">
                              Tamanhos:
                            </span>
                            {ALL_SIZES.map((sz) => {
                              const isSelected = jerseySizes.includes(sz);
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  onClick={() => handleQuickSizeToggle(jersey, sz)}
                                  title={isSelected ? `Tamanho ${sz} Disponível (Clique para esgotar)` : `Tamanho ${sz} Esgotado (Clique para ativar)`}
                                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border flex items-center justify-center ${
                                    isSelected
                                      ? 'bg-zinc-800 text-amber-400 border-amber-500/50 font-black'
                                      : 'bg-zinc-950 text-zinc-600 border-zinc-800 line-through'
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Bottom Line: Action buttons (Edit, Duplicate, Delete) */}
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(jersey)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-amber-400 border border-zinc-700 hover:border-amber-500 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Editar Completo
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDuplicate(jersey)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-sky-400 border border-zinc-700 hover:border-sky-500 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            Duplicar
                          </button>

                          <button
                            type="button"
                            onClick={() => onDeleteJersey(jersey.id)}
                            className="bg-zinc-900 hover:bg-rose-950/60 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-600/50 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Excluir
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                    <Search className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                    <p className="text-sm font-bold text-white">Nenhuma camisa encontrada com os filtros atuais.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setListSearch('');
                        setListStockFilter('all');
                        setListYearFilter('all');
                      }}
                      className="mt-3 text-xs bg-amber-500 text-zinc-950 font-bold px-4 py-2 rounded-xl"
                    >
                      Limpar Filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: CADASTRAR / EDITAR MANTO COMPLETO                 */}
          {/* ======================================================== */}
          {activeTab === 'add' && (
            <form onSubmit={handleSaveJersey} className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    {editingId ? 'Editando Manto do Catálogo' : 'Cadastrar Novo Manto de Qualquer Temporada / Ano'}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Preencha o clube, ano da temporada (ex: 2025/26, 2024, 2014, 2002...), modelo e disponibilidade.
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-xl font-bold"
                  >
                    Cancelar Edição
                  </button>
                )}
              </div>

              {/* SECTION: Basic Classification */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-4">
                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  1. Informações Básicas do Manto
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Clube ou Seleção *:</label>
                    <input
                      type="text"
                      list="team-suggestions"
                      value={team}
                      onChange={(e) => {
                        setTeam(e.target.value);
                        handleAutoName(e.target.value, modelType, season);
                      }}
                      placeholder="Ex: Flamengo, Real Madrid, Brasil..."
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                    <datalist id="team-suggestions">
                      {POPULAR_TEAMS.map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>

                  {/* Season / Year */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Temporada / Ano *:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={season}
                        onChange={(e) => {
                          setSeason(e.target.value);
                          handleAutoName(team, modelType, e.target.value);
                        }}
                        placeholder="Ex: 2025/26, 2024, 2014, 2002, 1998"
                        required
                        className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    {/* Quick year chips */}
                    <div className="flex items-center gap-1 mt-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {YEAR_SUGGESTIONS.slice(0, 7).map((yr) => (
                        <button
                          key={yr}
                          type="button"
                          onClick={() => {
                            setSeason(yr);
                            handleAutoName(team, modelType, yr);
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-mono transition-colors ${
                            season === yr ? 'bg-amber-500 text-zinc-950 font-bold' : 'bg-zinc-900 text-zinc-400 hover:text-white'
                          }`}
                        >
                          {yr}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Model Type */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Modelo da Camisa:</label>
                    <select
                      value={modelType}
                      onChange={(e) => {
                        setModelType(e.target.value);
                        handleAutoName(team, e.target.value, season);
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      {MODEL_TYPES.map((m) => (
                        <option key={m.id} value={m.id}>{m.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Category / League */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Liga / Categoria:</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const cat = e.target.value as JerseyCategory;
                        setCategory(cat);
                        if (cat === 'brasileirao') setLeague('Brasileirão Série A');
                        else if (cat === 'europeu') setLeague('La Liga (Espanha)');
                        else if (cat === 'selecoes') {
                          setLeague('Seleções Nacionais');
                          handleTypeChange('selecao');
                        } else if (cat === 'retro') {
                          setLeague('Mantos Retrô & Clássicos');
                          handleTypeChange('retro');
                        }
                      }}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="brasileirao">🇧🇷 Brasileirão Série A</option>
                      <option value="europeu">🌍 Clubes Europeus (La Liga, Premier, etc)</option>
                      <option value="selecoes">🏆 Seleções Nacionais</option>
                      <option value="retro">⭐ Mantos Retrô & Clássicos</option>
                    </select>
                  </div>

                  {/* Full Product Name */}
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Nome Completo do Produto (Exibição):</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Camisa Flamengo Titular 2025/26"
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION: Stock Availability & Pricing */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-4">
                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  2. Disponibilidade, Estoque & Preços
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Stock Status */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Status de Disponibilidade:</label>
                    <select
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="in_stock">🟢 Pronta Entrega (Envio Imediato)</option>
                      <option value="pre_order">🟣 Sob Encomenda (7 a 15 dias)</option>
                      <option value="out_of_stock">🔴 Esgotado / Pausado no Site</option>
                    </select>
                  </div>

                  {/* Base Price */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Preço Padrão (R$):</label>
                    <input
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      min="50"
                      max="1000"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  {/* Promo Price */}
                  <div>
                    <label className="text-xs font-bold text-zinc-300 mb-1 block">Preço Promocional (Opcional):</label>
                    <input
                      type="number"
                      value={promoPrice || ''}
                      onChange={(e) => setPromoPrice(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Deixe vazio se não houver"
                      min="50"
                      max="1000"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-amber-400 focus:outline-none focus:border-amber-500 font-bold"
                    />
                  </div>

                  {/* Available Sizes selector */}
                  <div className="sm:col-span-3">
                    <label className="text-xs font-bold text-zinc-300 mb-1.5 block">Tamanhos Disponíveis para Este Manto:</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ALL_SIZES.map((sz) => {
                        const active = availableSizes.includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => handleToggleFormSize(sz)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${
                              active
                                ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow font-black'
                                : 'bg-zinc-900 text-zinc-500 border-zinc-800 line-through'
                            }`}
                          >
                            <Check className={`w-3.5 h-3.5 ${active ? 'opacity-100' : 'opacity-0'}`} />
                            Tamanho {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Flags (Best Seller & Featured) */}
                  <div className="sm:col-span-3 flex items-center gap-4 pt-1">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isBestSeller}
                        onChange={(e) => setIsBestSeller(e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900 border-zinc-700"
                      />
                      <span className="flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-rose-500" /> Destacar como Mais Vendida
                      </span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="rounded text-amber-500 focus:ring-amber-500 w-4 h-4 bg-zinc-900 border-zinc-700"
                      />
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400" /> Destaque no Topo
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION: Simulator Colors & Image */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-4">
                <h5 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  3. Cores do Simulador 3D & Foto
                </h5>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Cor Principal:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={primaryColor}
                        onChange={(e) => setPrimaryColor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Cor Secundária:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={secondaryColor}
                        onChange={(e) => setSecondaryColor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Cor do Nome / Nº:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={fontColor}
                        onChange={(e) => setFontColor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Contorno do Nº:</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={fontStrokeColor}
                        onChange={(e) => setFontStrokeColor(e.target.value)}
                        className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={fontStrokeColor}
                        onChange={(e) => setFontStrokeColor(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Upload Image */}
                <div>
                  <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Foto Real do Manto (Upload ou URL):</label>
                  <div className="flex items-center gap-3">
                    <label className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-amber-500 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      Escolher Foto do Dispositivo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      value={imageFront}
                      onChange={(e) => setImageFront(e.target.value)}
                      placeholder="Ou cole a URL da imagem aqui"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Patches Selection */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3">
                <label className="text-xs font-black text-amber-400 uppercase tracking-wider block">
                  4. Patches Permitidos para este Manto:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {COMMON_PATCHES.map((patch) => {
                    const isSelected = selectedPatchIds.includes(patch.id);
                    return (
                      <button
                        key={patch.id}
                        type="button"
                        onClick={() => handlePatchToggle(patch.id)}
                        className={`p-2.5 rounded-xl text-xs font-semibold text-left transition-all border flex items-center justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 text-amber-300 border-amber-500/50'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span>{patch.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleCancelEdit();
                    setActiveTab('inventory');
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-5 py-3 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  id="btn-save-jersey-admin"
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 px-7 py-3 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Atualizar Manto no Catálogo' : 'Salvar e Publicar no Catálogo'}
                </button>
              </div>
            </form>
          )}

          {/* ======================================================== */}
          {/* TAB 3: PEDIDOS & VENDAS DA LOJA                          */}
          {/* ======================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    Histórico de Pedidos dos Clientes
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Acompanhe todos os pedidos feitos no site com detalhes de personalização e dados de entrega.
                  </p>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-xl border border-amber-500/30">
                  Total de Pedidos: {orders.length}
                </span>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => {
                    const statusColors = {
                      pending: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
                      confirmed: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
                      in_production: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
                      shipped: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
                      delivered: 'bg-zinc-800 text-zinc-200 border-zinc-700',
                      cancelled: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
                    };

                    const statusLabels = {
                      pending: 'Pendente / Aguardando PIX',
                      confirmed: 'Confirmado / Pago',
                      in_production: 'Em Produção',
                      shipped: 'Enviado / Em Rota',
                      delivered: 'Entregue',
                      cancelled: 'Cancelado',
                    };

                    const cleanPhone = order.customerPhone ? order.customerPhone.replace(/\D/g, '') : '';

                    return (
                      <div
                        key={order.id}
                        className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-amber-400 font-mono">
                                #{order.id}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${statusColors[order.status]}`}>
                                {statusLabels[order.status]}
                              </span>
                            </div>
                            <span className="text-[11px] text-zinc-500">
                              Realizado em: {new Date(order.createdAt).toLocaleString('pt-BR')}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Update status selector */}
                            {onUpdateOrder && (
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrder(order.id, e.target.value as OrderRecord['status'])}
                                className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-xl px-2.5 py-1 focus:outline-none focus:border-amber-500 cursor-pointer"
                              >
                                <option value="pending">Pendente</option>
                                <option value="confirmed">Confirmado / Pago</option>
                                <option value="in_production">Em Produção</option>
                                <option value="shipped">Enviado</option>
                                <option value="delivered">Entregue</option>
                                <option value="cancelled">Cancelado</option>
                              </select>
                            )}

                            {/* Open WhatsApp directly with client */}
                            {cleanPhone && (
                              <a
                                href={`https://wa.me/55${cleanPhone}?text=Ol%C3%A1+${encodeURIComponent(order.customerName)}%2C+referente+ao+seu+pedido+${order.id}+na+DW+IMPORTS%3A`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                title="Conversar no WhatsApp"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </a>
                            )}

                            {onDeleteOrder && (
                              <button
                                type="button"
                                onClick={() => onDeleteOrder(order.id)}
                                className="p-1.5 text-zinc-500 hover:text-rose-400 bg-zinc-900 rounded-lg transition-colors"
                                title="Excluir Registro de Pedido"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-800/60">
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-amber-400" />
                            <span><strong>Cliente:</strong> {order.customerName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-emerald-400" />
                            <span><strong>WhatsApp:</strong> {order.customerPhone}</span>
                          </div>
                          {order.customerAddress && (
                            <div className="sm:col-span-2 flex items-start gap-2">
                              <MapPin className="w-3.5 h-3.5 text-sky-400 mt-0.5" />
                              <span><strong>Endereço:</strong> {order.customerAddress}</span>
                            </div>
                          )}
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-1.5">
                          <h6 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                            Itens do Pedido:
                          </h6>
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-zinc-900 rounded-xl border border-zinc-800/80 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-white">{item.jersey.name}</span>
                                <span className="text-zinc-400 text-[11px] ml-2">
                                  Tam: <strong className="text-amber-400">{item.customization.size}</strong> | Qtd: {item.quantity}
                                </span>
                                {item.customization.hasCustomNameNumber && (
                                  <span className="text-emerald-400 text-[11px] block">
                                    ✍️ Nome: {item.customization.customName || 'Sem nome'} | Nº: {item.customization.customNumber || '10'}
                                  </span>
                                )}
                              </div>
                              <span className="font-black text-white">
                                R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Total Line */}
                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80 text-xs">
                          {order.discountApplied ? (
                            <span className="text-emerald-400 font-bold">
                              🏷️ Desconto: R$ {order.discountApplied.toFixed(2).replace('.', ',')}
                            </span>
                          ) : <span />}
                          <span className="text-sm font-black text-amber-400">
                            Total: R$ {order.totalAmount.toFixed(2).replace('.', ',')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-950/60 rounded-2xl border border-zinc-800">
                  <ShoppingBag className="w-8 h-8 text-zinc-500 mx-auto mb-2" />
                  <p className="text-sm font-bold text-white">Nenhum pedido registrado no momento.</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Quando um cliente finalizar um pedido no site, ele aparecerá aqui com todos os dados.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: BACKUP, EXPORTAÇÃO & RESTAURAÇÃO                  */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              {/* Security & Password Section */}
              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-amber-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <Lock className="w-4 h-4 text-amber-400" />
                    Segurança & Senha de Acesso do Painel
                  </h4>
                  <span className="text-[11px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md font-bold">
                    Proteção Ativa
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Os clientes comuns da loja não têm acesso ao painel de controle. Você pode alterar a senha de acesso mestre a qualquer momento.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                      Nova Senha / Master PIN:
                    </label>
                    <input
                      type="password"
                      value={newPin}
                      onChange={(e) => setNewPin(e.target.value)}
                      placeholder="Nova senha (ex: dw2026)..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-300 mb-1">
                      Confirmar Nova Senha:
                    </label>
                    <input
                      type="password"
                      value={confirmPin}
                      onChange={(e) => setConfirmPin(e.target.value)}
                      placeholder="Repita a nova senha..."
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {pinMessage && (
                  <div
                    className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                      pinMessage.type === 'success'
                        ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                        : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                    }`}
                  >
                    {pinMessage.type === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{pinMessage.text}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!newPin.trim()) {
                        setPinMessage({ type: 'error', text: 'Digite uma nova senha válida.' });
                        return;
                      }
                      if (newPin.trim().length < 4) {
                        setPinMessage({ type: 'error', text: 'A senha deve ter no mínimo 4 caracteres.' });
                        return;
                      }
                      if (newPin.trim() !== confirmPin.trim()) {
                        setPinMessage({ type: 'error', text: 'As senhas digitadas não coincidem.' });
                        return;
                      }

                      if (onChangePin) {
                        onChangePin(newPin.trim());
                        setNewPin('');
                        setConfirmPin('');
                        setPinMessage({ type: 'success', text: 'Senha de administrador alterada com sucesso!' });
                      }
                    }}
                    className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                    Salvar Nova Senha
                  </button>

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        onLogout();
                        onClose();
                      }}
                      className="bg-zinc-850 hover:bg-rose-950/40 text-zinc-300 hover:text-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 hover:border-rose-700 flex items-center gap-1.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Encerrar Sessão e Bloquear Painel
                    </button>
                  )}
                </div>
              </div>

              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-amber-400" />
                  Exportar Backup do Catálogo
                </h4>
                <p className="text-xs text-zinc-400">
                  Baixe um arquivo JSON com todas as suas camisas, disponibilidades, preços e personalizações configuradas.
                </p>
                <button
                  type="button"
                  onClick={handleExportJSON}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  Baixar Catálogo em JSON ({jerseys.length} Mantos)
                </button>
              </div>

              {onImportCatalog && (
                <div className="p-4 bg-zinc-950/80 rounded-2xl border border-zinc-800 space-y-3">
                  <h4 className="text-sm font-black text-white flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-sky-400" />
                    Importar Catálogo (Arquivo JSON)
                  </h4>
                  <p className="text-xs text-zinc-400">
                    Carregue um arquivo JSON previamente exportado para restaurar ou adicionar camisas em lote.
                  </p>
                  <label className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl border border-zinc-700 inline-flex items-center gap-2 transition-colors cursor-pointer">
                    <UploadCloud className="w-4 h-4 text-sky-400" />
                    Selecionar Arquivo JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportFile}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="p-4 bg-zinc-950/80 rounded-2xl border border-rose-900/40 space-y-3">
                <h4 className="text-sm font-black text-rose-400 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Catálogo Oficial de Fábrica
                </h4>
                <p className="text-xs text-zinc-400">
                  Volta o catálogo para as camisas padrão oficiais da DW IMPORTS (Flamengo, Real Madrid, Brasil, etc.).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja realmente resetar o catálogo para as camisas padrão? Suas edições personalizadas serão substituídas.')) {
                      onResetCatalog();
                      setFeedbackMsg('Catálogo resetado com sucesso.');
                    }
                  }}
                  className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 font-bold text-xs px-4 py-2.5 rounded-xl border border-rose-800/60 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Camisas Padrão
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
