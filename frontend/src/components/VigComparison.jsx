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
    <div className="rounded-2xl border border-white/5 bg-novig-card overflow-hidden">
      <div className="border-b border-white/5 px-6 py-5">
        <div className="section-label mb-1">Book-by-book comparison</div>
        <h2 className="text-lg font-black text-white">Sportsbook breakdown</h2>
        <p className="mt-1 text-xs text-white/40">
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
            <tr className="border-b border-white/5 text-left text-xs uppercase tracking-widest text-white/25">
              <th className="px-6 py-3 font-semibold">Sportsbook</th>
              <th className="px-6 py-3 font-semibold">Odds</th>
              <th className="px-6 py-3 font-semibold text-right">
                Your Profit
              </th>
              <th className="px-6 py-3 font-semibold text-right">Vig Cost</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const isSelected = !r.isNovig && r.bookKey === selectedBookKey;
              const isLastNovig = r.isNovig && rows[i + 1] && !rows[i + 1].isNovig;
              return (
              <tr
                key={r.bookKey}
                onClick={r.isNovig ? undefined : () => onSelectBook(r.bookKey)}
                className={`transition ${
                  isLastNovig ? 'border-b-2 border-blue-500/40' : 'border-b border-white/5'
                } last:border-0 ${
                  r.isNovig
                    ? 'bg-blue-600/20'
                    : isSelected
                    ? 'border-l-4 border-l-novig-purple bg-novig-purple/20 cursor-pointer'
                    : 'hover:bg-white/[0.03] cursor-pointer'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full flex-shrink-0 ${
                        r.isNovig
                          ? 'bg-blue-400'
                          : isSelected
                          ? 'bg-novig-accent'
                          : 'bg-slate-600'
                      }`}
                    />
                    <div
                      className={`font-bold ${
                        r.isNovig ? 'text-blue-200 text-base' : 'text-slate-100'
                      }`}
                    >
                      {r.bookTitle}
                    </div>
                    {r.isNovig && (
                      <span className="ml-1 rounded-full bg-blue-500/30 border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-300">
                        ✓ Zero Vig
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <div className="ml-4 text-[10px] font-medium uppercase tracking-wider text-novig-accent">
                      Selected
                    </div>
                  )}
                </td>
                <td className={`px-6 py-4 font-mono ${r.isNovig ? 'text-blue-200' : 'text-slate-200'}`}>
                  {formatOdds(r.odds)}
                </td>
                <td className={`px-6 py-4 text-right font-mono ${r.isNovig ? 'text-emerald-400 font-bold' : ''}`}>
                  {formatCurrency(r.bookPayout)}
                </td>
                <td
                  className={`px-6 py-4 text-right font-mono font-semibold ${
                    r.isNovig ? 'text-emerald-400' : 'text-red-400'
                  }`}
                >
                  {r.isNovig
                    ? <span className="text-emerald-400 font-black text-base">$0.00</span>
                    : `-${formatCurrency(r.vigCost).replace('-', '')}`}
                </td>
              </tr>
            );})}
          </tbody>
        </table>
      </div>
    </div>
  );
}
