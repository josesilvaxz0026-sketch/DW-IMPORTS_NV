import React from 'react';
import { Jersey } from '../types';

export interface LeagueOption {
  id: string;
  name: string;
  country: string;
  flag: string;
  accentColor: string;
  borderColor: string;
  bgGradient: string;
  popularTeams: string;
}

export const LEAGUES_DATA: LeagueOption[] = [
  {
    id: 'all',
    name: 'Todas as Camisas',
    country: 'Catálogo Geral',
    flag: '🔥',
    accentColor: 'text-amber-400',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    bgGradient: 'from-amber-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Todos os clubes e seleções',
  },
  {
    id: 'brasileirao',
    name: 'Brasileirão Série A',
    country: 'Brasil',
    flag: '🇧🇷',
    accentColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    bgGradient: 'from-emerald-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Flamengo, Palmeiras, Corinthians, Vasco...',
  },
  {
    id: 'premier_league',
    name: 'Premier League',
    country: 'Inglaterra',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    accentColor: 'text-purple-400',
    borderColor: 'border-purple-500/40 hover:border-purple-400',
    bgGradient: 'from-purple-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Man City, Arsenal, Liverpool...',
  },
  {
    id: 'la_liga',
    name: 'La Liga',
    country: 'Espanha',
    flag: '🇪🇸',
    accentColor: 'text-rose-400',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    bgGradient: 'from-rose-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Real Madrid, Barcelona...',
  },
  {
    id: 'ligue_1',
    name: 'Ligue 1',
    country: 'França',
    flag: '🇫🇷',
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-500/40 hover:border-blue-400',
    bgGradient: 'from-blue-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Paris Saint-Germain (PSG)...',
  },
  {
    id: 'bundesliga',
    name: 'Bundesliga',
    country: 'Alemanha',
    flag: '🇩🇪',
    accentColor: 'text-amber-500',
    borderColor: 'border-amber-600/40 hover:border-amber-500',
    bgGradient: 'from-amber-600/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Bayern de Munique...',
  },
  {
    id: 'serie_a',
    name: 'Serie A',
    country: 'Itália',
    flag: '🇮🇹',
    accentColor: 'text-teal-400',
    borderColor: 'border-teal-500/40 hover:border-teal-400',
    bgGradient: 'from-teal-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Inter de Milão, Milan, Juventus...',
  },
  {
    id: 'selecoes',
    name: 'Seleções Mundiais',
    country: 'Internacional',
    flag: '🌍',
    accentColor: 'text-sky-400',
    borderColor: 'border-sky-500/40 hover:border-sky-400',
    bgGradient: 'from-sky-500/10 via-zinc-900 to-zinc-950',
    popularTeams: 'Brasil, Argentina, França, Portugal...',
  },
  {
    id: 'retro',
    name: 'Camisas Retrô',
    country: 'Mantos Históricos',
    flag: '⭐',
    accentColor: 'text-amber-300',
    borderColor: 'border-amber-400/50 hover:border-amber-300',
    bgGradient: 'from-amber-500/15 via-zinc-900 to-zinc-950',
    popularTeams: 'Pelé 70, Zico 81, Romário 94, Ronaldo 2002...',
  },
];

export function countJerseysByLeague(leagueId: string, jerseys: Jersey[]): number {
  if (leagueId === 'all') return jerseys.length;
  
  return jerseys.filter(j => {
    const l = j.league.toLowerCase();
    const t = j.team.toLowerCase();
    const cat = j.category;
    const type = j.type;

    if (leagueId === 'la_liga') {
      return l.includes('la liga') || l.includes('espanha') || t.includes('real madrid') || t.includes('barcelona');
    }
    if (leagueId === 'premier_league') {
      return l.includes('premier') || l.includes('inglaterra') || t.includes('manchester') || t.includes('arsenal') || t.includes('liverpool');
    }
    if (leagueId === 'ligue_1') {
      return l.includes('ligue 1') || l.includes('frança') || t.includes('psg');
    }
    if (leagueId === 'bundesliga') {
      return l.includes('bundesliga') || l.includes('alemanha') || t.includes('bayern');
    }
    if (leagueId === 'serie_a') {
      return l.includes('serie a') || l.includes('itália') || t.includes('milan') || t.includes('inter');
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
    return false;
  }).length;
}

interface LeagueCardsProps {
  selectedLeague: string;
  onSelectLeague: (leagueId: string) => void;
  jerseys: Jersey[];
}

export const LeagueCards: React.FC<LeagueCardsProps> = ({
  selectedLeague,
  onSelectLeague,
  jerseys,
}) => {
  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8 bg-zinc-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2 tracking-tight">
              <span>Navegue por Ligas e Competições</span>
            </h2>
            <p className="text-xs text-zinc-400">
              Selecione o campeonato ou categoria para ver os mantos oficiais com personalização
            </p>
          </div>
          <span className="text-[11px] text-zinc-500 font-semibold hidden sm:inline">
            Clique na bandeira para filtrar
          </span>
        </div>

        {/* League Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
          {LEAGUES_DATA.map((league) => {
            const count = countJerseysByLeague(league.id, jerseys);
            const isSelected = selectedLeague === league.id;

            return (
              <button
                key={league.id}
                type="button"
                id={`card-league-${league.id}`}
                onClick={() => onSelectLeague(league.id)}
                className={`group relative p-3 sm:p-4 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between border overflow-hidden ${
                  isSelected
                    ? 'bg-zinc-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/30'
                    : 'bg-zinc-900/70 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                }`}
              >
                {/* Background glow on active */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none -mr-8 -mt-8" />
                )}

                {/* Top Row: Flag Emoji & Country */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-xl sm:text-2xl shadow-inner group-hover:scale-110 transition-transform">
                    {league.flag}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 bg-zinc-950/80 px-2 py-0.5 rounded-full border border-zinc-800">
                    {league.country}
                  </span>
                </div>

                {/* Middle: League Name */}
                <div className="mt-1">
                  <h3 className={`text-xs sm:text-sm font-black tracking-tight leading-tight ${
                    isSelected ? 'text-amber-400' : 'text-white group-hover:text-zinc-100'
                  }`}>
                    {league.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5 font-normal">
                    {league.popularTeams}
                  </p>
                </div>

                {/* Bottom Row: Count & Status */}
                <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-[10px]">
                  <span className="text-zinc-400 font-semibold">
                    {count} {count === 1 ? 'manto' : 'mantos'}
                  </span>
                  {isSelected ? (
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Ativo
                    </span>
                  ) : (
                    <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors">
                      Ver time →
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
