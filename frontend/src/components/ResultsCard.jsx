import { useMemo } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { buildComparisonRows } from '../lib/extractBookmakerOdds.js';
import { formatCurrency } from '../lib/calculator.js';

export default function ResultsCard({ bet, selectedBookKey }) {
  const rows = useMemo(() => buildComparisonRows(bet), [bet]);
  const worst =
    rows.find((r) => r.bookKey === selectedBookKey && !r.isNovig) ||
    rows.find((r) => !r.isNovig);

  const teamName =
    bet.side === 'home' ? bet.game.home_team : bet.game.away_team;

  if (!worst) {
    return null;
  }

  const lostOverHundred = worst.vigCost * 100;

  return (
    <div
      id="novig-results-card"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#1e1b4b] via-[#1e1b4b] to-[#1e3a8a] p-8 shadow-soft"
    >
      <div className="absolute inset-0 bg-novig-radial opacity-60" />
      <div className="relative">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-novig-accent">
          You're losing
        </div>
        <div className="bg-gradient-to-r from-white via-white to-novig-accent bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl">
          {formatCurrency(worst.vigCost)}
        </div>
        <div className="mt-2 text-base text-slate-300">
          to vig on{' '}
          <span className="font-semibold text-white">{worst.bookTitle}</span> ·{' '}
          {bet.stake.toLocaleString
            ? `$${bet.stake}`
            : `$${Number(bet.stake).toFixed(2)}`}{' '}
          on {teamName}
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Over 100 bets like this
            </div>
            <div className="mt-1 text-2xl font-bold text-red-300">
              {formatCurrency(lostOverHundred)} lost
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              On Novig
            </div>
            <div className="mt-1 text-2xl font-bold text-[#22d3ee]">
              Keep every cent
            </div>
          </div>
        </div>

        <a
          href="https://novig.co"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-7 w-full animate-pulse sm:w-auto"
        >
          Place This Bet on Novig
          <FaArrowRight />
        </a>
      </div>
    </div>
  );
}
