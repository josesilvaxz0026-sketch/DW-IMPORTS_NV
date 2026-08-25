import React, { useState, useEffect } from 'react';
import { Jersey, JerseyCategory, JerseyType, CompetitionPatch } from '../types';
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
  ShieldAlert,
  Sparkles,
  Layers,
  Save
} from 'lucide-react';

interface AdminCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  jerseys: Jersey[];
  onAddJersey: (jersey: Jersey) => void;
  onDeleteJersey: (id: string) => void;
  onResetCatalog: () => void;
}

export const AdminCatalogModal: React.FC<AdminCatalogModalProps> = ({
  isOpen,
  onClose,
  jerseys,
  onAddJersey,
  onDeleteJersey,
  onResetCatalog,
}) => {
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

  const [activeTab, setActiveTab] = useState<'add' | 'list'>('add');

  // New Jersey Form State
  const [name, setName] = useState('');
  const [team, setTeam] = useState('');
  const [league, setLeague] = useState('Brasileirão Série A');
  const [category, setCategory] = useState<JerseyCategory>('brasileirao');
  const [type, setType] = useState<JerseyType>('normal');
  const [season, setSeason] = useState('2025/26');
  const [basePrice, setBasePrice] = useState<number>(150);
  const [imageFront, setImageFront] = useState('');
  const [description, setDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#B71C1C');
  const [secondaryColor, setSecondaryColor] = useState('#111111');
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontStrokeColor, setFontStrokeColor] = useState('#000000');
  const [defaultNumber, setDefaultNumber] = useState('10');
  const [defaultPlayerName, setDefaultPlayerName] = useState('');
  const [selectedPatchIds, setSelectedPatchIds] = useState<string[]>(['champions', 'libertadores', 'brasileirao']);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Handle Type Change (auto sets default price)
  const handleTypeChange = (newType: JerseyType) => {
    setType(newType);
    if (newType === 'retro') {
      setBasePrice(170);
      setCategory('retro');
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

  const handleSaveJersey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !team.trim()) {
      alert('Por favor, preencha o Nome e o Time da camisa.');
      return;
    }

    const availablePatches: CompetitionPatch[] = COMMON_PATCHES.filter(p => selectedPatchIds.includes(p.id));

    const newJersey: Jersey = {
      id: `custom-jersey-${Date.now()}`,
      name: name.trim(),
      team: team.trim(),
      league: league.trim(),
      category,
      type,
      season: season.trim() || '2025/26',
      basePrice: Number(basePrice) || (type === 'retro' ? 170 : 150),
      imageFront: imageFront.trim() || 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&auto=format&fit=crop&q=80',
      description: description.trim() || 'Camisa de futebol tailandesa 1:1 de alta qualidade com escudo bordado e tecido tecnológico.',
      primaryColor,
      secondaryColor,
      fontColor,
      fontStrokeColor,
      availablePatches,
      defaultNumber: defaultNumber.trim() || '10',
      defaultPlayerName: defaultPlayerName.trim().toUpperCase() || '',
      isFeatured: true,
    };

    onAddJersey(newJersey);
    setFeedbackMsg(`Manto "${newJersey.name}" adicionado com sucesso ao catálogo!`);
    setTimeout(() => {
      setFeedbackMsg('');
      setActiveTab('list');
    }, 1500);

    // Reset Form
    setName('');
    setTeam('');
    setImageFront('');
    setDescription('');
    setDefaultPlayerName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="modal-admin-catalog"
        className="relative w-full max-w-3xl bg-zinc-900 border border-zinc-700/90 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden h-[94dvh] sm:h-auto sm:max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-amber-500/30 overflow-hidden flex items-center justify-center p-0.5 shadow">
              <img
                src={DW_LOGO_URL}
                alt="DW IMPORTS"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                Painel DW IMPORTS • Gerenciar Catálogo
              </h2>
              <p className="text-[11px] sm:text-xs text-zinc-400">
                Adicione novas camisas, imagens, preços e gerencie seus mantos
              </p>
            </div>
          </div>

          <button
            type="button"
            id="btn-close-admin"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-zinc-800 bg-zinc-950/60 px-4 pt-2 flex-shrink-0">
          <button
            type="button"
            id="tab-admin-add"
            onClick={() => setActiveTab('add')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            Cadastrar Nova Camisa
          </button>
          <button
            type="button"
            id="tab-admin-list"
            onClick={() => setActiveTab('list')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Ver Todas as Camisas ({jerseys.length})
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto touch-scroll overscroll-contain flex-1 min-h-0">
          {feedbackMsg && (
            <div className="mb-4 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {activeTab === 'add' ? (
            <form onSubmit={handleSaveJersey} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome do Manto */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nome Completo da Camisa *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Camisa Real Madrid Titular 2025/2026 Mbappé"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Time / Clube */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Time / Seleção *
                  </label>
                  <input
                    type="text"
                    required
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    placeholder="Ex: Real Madrid, Flamengo, Brasil"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Tipo de Camisa */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Tipo do Manto (Preço padrão)
                  </label>
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(e.target.value as JerseyType)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="normal">Camisa de Clube Atual (R$ 150,00)</option>
                    <option value="retro">Camisa Retrô Clássica (R$ 170,00)</option>
                    <option value="selecao">Camisa de Seleção (R$ 150,00)</option>
                  </select>
                </div>

                {/* Categoria */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Categoria / Liga
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as JerseyCategory)}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="brasileirao">Brasileirão Série A</option>
                    <option value="europeu">Ligas Europeias</option>
                    <option value="selecoes">Seleções</option>
                    <option value="retro">Camisas Retrô</option>
                    <option value="outros">Outros Campeonatos</option>
                  </select>
                </div>

                {/* Preço Base */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Preço Base (R$)
                  </label>
                  <input
                    type="number"
                    min={50}
                    max={1000}
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <span className="text-[11px] text-zinc-500">
                    Regra: R$ 150 normal / R$ 170 retrô
                  </span>
                </div>

                {/* Temporada */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Temporada / Ano
                  </label>
                  <input
                    type="text"
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    placeholder="Ex: 2025/26 ou 1981"
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Jogador Padrão Sugerido */}
                <div>
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Nome e Nº Sugerido
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={defaultPlayerName}
                      onChange={(e) => setDefaultPlayerName(e.target.value.toUpperCase())}
                      placeholder="Ex: ZICO"
                      className="w-2/3 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white uppercase focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="text"
                      maxLength={2}
                      value={defaultNumber}
                      onChange={(e) => setDefaultNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="10"
                      className="w-1/3 bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-white text-center focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Upload ou Link da Foto da Camisa */}
                <div className="sm:col-span-2 p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800">
                  <label className="text-xs font-bold text-zinc-200 block mb-1.5 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    Imagem da Camisa (Upload de Arquivo ou URL)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        1. Fazer Upload do Celular / Computador:
                      </label>
                      <label className="flex items-center justify-center gap-2 w-full p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-dashed border-zinc-700 hover:border-amber-500 rounded-xl cursor-pointer text-xs text-zinc-300 transition-colors">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>Escolher foto da camisa...</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div>
                      <label className="text-[11px] text-zinc-400 block mb-1">
                        2. Ou cole a URL direta da imagem:
                      </label>
                      <input
                        type="url"
                        value={imageFront}
                        onChange={(e) => setImageFront(e.target.value)}
                        placeholder="https://exemplo.com/camisa.jpg"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>

                  {imageFront && (
                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={imageFront}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border border-zinc-700"
                      />
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Imagem carregada com sucesso
                      </span>
                    </div>
                  )}
                </div>

                {/* Cores do Manto para o Personalizador */}
                <div className="sm:col-span-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800">
                  <label className="text-xs font-bold text-zinc-300 block mb-2">
                    Cores do Manto (Para o Simulador 3D / SVG em Tempo Real)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Cor Primária</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-zinc-300">{primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Cor Secundária</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-zinc-300">{secondaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Cor do Nome/Nº</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fontColor}
                          onChange={(e) => setFontColor(e.target.value)}
                          className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-zinc-300">{fontColor}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[11px] text-zinc-400 block mb-1">Contorno Nº</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={fontStrokeColor}
                          onChange={(e) => setFontStrokeColor(e.target.value)}
                          className="w-8 h-8 rounded border border-zinc-700 cursor-pointer bg-transparent"
                        />
                        <span className="text-[11px] font-mono text-zinc-300">{fontStrokeColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Patches Disponíveis */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1.5">
                    Patches Disponíveis para Seleção (+ R$ 20 cada):
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {COMMON_PATCHES.map((patch) => {
                      const isSelected = selectedPatchIds.includes(patch.id);
                      return (
                        <button
                          type="button"
                          key={patch.id}
                          onClick={() => handlePatchToggle(patch.id)}
                          className={`p-2 rounded-lg text-left text-xs font-medium border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                          }`}
                        >
                          <span className="line-clamp-1">{patch.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Descrição */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-zinc-300 block mb-1">
                    Descrição do Tecido & Detalhes
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: Camisa oficial em tecido DryFit 100% poliéster tailandesa 1:1, escudos bordados de alta definição e tags originais."
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  id="btn-submit-new-jersey"
                  className="px-6 py-2.5 rounded-xl text-xs font-black text-zinc-950 bg-amber-500 hover:bg-amber-400 shadow-lg flex items-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" />
                  Salvar Manto no Catálogo
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400">
                  Total de mantos ativos no catálogo: <strong className="text-white">{jerseys.length}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Deseja restaurar o catálogo para as 25 camisas oficiais padrão?')) {
                      onResetCatalog();
                    }
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restaurar Catálogo Padrão
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {jerseys.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 group hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs border border-zinc-700"
                        style={{ backgroundColor: item.primaryColor, color: item.fontColor }}
                      >
                        {item.team.slice(0, 3).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{item.name}</h4>
                        <p className="text-[11px] text-zinc-400">
                          {item.league} • <span className="text-amber-400 font-bold">R$ {item.basePrice.toFixed(2).replace('.', ',')}</span>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteJersey(item.id)}
                      className="p-2 text-zinc-500 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
                      title="Excluir camisa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
