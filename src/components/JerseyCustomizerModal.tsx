import React, { useState, useEffect } from 'react';
import { Jersey, CustomizationOptions, JerseySize } from '../types';
import { JerseyPreviewCanvas } from './JerseyPreviewCanvas';
import { 
  X, 
  Check, 
  ShoppingBag, 
  Ruler, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Send
} from 'lucide-react';
import { WHATSAPP_NUMBER } from '../data/initialJerseys';

interface JerseyCustomizerModalProps {
  jersey: Jersey | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (jersey: Jersey, customization: CustomizationOptions, unitPrice: number) => void;
  onOpenSizeGuide: () => void;
}

export const JerseyCustomizerModal: React.FC<JerseyCustomizerModalProps> = ({
  jersey,
  isOpen,
  onClose,
  onAddToCart,
  onOpenSizeGuide,
}) => {
  const [viewSide, setViewSide] = useState<'front' | 'back'>('back');
  const [size, setSize] = useState<JerseySize>('M');
  const [hasCustomNameNumber, setHasCustomNameNumber] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>('');
  const [customNumber, setCustomNumber] = useState<string>('10');
  const [hasSponsor, setHasSponsor] = useState<boolean>(false);
  const [selectedPatch, setSelectedPatch] = useState<string>('');

  // Lock background scroll on mobile when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Sync state whenever a new jersey is selected
  useEffect(() => {
    if (jersey && isOpen) {
      setViewSide('back');
      setSize('M');
      setHasCustomNameNumber(true);
      setCustomName(jersey.defaultPlayerName || '');
      setCustomNumber(jersey.defaultNumber || '10');
      setHasSponsor(false);
      setSelectedPatch(
        jersey.availablePatches && jersey.availablePatches.length > 0 
          ? jersey.availablePatches[0].id 
          : ''
      );
    }
  }, [jersey, isOpen]);

  if (!isOpen || !jersey) return null;

  // Stock status logic
  const isOutOfStock = jersey.inStock === false || jersey.stockStatus === 'out_of_stock';
  const isPreOrder = jersey.stockStatus === 'pre_order';
  const hasPromo = Boolean(jersey.promoPrice && jersey.promoPrice > 0 && jersey.promoPrice < jersey.basePrice);
  const effectiveBasePrice = hasPromo && jersey.promoPrice ? jersey.promoPrice : jersey.basePrice;

  // Price calculations:
  // Base: 150 (normal/selecao) or 170 (retro) or promoPrice
  // Name + Number: + R$ 20
  // Sponsor: + R$ 20
  // Patch: + R$ 20
  const nameNumberPrice = hasCustomNameNumber ? 20 : 0;
  const sponsorPrice = hasSponsor ? 20 : 0;
  const patchPrice = selectedPatch ? 20 : 0;
  const finalUnitPrice = effectiveBasePrice + nameNumberPrice + sponsorPrice + patchPrice;

  const currentCustomization: CustomizationOptions = {
    hasCustomNameNumber,
    customName: customName.trim(),
    customNumber: customNumber.trim(),
    hasSponsor,
    selectedPatch: selectedPatch || undefined,
    size,
  };

  const handleAddToCart = () => {
    onAddToCart(jersey, currentCustomization, finalUnitPrice);
    onClose();
  };

  const handleBuyNowWhatsApp = () => {
    const patchObj = jersey.availablePatches.find(p => p.id === selectedPatch);
    const textLines = [
      isOutOfStock 
        ? `👋 *Olá! Gostaria de encomendar uma camisa que está esgotada no site:*`
        : `👋 *Olá! Gostaria de encomendar uma camisa personalizada:*`,
      `👕 *Modelo:* ${jersey.name} (${jersey.season})`,
      `📦 *Status:* ${isOutOfStock ? 'Solicitação de Encomenda' : isPreOrder ? 'Sob Encomenda (7-15 dias)' : 'Pronta Entrega'}`,
      `📏 *Tamanho:* ${size}`,
      hasCustomNameNumber 
        ? `✍️ *Personalização:* Nome: "${customName || 'Sem nome'}" | Número: "${customNumber || 'Sem número'}" (+R$ 20,00)` 
        : `✍️ *Personalização:* Versão Lisa / Sem nome (+R$ 0,00)`,
      hasSponsor ? `🏢 *Patrocínio:* Com Patrocínio Máster (+R$ 20,00)` : `🏢 *Patrocínio:* Sem Patrocínio`,
      patchObj ? `🏆 *Patch:* ${patchObj.name} (+R$ 20,00)` : `🏆 *Patch:* Sem patch`,
      `💰 *Valor Total:* R$ ${finalUnitPrice.toFixed(2).replace('.', ',')}`,
      `📦 Como posso prosseguir com o pagamento (PIX) e envio?`
    ];

    const message = encodeURIComponent(textLines.join('\n'));
    window.open(`https://wa.me/55${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  const ALL_SIZES: JerseySize[] = ['P', 'M', 'G', 'GG', 'XGG'];
  const allowedSizes: JerseySize[] = jersey.availableSizes && jersey.availableSizes.length > 0
    ? jersey.availableSizes
    : ALL_SIZES;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-3 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden">
      <div 
        id="modal-customizer-container"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden h-[94dvh] sm:h-auto sm:max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-customizer"
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 text-zinc-400 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 rounded-full transition-colors border border-zinc-700 shadow-md"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Main Area (Both Left preview & Right options scroll fluidly on mobile) */}
        <div className="flex-1 overflow-y-auto touch-scroll overscroll-contain flex flex-col md:flex-row">
          
          {/* Left Column: Visual Canvas & Badge */}
          <div className="w-full md:w-1/2 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-3 sm:p-5 md:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-zinc-800 flex-shrink-0">
            <div className="w-full flex items-center justify-between mb-1 sm:mb-2 pr-8 sm:pr-0">
              <span className={`text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                jersey.type === 'retro' 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                  : jersey.type === 'selecao'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}>
                {jersey.type === 'retro' ? 'Camisa Retrô Clássica' : jersey.type === 'selecao' ? 'Manto de Seleção' : jersey.league}
              </span>
              <span className="text-[11px] sm:text-xs text-zinc-400 font-medium">Temporada {jersey.season}</span>
            </div>

            {/* Canvas Component */}
            <div className="w-full my-auto py-1 sm:py-2">
              <JerseyPreviewCanvas
                jersey={jersey}
                customization={currentCustomization}
                viewSide={viewSide}
                onToggleViewSide={() => setViewSide(prev => prev === 'front' ? 'back' : 'front')}
              />
            </div>

            {/* Quick Quality Guarantee tags */}
            <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-2 mt-2 sm:mt-4 pt-2 sm:pt-3 border-t border-zinc-800/80 text-[10px] sm:text-[11px] text-zinc-400 text-center">
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 mb-0.5" />
                <span>Qualidade 1:1</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400 mb-0.5" />
                <span>Com Rastreio</span>
              </div>
              <div className="flex flex-col items-center">
                <RefreshCw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400 mb-0.5" />
                <span>Garantia 7 Dias</span>
              </div>
            </div>
          </div>

          {/* Right Column: Customization Controls */}
          <div className="w-full md:w-1/2 p-4 sm:p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg sm:text-2xl font-black text-white leading-tight">
                  {jersey.name}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                  {jersey.description}
                </p>
              </div>

              {/* Price & Stock Status Banner */}
              <div className="p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[11px] text-zinc-400 block">Preço Base:</span>
                    {isOutOfStock ? (
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 px-1.5 py-0.2 rounded font-bold">
                        Esgotado
                      </span>
                    ) : isPreOrder ? (
                      <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.2 rounded font-bold">
                        Sob Encomenda
                      </span>
                    ) : (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                        Pronta Entrega
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    {hasPromo && (
                      <span className="text-xs text-zinc-500 line-through">
                        R$ {jersey.basePrice.toFixed(2).replace('.', ',')}
                      </span>
                    )}
                    <span className="text-base sm:text-lg font-bold text-white">
                      R$ {effectiveBasePrice.toFixed(2).replace('.', ',')}
                    </span>
                    {jersey.type === 'retro' && (
                      <span className="ml-1 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                        Retrô
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-zinc-400 block">Total do Manto:</span>
                  <span className="text-lg sm:text-xl font-black text-amber-400">
                    R$ {finalUnitPrice.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* SECTION 1: Size Selector */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                    1. Escolha o Tamanho:
                  </label>
                  <button
                    type="button"
                    id="btn-open-size-guide"
                    onClick={onOpenSizeGuide}
                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold underline underline-offset-2 py-1 px-2"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    Tabela de Medidas
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {ALL_SIZES.map((sz) => {
                    const isAvailable = allowedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        id={`btn-size-${sz}`}
                        onClick={() => setSize(sz)}
                        className={`min-h-[44px] py-2.5 rounded-xl text-sm font-bold transition-all border flex flex-col items-center justify-center relative ${
                          size === sz
                            ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-black scale-[1.02]'
                            : isAvailable
                            ? 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-750 active:scale-95'
                            : 'bg-zinc-900/60 text-zinc-600 border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <span>{sz}</span>
                        {!isAvailable && (
                          <span className="text-[8px] text-rose-400 font-mono -mt-0.5">Esgotado</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SECTION 2: Custom Name & Number */}
              <div className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
                <div className="flex items-center justify-between">
                  <label htmlFor="chk-custom-name-number" className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="chk-custom-name-number"
                      checked={hasCustomNameNumber}
                      onChange={(e) => {
                        setHasCustomNameNumber(e.target.checked);
                        if (e.target.checked) setViewSide('back');
                      }}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-600 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">
                      Nome & Número nas Costas
                    </span>
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    + R$ 20,00
                  </span>
                </div>

                {hasCustomNameNumber && (
                  <div className="mt-3 grid grid-cols-3 gap-2 animate-in fade-in duration-200">
                    <div className="col-span-2">
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">
                        Nome nas Costas:
                      </label>
                      <input
                        type="text"
                        id="input-custom-name"
                        maxLength={14}
                        value={customName}
                        onChange={(e) => {
                          setCustomName(e.target.value.toUpperCase());
                          setViewSide('back');
                        }}
                        placeholder="Ex: SEU NOME"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white font-bold uppercase focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">
                        Número (1-99):
                      </label>
                      <input
                        type="text"
                        id="input-custom-number"
                        maxLength={2}
                        value={customNumber}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          setCustomNumber(val);
                          setViewSide('back');
                        }}
                        placeholder="10"
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white font-bold text-center focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION 3: Official Patches (+ R$ 20) */}
              <div className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Patch de Competição (Manga):
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    + R$ 20,00
                  </span>
                </div>

                <select
                  id="select-patch"
                  value={selectedPatch}
                  onChange={(e) => setSelectedPatch(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs text-white font-medium focus:outline-none focus:border-amber-500 cursor-pointer min-h-[42px]"
                >
                  <option value="">Nenhum Patch (Sem acréscimo)</option>
                  {jersey.availablePatches.map((patch) => (
                    <option key={patch.id} value={patch.id}>
                      {patch.name} (+ R$ 20,00)
                    </option>
                  ))}
                </select>
              </div>

              {/* SECTION 4: Sponsor (+ R$ 20) */}
              <div className="p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
                <div className="flex items-center justify-between">
                  <label htmlFor="chk-sponsor" className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      id="chk-sponsor"
                      checked={hasSponsor}
                      onChange={(e) => setHasSponsor(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-600 accent-amber-500 cursor-pointer"
                    />
                    <span className="text-xs font-bold text-white">
                      Patrocínio Oficial / Máster
                    </span>
                  </label>
                  <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    + R$ 20,00
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1 ml-6">
                  Estampa oficial dos patrocinadores idêntica ao modelo dos jogadores.
                </p>
              </div>
            </div>

            {/* Spacer for bottom padding on mobile */}
            <div className="h-4 sm:h-2" />
          </div>
        </div>

        {/* Sticky Actions Bar at the bottom (ALWAYS visible on any phone or desktop screen) */}
        <div className="sticky bottom-0 left-0 right-0 p-3 sm:p-4 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 z-20 flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            id="btn-add-to-cart-customizer"
            onClick={handleAddToCart}
            className="flex-1 bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-zinc-950 py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20 min-h-[48px]"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Adicionar ao Carrinho (R$ {finalUnitPrice.toFixed(2).replace('.', ',')})</span>
          </button>

          <button
            type="button"
            id="btn-buy-whatsapp-direct"
            onClick={handleBuyNowWhatsApp}
            className="bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg min-h-[48px]"
            title="Pedir direto no WhatsApp da loja"
          >
            <Send className="w-4 h-4" />
            <span>Pedir no Zap</span>
          </button>
        </div>
      </div>
    </div>
  );
};

