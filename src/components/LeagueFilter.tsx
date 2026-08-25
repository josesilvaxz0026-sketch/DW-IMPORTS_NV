import React from 'react';
import { Filter, ArrowUpDown, X } from 'lucide-react';
import { LEAGUES_DATA } from './LeagueCards';

interface LeagueFilterProps {
  selectedLeague: string;
  onSelectLeague: (leagueId: string) => void;
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  availableTeams: string[];
  totalResults: number;
}

export const LeagueFilter: React.FC<LeagueFilterProps> = ({
  selectedLeague,
  onSelectLeague,
  selectedTeam,
  onSelectTeam,
  sortBy,
  onSortByChange,
  availableTeams,
  totalResults,
}) => {
  const currentLeagueObj = LEAGUES_DATA.find(l => l.id === selectedLeague) || LEAGUES_DATA[0];

  return (
    <div className="w-full bg-zinc-950 border-y border-zinc-800/80 py-3.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Filter Bar: Active League Tag, Results Count & Sorting */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700/80 px-2.5 py-1 rounded-xl font-bold text-white">
              <span>{currentLeagueObj.flag}</span>
              <span>{currentLeagueObj.name}</span>
              {selectedLeague !== 'all' && (
                <button
                  type="button"
                  onClick={() => onSelectLeague('all')}
                  className="text-zinc-400 hover:text-white ml-1 text-xs"
                  title="Ver todas as ligas"
                >
                  ✕
                </button>
              )}
            </div>

            {selectedTeam && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/50 text-amber-300 px-2.5 py-1 rounded-xl font-bold">
                <span>Time: {selectedTeam}</span>
                <button
                  type="button"
                  onClick={() => onSelectTeam('')}
                  className="hover:text-white ml-0.5"
                  title="Remover filtro de time"
                >
                  ✕
                </button>
              </div>
            )}

            <span className="text-zinc-400 text-[11px] ml-1">
              ({totalResults} {totalResults === 1 ? 'manto disponível' : 'mantos disponíveis'})
            </span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400" /> Ordenar:
            </span>
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="featured">Destaques & Mais Vendidas</option>
              <option value="price-asc">Preço: Menor para Maior</option>
              <option value="price-desc">Preço: Maior para Menor</option>
              <option value="name-asc">Nome do Time (A-Z)</option>
              <option value="season-desc">Temporada / Ano Mais Recente</option>
            </select>
          </div>
        </div>

        {/* Team Chips for Quick Navigation in this League */}
        {availableTeams.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1 flex-shrink-0">
              Filtrar por Clube:
            </span>
            <button
              type="button"
              onClick={() => onSelectTeam('')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                selectedTeam === ''
                  ? 'bg-zinc-800 text-white border border-zinc-600'
                  : 'text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-800'
              }`}
            >
              Todos os Clubes
            </button>
            {availableTeams.map((teamName) => (
              <button
                key={teamName}
                type="button"
                onClick={() => onSelectTeam(teamName === selectedTeam ? '' : teamName)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
                  selectedTeam === teamName
                    ? 'bg-amber-500 text-zinc-950 font-bold shadow'
                    : 'text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {teamName}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
