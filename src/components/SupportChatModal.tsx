import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { WHATSAPP_NUMBER, WHATSAPP_DISPLAY } from '../data/initialJerseys';
import { DW_LOGO_URL } from '../assets/logo';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  PhoneCall, 
  Ruler, 
  ShieldCheck, 
  Truck,
  DollarSign
} from 'lucide-react';

interface SupportChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSizeGuide: () => void;
}

const INITIAL_BOT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bot',
    text: `Olá! Bem-vindo ao Suporte da DW IMPORTS! ⚡⚽\nComo posso te ajudar hoje com suas camisas de time personalizadas?`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  },
];

const FAQ_SUGGESTIONS = [
  { label: '💰 Quanto custam as camisas e personalização?', query: 'precos' },
  { label: '📏 Como escolher meu tamanho? (Medidas)', query: 'tamanhos' },
  { label: '🚚 Prazo de entrega e frete', query: 'entrega' },
  { label: '🛡️ Qual a qualidade do tecido?', query: 'qualidade' },
  { label: '🟢 Falar com atendente no WhatsApp', query: 'whatsapp' },
];

export const SupportChatModal: React.FC<SupportChatModalProps> = ({
  isOpen,
  onClose,
  onOpenSizeGuide,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_BOT_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, isTyping]);

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Bot Response Logic
    setTimeout(() => {
      let botReply = '';
      const lower = text.toLowerCase();

      if (lower.includes('preço') || lower.includes('preco') || lower.includes('quanto custa') || lower.includes('valor') || text === 'precos') {
        botReply = `👕 *Tabela de Preços Oficiais:*\n• Camisas de Clubes e Seleções: *R$ 150,00*\n• Camisas Retrô Históricas: *R$ 170,00*\n\n✨ *Opcionais de Personalização:*\n• Nome e Número Oficial nas costas: *+ R$ 20,00*\n• Patrocínio Oficial: *+ R$ 20,00*\n• Patch de Competição (Champions, Libertadores, etc): *+ R$ 20,00* cada.`;
      } else if (lower.includes('tamanho') || lower.includes('medida') || lower.includes('guia') || text === 'tamanhos') {
        botReply = `📏 *Tamanhos Disponíveis:* P, M, G, GG e XGG.\n\n• *P*: 1,60 a 1,70m (50-65kg)\n• *M*: 1,70 a 1,78m (65-75kg)\n• *G*: 1,78 a 1,85m (75-85kg)\n• *GG*: 1,85 a 1,92m (85-98kg)\n• *XGG*: 1,90 a 2,00m (98-115kg)\n\nVocê também pode abrir a nossa Tabela de Medidas interativa clicando no botão abaixo!`;
      } else if (lower.includes('entrega') || lower.includes('frete') || lower.includes('prazo') || text === 'entrega') {
        botReply = `🚚 *Envio & Frete:*\nEnviamos para todo o Brasil via Correios (PAC/Sedex) com código de rastreamento enviado diretamente no seu WhatsApp!\n• Prazo médio: 7 a 15 dias úteis.\n• Frete Grátis nas compras a partir de 2 camisas!`;
      } else if (lower.includes('qualidade') || lower.includes('tecido') || lower.includes('original') || text === 'qualidade') {
        botReply = `🛡️ *Qualidade Garantida:*\nTrabalhamos com padrão Tailandesa 1:1, tecido DryFit 100% poliéster respirável, escudos e logos bordados com perfeição, além de todas as etiquetas e tags oficiais.`;
      } else if (lower.includes('whatsapp') || lower.includes('atendente') || lower.includes('humano') || lower.includes('zap') || text === 'whatsapp') {
        botReply = `🟢 *Atendimento Direto no WhatsApp:*\nNossa equipe está disponível no número *${WHATSAPP_DISPLAY}*!\n\nClique no botão verde abaixo para iniciar a conversa direta no WhatsApp com um atendente.`;
      } else {
        botReply = `Obrigado pela mensagem! Para tirar dúvidas detalhadas ou fechar seu pedido personalizado de camisa agora mesmo, fale diretamente com nossa equipe no WhatsApp pelo número *${WHATSAPP_DISPLAY}*!`;
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent('Olá! Gostaria de tirar uma dúvida sobre as camisas de time da loja.');
    window.open(`https://wa.me/55${WHATSAPP_NUMBER}?text=${text}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="modal-support-chat"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[580px] max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-amber-500/40 overflow-hidden flex items-center justify-center p-0.5 shadow">
                <img
                  src={DW_LOGO_URL}
                  alt="DW IMPORTS"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-zinc-950 rounded-full"></span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                Suporte DW IMPORTS
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-medium">Online</span>
              </h3>
              <p className="text-[11px] text-zinc-400">
                WhatsApp Oficial: {WHATSAPP_DISPLAY}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="btn-whatsapp-chat-header"
              onClick={handleOpenWhatsApp}
              className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-colors flex items-center gap-1 text-xs font-bold shadow"
              title="Conversar no WhatsApp"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            <button
              type="button"
              id="btn-close-chat"
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick FAQ Pills */}
        <div className="p-2.5 bg-zinc-950/80 border-b border-zinc-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {FAQ_SUGGESTIONS.map((faq, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSend(faq.query)}
              className="whitespace-nowrap px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-full text-[11px] font-medium border border-zinc-700 transition-colors flex-shrink-0"
            >
              {faq.label}
            </button>
          ))}
        </div>

        {/* Chat Messages List */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-gradient-to-b from-zinc-900 to-zinc-950">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs overflow-hidden ${
                msg.sender === 'user' 
                  ? 'bg-amber-500 text-zinc-950 font-bold' 
                  : 'bg-zinc-900 border border-amber-500/40 p-0.5'
              }`}>
                {msg.sender === 'user' ? (
                  <User className="w-3.5 h-3.5" />
                ) : (
                  <img
                    src={DW_LOGO_URL}
                    alt="DW"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                )}
              </div>

              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs shadow-md ${
                msg.sender === 'user'
                  ? 'bg-amber-500 text-zinc-950 font-semibold rounded-tr-none'
                  : 'bg-zinc-800/90 text-zinc-200 border border-zinc-700 rounded-tl-none leading-relaxed whitespace-pre-line'
              }`}>
                {msg.text}
                <span className={`block text-[9px] mt-1 text-right ${
                  msg.sender === 'user' ? 'text-zinc-800/80' : 'text-zinc-500'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-zinc-400 text-xs italic pl-9">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]"></span>
              <span>Digitando resposta...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* WhatsApp Direct Action Bar */}
        <div className="px-4 py-2 bg-emerald-950/60 border-t border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Atendimento humano no WhatsApp</span>
          </div>
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1"
          >
            {WHATSAPP_DISPLAY}
          </button>
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="p-3 bg-zinc-950 border-t border-zinc-800 flex items-center gap-2"
        >
          <input
            type="text"
            id="input-support-chat"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            id="btn-send-chat-message"
            disabled={!inputText.trim()}
            className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-zinc-950 rounded-xl font-bold transition-all shadow"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
