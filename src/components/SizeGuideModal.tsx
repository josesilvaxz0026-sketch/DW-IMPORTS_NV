import React, { useEffect } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'P', chest: '50 - 52 cm', length: '69 - 71 cm', height: '1,60 - 1,70 m', weight: '50 - 65 kg' },
  { size: 'M', chest: '53 - 55 cm', length: '71 - 73 cm', height: '1,70 - 1,78 m', weight: '65 - 75 kg' },
  { size: 'G', chest: '56 - 58 cm', length: '73 - 75 cm', height: '1,78 - 1,85 m', weight: '75 - 85 kg' },
  { size: 'GG', chest: '59 - 61 cm', length: '75 - 78 cm', height: '1,85 - 1,92 m', weight: '85 - 98 kg' },
  { size: 'XGG', chest: '62 - 65 cm', length: '78 - 81 cm', height: '1,90 - 2,00 m', weight: '98 - 115 kg' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-hidden">
      <div 
        id="modal-size-guide"
        className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700/90 rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
      >
        <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Tabela de Medidas Oficial</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5 overflow-y-auto touch-scroll overscroll-contain flex-1 min-h-0">
          <p className="text-xs text-zinc-400 mb-4">
            Meça uma camisa sua que vista confortável esticada sobre uma mesa para comparar a largura (peito) e o comprimento (altura).
          </p>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-zinc-300 border-b border-zinc-800 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Tamanho</th>
                  <th className="py-2.5 px-3">Largura</th>
                  <th className="py-2.5 px-3">Altura</th>
                  <th className="py-2.5 px-3">Sugerido (Peso/Altura)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {SIZE_CHART.map((row) => (
                  <tr key={row.size} className="hover:bg-zinc-800/40">
                    <td className="py-2.5 px-3 font-black text-amber-400">{row.size}</td>
                    <td className="py-2.5 px-3 font-mono">{row.chest}</td>
                    <td className="py-2.5 px-3 font-mono">{row.length}</td>
                    <td className="py-2.5 px-3 text-zinc-400">{row.height} • {row.weight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 p-3 bg-zinc-950/80 rounded-xl border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Dica de Especialista:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Caso prefira um caimento mais solto (oversized / casual) ou tenha ombros largos, recomendamos pedir 1 tamanho maior que o seu habitual.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
          >
            Entendido, fechar tabela
          </button>
        </div>
      </div>
    </div>
  );
};
