import { useMemo } from 'react';
import { buildComparisonRows } from '../lib/extractBookmakerOdds.js';
import { formatCurrency, formatOdds } from '../lib/calculator.js';

export default function VigComparison({ bet, selectedBookKey, onSelectBook }) {
  const rows = useMemo(() => buildComparisonRows(bet), [bet]);
  const teamName =
    bet.side === 'home' ? bet.game.home_team : bet.game.away_team;

  if (rows.length === 0) {
    return (
      <div className="card">
        <div className="text-sm text-slate-400">
          No bookmaker odds available for this game.
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="border-b border-white/10 px-6 py-5">
        <h2 className="text-lg font-semibold">Book-by-book comparison</h2>
        <p className="mt-1 text-sm text-slate-400">
          ${bet.stake} on {teamName} — sorted worst to best. Click a book to compare it above.
        </p>
        <div className="mt-4 flex items-center gap-3">
          <label className="text-sm font-medium text-slate-300 whitespace-nowrap">
            Compare against:
          </label>
          <select
            className="input py-1.5 text-sm"
            value={selectedBookKey || ''}
            onChange={(e) => onSelectBook(e.target.value)}
          >
            {rows.filter((r) => !r.isNovig).map((r) => (
              <option key={r.bookKey} value={r.bookKey}>
                {r.bookTitle}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-xs uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3 font-semibold">Sportsbook</th>
              <th className="px-6 py-3 font-semibold">Odds</th>
              <th className="px-6 py-3 font-semibold text-right">
                Your Profit
              </th>
              <th className="px-6 py-3 font-semibold text-right">Vig Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const isSelected = !r.isNovig && r.bookKey === selectedBookKey;
              return (
              <tr
                key={r.bookKey}
                onClick={r.isNovig ? undefined : () => onSelectBook(r.bookKey)}
                className={`border-b border-white/5 last:border-0 transition ${
                  r.isNovig
                    ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5'
                    : isSelected
                    ? 'bg-novig-purple/20 cursor-pointer'
                    : 'hover:bg-white/[0.03] cursor-pointer'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        r.isNovig
                          ? 'bg-emerald-400'
                          : isSelected
                          ? 'bg-novig-accent'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div
                      className={`font-semibold ${
                        r.isNovig ? 'text-emerald-300' : 'text-slate-100'
                      }`}
                    >
                      {r.bookTitle}
                    </div>
                  </div>
                  {r.isNovig && (
                    <div className="ml-4 text-[10px] font-medium uppercase tracking-wider text-emerald-400/80">
                      Zero-vig pricing
                    </div>
                  )}
                  {isSelected && (
                    <div className="ml-4 text-[10px] font-medium uppercase tracking-wider text-novig-accent">
                      Selected
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-mono text-slate-200">
                  {formatOdds(r.odds)}
                </td>
                <td className="px-6 py-4 text-right font-mono">
                  {formatCurrency(r.bookPayout)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-mono font-semibold ${
                    r.isNovig ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {r.isNovig ? '$0.00' : `-${formatCurrency(r.vigCost).replace('-', '')}`}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
