import { useMemo } from 'react';
import { buildComparisonRows } from '../lib/extractBookmakerOdds.js';
import { formatCurrency, formatOdds } from '../lib/calculator.js';

export default function VigComparison({ bet }) {
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
          ${bet.stake} on {teamName} — sorted worst to best.
        </p>
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
            {rows.map((r) => (
              <tr
                key={r.bookKey}
                className={`border-b border-white/5 last:border-0 transition ${
                  r.isNovig
                    ? 'bg-gradient-to-r from-emerald-500/15 to-emerald-500/5'
                    : 'hover:bg-white/[0.03]'
                }`}
              >
                <td className="px-6 py-4">
                  <div
                    className={`font-semibold ${
                      r.isNovig ? 'text-emerald-300' : 'text-slate-100'
                    }`}
                  >
                    {r.bookTitle}
                  </div>
                  {r.isNovig && (
                    <div className="text-[10px] font-medium uppercase tracking-wider text-emerald-400/80">
                      Zero-vig pricing
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
