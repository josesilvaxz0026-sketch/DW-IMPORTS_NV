import React, { useState } from 'react';
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
  if (!isOpen || !jersey) return null;

  const [viewSide, setViewSide] = useState<'front' | 'back'>('back');
  const [size, setSize] = useState<JerseySize>('M');
  const [hasCustomNameNumber, setHasCustomNameNumber] = useState<boolean>(true);
  const [customName, setCustomName] = useState<string>(jersey.defaultPlayerName || '');
  const [customNumber, setCustomNumber] = useState<string>(jersey.defaultNumber || '10');
  const [hasSponsor, setHasSponsor] = useState<boolean>(false);
  const [selectedPatch, setSelectedPatch] = useState<string>(
    jersey.availablePatches.length > 0 ? jersey.availablePatches[0].id : ''
  );

  // Price calculations according to prompt:
  // Base: 150 (normal/selecao) or 170 (retro)
  // Name + Number: + R$ 20
  // Sponsor: + R$ 20
  // Patch: + R$ 20
  const nameNumberPrice = hasCustomNameNumber ? 20 : 0;
  const sponsorPrice = hasSponsor ? 20 : 0;
  const patchPrice = selectedPatch ? 20 : 0;
  const finalUnitPrice = jersey.basePrice + nameNumberPrice + sponsorPrice + patchPrice;

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
      `👋 *Olá! Gostaria de encomendar uma camisa personalizada:*`,
      `👕 *Modelo:* ${jersey.name} (${jersey.season})`,
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

  const SIZES: JerseySize[] = ['P', 'M', 'G', 'GG', 'XGG'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="modal-customizer-container"
        className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col md:flex-row"
      >
        {/* Close Button */}
        <button
          type="button"
          id="btn-close-customizer"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2 text-zinc-400 hover:text-white bg-zinc-800/90 hover:bg-zinc-700 rounded-full transition-colors border border-zinc-700"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Visual Canvas & Badge */}
        <div className="w-full md:w-1/2 bg-gradient-to-b from-zinc-950 via-zinc-900 to-zinc-950 p-4 sm:p-6 flex flex-col items-center justify-between border-b md:border-b-0 md:border-r border-zinc-800">
          <div className="w-full flex items-center justify-between mb-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
              jersey.type === 'retro' 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : jersey.type === 'selecao'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
            }`}>
              {jersey.type === 'retro' ? 'Camisa Retrô Clássica' : jersey.type === 'selecao' ? 'Manto de Seleção' : jersey.league}
            </span>
            <span className="text-xs text-zinc-400 font-medium">Temporada {jersey.season}</span>
          </div>

          {/* Canvas Component */}
          <div className="w-full my-auto py-2">
            <JerseyPreviewCanvas
              jersey={jersey}
              customization={currentCustomization}
              viewSide={viewSide}
              onToggleViewSide={() => setViewSide(prev => prev === 'front' ? 'back' : 'front')}
            />
          </div>

          {/* Quick Quality Guarantee tags */}
          <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 text-center">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400 mb-0.5" />
              <span>Qualidade Tailandesa 1:1</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-sky-400 mb-0.5" />
              <span>Envio com Rastreio</span>
            </div>
            <div className="flex flex-col items-center">
              <RefreshCw className="w-4 h-4 text-amber-400 mb-0.5" />
              <span>Garantia 7 Dias</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization Controls */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto max-h-[75vh] md:max-h-[85vh] flex flex-col justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {jersey.name}
            </h2>
            <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
              {jersey.description}
            </p>

            {/* Price Banner */}
            <div className="mt-3 p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/60 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400 block">Preço Base:</span>
                <span className="text-lg font-bold text-white">
                  R$ {jersey.basePrice.toFixed(2).replace('.', ',')}
                </span>
                {jersey.type === 'retro' && (
                  <span className="ml-2 text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-semibold">
                    Retrô Especial
                  </span>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs text-zinc-400 block">Total com Personalizações:</span>
                <span className="text-xl font-black text-amber-400">
                  R$ {finalUnitPrice.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            {/* SECTION 1: Size Selector */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  1. Escolha o Tamanho:
                </label>
                <button
                  type="button"
                  id="btn-open-size-guide"
                  onClick={onOpenSizeGuide}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  Tabela de Medidas
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    id={`btn-size-${sz}`}
                    onClick={() => setSize(sz)}
                    className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${
                      size === sz
                        ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md font-black scale-[1.02]'
                        : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:bg-zinc-750'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* SECTION 2: Custom Name & Number */}
            <div className="mt-5 p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
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
                  <label htmlFor="chk-custom-name-number" className="text-xs font-bold text-white cursor-pointer select-none">
                    Personalizar Nome e Número nas Costas
                  </label>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  + R$ 20,00
                </span>
              </div>

              {hasCustomNameNumber && (
                <div className="mt-3 grid grid-cols-3 gap-2 animate-in fade-in duration-200">
                  <div className="col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">
                      Nome nas Costas (Máx. 14 letras):
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-bold uppercase focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
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
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white font-bold text-center focus:outline-none focus:border-amber-500 placeholder:text-zinc-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: Official Patches (+ R$ 20) */}
            <div className="mt-4 p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  Patch de Competição nas Mangas:
                </label>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  + R$ 20,00 cada
                </span>
              </div>

              <select
                id="select-patch"
                value={selectedPatch}
                onChange={(e) => setSelectedPatch(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500 cursor-pointer"
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
            <div className="mt-4 p-3.5 bg-zinc-800/40 rounded-xl border border-zinc-700/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-sponsor"
                    checked={hasSponsor}
                    onChange={(e) => setHasSponsor(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-zinc-900 border-zinc-600 accent-amber-500 cursor-pointer"
                  />
                  <label htmlFor="chk-sponsor" className="text-xs font-bold text-white cursor-pointer select-none">
                    Incluir Patrocínio Oficial / Máster
                  </label>
                </div>
                <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  + R$ 20,00
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 mt-1 ml-6">
                Estampa oficial do patrocinador master e mangas idêntica ao modelo de jogo.
              </p>
            </div>
          </div>

          {/* Actions & Buttons */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              id="btn-add-to-cart-customizer"
              onClick={handleAddToCart}
              className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 py-3 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              Adicionar ao Carrinho (R$ {finalUnitPrice.toFixed(2).replace('.', ',')})
            </button>

            <button
              type="button"
              id="btn-buy-whatsapp-direct"
              onClick={handleBuyNowWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
              title="Pedir direto no WhatsApp da loja"
            >
              <Send className="w-4 h-4" />
              <span>Pedir no WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
