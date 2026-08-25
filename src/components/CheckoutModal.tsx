import React, { useState } from 'react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';
import { 
  X, 
  Check, 
  Copy, 
  QrCode, 
  Send, 
  ShieldCheck, 
  Sparkles,
  MapPin,
  User,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  totalAmount: number;
  discountApplied: number;
  onClearCart: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  totalAmount,
  discountApplied,
  onClearCart,
}) => {
  if (!isOpen) return null;

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [cep, setCep] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Fake static PIX payload code
  const pixKey = "00020126580014BR.GOV.BCB.PIX0136dw-imports-pagamentos@gmail.com520400005303986540" + totalAmount.toFixed(2) + "5802BR5925DW IMPORTS FUTEBOL6009RIO DE JANEIRO62070503***6304B8F1";

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const handleCompleteWhatsAppOrder = () => {
    // Trigger confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const orderLines = [
      `⚡⚽ *NOVO PEDIDO - DW IMPORTS* ⚽⚡`,
      `----------------------------------------`,
      `👤 *Cliente:* ${customerName.trim() || 'Cliente Site'}`,
      `📱 *Telefone/WhatsApp:* ${customerPhone.trim() || 'Não informado'}`,
      `📍 *Endereço de Entrega:* ${address.trim() || 'A combinar'}, ${city.trim()} - CEP: ${cep.trim()}`,
      `----------------------------------------`,
      `🛒 *ITENS DO PEDIDO (${items.length}):*`
    ];

    items.forEach((item, idx) => {
      const patchObj = item.jersey.availablePatches.find(p => p.id === item.customization.selectedPatch);
      orderLines.push(`\n*${idx + 1}. ${item.jersey.name} (${item.jersey.season})*`);
      orderLines.push(`   • Tamanho: *${item.customization.size}* | Qtd: *${item.quantity}*`);
      if (item.customization.hasCustomNameNumber) {
        orderLines.push(`   • Personalização: Nome: *${item.customization.customName || 'Sem nome'}* | Nº: *${item.customization.customNumber || '10'}* (+R$ 20)`);
      } else {
        orderLines.push(`   • Personalização: Versão Lisa (+R$ 0)`);
      }
      if (item.customization.hasSponsor) {
        orderLines.push(`   • Patrocínio Oficial: Sim (+R$ 20)`);
      }
      if (patchObj) {
        orderLines.push(`   • Patch: ${patchObj.name} (+R$ 20)`);
      }
      orderLines.push(`   • Subtotal Item: R$ ${item.totalPrice.toFixed(2).replace('.', ',')}`);
    });

    orderLines.push(`----------------------------------------`);
    if (discountApplied > 0) {
      orderLines.push(`🏷️ *Desconto Cupom:* - R$ ${discountApplied.toFixed(2).replace('.', ',')}`);
    }
    orderLines.push(`💰 *VALOR TOTAL A PAGAR:* *R$ ${totalAmount.toFixed(2).replace('.', ',')}*`);
    orderLines.push(`💳 *Forma de Pagamento:* PIX / WhatsApp`);
    orderLines.push(`----------------------------------------`);
    orderLines.push(`Por favor, confirme a disponibilidade e a chave PIX para envio do comprovante!`);

    const encodedMsg = encodeURIComponent(orderLines.join('\n'));
    window.open(`https://wa.me/55${WHATSAPP_NUMBER}?text=${encodedMsg}`, '_blank');

    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="modal-checkout"
        className="relative w-full max-w-xl bg-zinc-900 border border-zinc-700/90 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-amber-500/30 overflow-hidden flex items-center justify-center p-0.5">
              <img
                src={DW_LOGO_URL}
                alt="DW IMPORTS"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-base font-bold text-white">Finalização do Pedido • DW IMPORTS</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-4">
          {orderPlaced ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-black text-white">Pedido Enviado com Sucesso!</h4>
              <p className="text-xs text-zinc-400 max-w-md mx-auto leading-relaxed">
                Você foi redirecionado para o nosso WhatsApp <strong>{WHATSAPP_DISPLAY}</strong> com todos os detalhes do seu manto personalizado. Caso a janela não tenha aberto, clique no botão abaixo.
              </p>
              <button
                type="button"
                onClick={handleCompleteWhatsAppOrder}
                className="mt-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow inline-flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Reabrir WhatsApp
              </button>
            </div>
          ) : (
            <>
              {/* Delivery Data Form */}
              <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-800 space-y-3">
                <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  Dados para Entrega & Contato
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Seu Nome:</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Carlos Silva"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Seu WhatsApp:</label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="Ex: (21) 99999-9999"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Endereço (Rua, Número, Bairro):</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Ex: Av. Atlântica, 1000, Apto 402 - Copacabana"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">Cidade / Estado:</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Rio de Janeiro - RJ"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-zinc-400 mb-1 block">CEP:</label>
                    <input
                      type="text"
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="Ex: 22070-000"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* PIX Instant Payment Section */}
              <div className="p-3.5 bg-gradient-to-b from-zinc-950 to-zinc-900 rounded-xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4 text-emerald-400" />
                    Pagamento Instantâneo via PIX
                  </h4>
                  <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                    Total: R$ {totalAmount.toFixed(2).replace('.', ',')}
                  </span>
                </div>

                <p className="text-[11px] text-zinc-400">
                  Copie a chave PIX abaixo ou escaneie no seu app bancário, e clique em "Confirmar Pedido no WhatsApp" para enviar o comprovante e finalizar a confecção do manto!
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="21970669281"
                    className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-amber-400 font-mono font-bold select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border border-zinc-700"
                  >
                    {copiedPix ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedPix ? 'Copiado!' : 'Copiar Chave'}
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                id="btn-confirm-whatsapp-order"
                onClick={handleCompleteWhatsAppOrder}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar e Enviar Pedido no WhatsApp ({WHATSAPP_DISPLAY})</span>
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Atendimento direto e seguro com o proprietário</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
