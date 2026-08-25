import React, { useState } from 'react';
import { CartItem } from '../types';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  ShieldCheck,
  Award
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, delta: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onOpenCheckout: (discount: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onOpenCheckout,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  const discountValue = (subtotal * discountPercent) / 100;
  const finalTotal = Math.max(0, subtotal - discountValue);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'DW10' || code === 'DWIMPORTS' || code === 'MANTO10' || code === 'FUTEBOL10' || code === 'BEMVINDO') {
      setDiscountPercent(10);
      setCouponSuccess('Cupom DW IMPORTS de 10% OFF aplicado com sucesso!');
      setCouponError('');
    } else if ((code === 'DW20' || code === 'MANTO20') && totalQuantity >= 2) {
      setDiscountPercent(20);
      setCouponSuccess('Cupom de 20% OFF para compras múltiplas aplicado!');
      setCouponError('');
    } else {
      setCouponError('Cupom inválido. Tente DW10');
      setCouponSuccess('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="drawer-cart"
        className="absolute inset-y-0 right-0 max-w-full flex pl-10"
      >
        <div className="w-screen max-w-md bg-zinc-900 border-l border-zinc-800 shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Seu Carrinho de Mantos</h3>
                <p className="text-[11px] text-zinc-400">
                  {totalQuantity} {totalQuantity === 1 ? 'manto selecionado' : 'mantos selecionados'}
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-close-cart"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Free Shipping Bar */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2 text-xs flex items-center justify-between text-amber-300">
            <span className="flex items-center gap-1.5 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {totalQuantity >= 2 ? '🎉 Parabéns! Você ganhou Frete Grátis!' : `Adicione mais ${2 - totalQuantity} camisa para Frete Grátis!`}
            </span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
            {items.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-bold text-white mb-1">Seu carrinho está vazio</h4>
                <p className="text-xs text-zinc-400 mb-4">
                  Navegue pelas categorias de clubes, seleções ou retrô e personalize sua camisa!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold py-2.5 px-5 rounded-xl transition-colors"
                >
                  Ver Catálogo de Camisas
                </button>
              </div>
            ) : (
              items.map((item) => {
                const patchObj = item.jersey.availablePatches.find(p => p.id === item.customization.selectedPatch);

                return (
                  <div
                    key={item.cartItemId}
                    className="p-3 bg-zinc-950 border border-zinc-800 rounded-xl space-y-2 relative group hover:border-zinc-700 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Jersey Mini Thumbnail */}
                      <div 
                        className="w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xs border border-zinc-700 overflow-hidden relative"
                        style={{ backgroundColor: item.jersey.primaryColor, color: item.jersey.fontColor }}
                      >
                        <span className="z-10">{item.jersey.team.slice(0, 3).toUpperCase()}</span>
                        <div className="absolute inset-0 bg-black/20"></div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="text-xs font-bold text-white line-clamp-1">
                            {item.jersey.name}
                          </h4>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-zinc-500 hover:text-rose-400 p-1 transition-colors"
                            title="Remover"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">
                          Tamanho: <span className="text-amber-400 font-bold">{item.customization.size}</span>
                        </p>

                        {/* Customization Badges */}
                        <div className="flex flex-wrap gap-1 mt-1.5 text-[10px]">
                          {item.customization.hasCustomNameNumber ? (
                            <span className="bg-zinc-800 text-zinc-200 px-1.5 py-0.5 rounded border border-zinc-700">
                              ✍️ {item.customization.customName || 'Sem nome'} #{item.customization.customNumber || '10'} (+R$20)
                            </span>
                          ) : (
                            <span className="bg-zinc-800/60 text-zinc-400 px-1.5 py-0.5 rounded">
                              Lisa / Sem nome
                            </span>
                          )}

                          {item.customization.hasSponsor && (
                            <span className="bg-emerald-950/80 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                              🏢 Patrocínio (+R$20)
                            </span>
                          )}

                          {patchObj && (
                            <span className="bg-amber-950/80 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800">
                              🏆 {patchObj.name.split(' ')[1] || 'Patch'} (+R$20)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price and Quantity Controls */}
                    <div className="pt-2 border-t border-zinc-850 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 rounded-lg p-0.5">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, -1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold text-white px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.cartItemId, 1)}
                          className="w-6 h-6 flex items-center justify-center text-zinc-400 hover:text-white rounded transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-amber-400">
                        R$ {item.totalPrice.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 bg-zinc-950 border-t border-zinc-800 space-y-3">
              {/* Cupom Form */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Cupom (ex: MANTO10)"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs text-white uppercase focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold border border-zinc-700 transition-colors"
                >
                  Aplicar
                </button>
              </form>

              {couponSuccess && (
                <p className="text-[11px] text-emerald-400 font-semibold">{couponSuccess}</p>
              )}
              {couponError && (
                <p className="text-[11px] text-rose-400 font-semibold">{couponError}</p>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-zinc-200">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discountValue > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Desconto ({discountPercent}%):</span>
                    <span>- R$ {discountValue.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-300">
                  <span>Frete:</span>
                  <span className="text-emerald-400 font-bold">
                    {totalQuantity >= 2 ? 'GRÁTIS' : 'A calcular'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Geral:</span>
                  <span className="text-amber-400 text-base">
                    R$ {finalTotal.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                id="btn-checkout-cart"
                onClick={() => {
                  onClose();
                  onOpenCheckout(discountValue);
                }}
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-amber-500/20"
              >
                <span>Avançar para o Pagamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
