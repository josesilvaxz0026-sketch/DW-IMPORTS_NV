import React, { ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in DW IMPORTS App:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('manto_store_jerseys_catalog_v1');
      localStorage.removeItem('manto_store_cart_v1');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto text-amber-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-xl font-black tracking-tight text-zinc-100">
                DW IMPORTS • Restaurar Loja
              </h1>
              <p className="text-sm text-zinc-400">
                Ocorreu uma pequena instabilidade no navegador. Clique no botão abaixo para restaurar o catálogo e continuar navegando.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-left overflow-x-auto text-[11px] text-zinc-500 font-mono">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                Recarregar Catálogo
              </button>
              
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all"
              >
                <Home className="w-4 h-4" />
                Atualizar
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
