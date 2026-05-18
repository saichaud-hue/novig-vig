import { useMemo } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { buildComparisonRows } from '../lib/extractBookmakerOdds.js';
import { formatCurrency } from '../lib/calculator.js';
import ShareBar from './ShareBar.jsx';

export default function ResultsCard({ bet, selectedBookKey }) {
  const rows = useMemo(() => buildComparisonRows(bet), [bet]);
  const worst =
    rows.find((r) => r.bookKey === selectedBookKey && !r.isNovig) ||
    rows.find((r) => !r.isNovig);
  const novigRow = rows.find((r) => r.isNovig);

  const teamName =
    bet.side === 'home' ? bet.game.home_team : bet.game.away_team;

  if (!worst) {
    return null;
  }

  return (
    <div
      id="novig-results-card"
      className="rounded-2xl border border-white/5 bg-novig-card p-6"
    >
      {/* Side-by-side profit comparison */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="rounded-xl bg-red-950/40 border border-red-500/20 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-red-400/70 mb-1">{worst.bookTitle}</div>
          <div className="text-2xl font-black text-red-400">
            {formatCurrency(worst.bookPayout)}
          </div>
          <div className="text-xs text-red-400/40 mt-0.5">your profit</div>
        </div>
        <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-4">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-emerald-400/70 mb-1">Novig</div>
          <div className="text-2xl font-black text-emerald-400">
            +{novigRow ? formatCurrency(novigRow.bookPayout) : '—'}
          </div>
          <div className="text-xs text-emerald-400/40 mt-0.5">your profit</div>
        </div>
      </div>

      <div className="mb-1 section-label">You're losing</div>
      <div className="bg-gradient-to-r from-white via-white to-novig-accent bg-clip-text text-5xl font-black tracking-tight text-transparent">
        {formatCurrency(worst.vigCost)}
      </div>
      <div className="mt-1 text-sm text-slate-300">
        to vig on{' '}
        <span className="font-semibold text-white">{worst.bookTitle}</span> ·{' '}
        ${bet.stake} on {teamName}
      </div>

      <a
        href="https://novig.co"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition-colors py-4 text-base font-bold text-white"
      >
        Place This Bet on Novig
        <FaArrowRight />
      </a>
      <ShareBar bet={bet} vigCost={worst.vigCost} bookTitle={worst.bookTitle} />
    </div>
  );
}
