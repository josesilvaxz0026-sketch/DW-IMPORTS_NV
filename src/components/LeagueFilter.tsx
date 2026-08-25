import React from 'react';
import { JerseyCategory } from '../types';
import { Filter, Flame, Award, Clock, ArrowUpDown } from 'lucide-react';

interface LeagueFilterProps {
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedTeam: string;
  onSelectTeam: (team: string) => void;
  sortBy: string;
  onSortByChange: (sort: string) => void;
  availableTeams: string[];
  totalResults: number;
}

export const LeagueFilter: React.FC<LeagueFilterProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedTeam,
  onSelectTeam,
  sortBy,
  onSortByChange,
  availableTeams,
  totalResults,
}) => {
  return (
    <div className="w-full bg-zinc-950/60 border-y border-zinc-850 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-3">
        {/* Top Filter Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Filter className="w-4 h-4 text-amber-400" />
            <span>Exibindo <strong>{totalResults}</strong> mantos disponíveis</span>
            {selectedTeam && (
              <button
                type="button"
                onClick={() => onSelectTeam('')}
                className="ml-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[11px] font-semibold flex items-center gap-1"
              >
                Time: {selectedTeam} ✕
              </button>
            )}
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

        {/* Team Chips for Quick Navigation */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mr-1 flex-shrink-0">
            Times Populares:
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
            Todos os Times
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
      </div>
    </div>
  );
};
