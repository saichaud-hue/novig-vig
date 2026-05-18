import { useMemo, useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { buildComparisonRows } from '../lib/extractBookmakerOdds.js';
import { formatCurrency } from '../lib/calculator.js';
import ShareBar from './ShareBar.jsx';

function useCountUp(target, duration = 800) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(target * p);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function ResultsCard({ bet, selectedBookKey }) {
  const rows = useMemo(() => buildComparisonRows(bet), [bet]);
  const worst =
    rows.find((r) => r.bookKey === selectedBookKey && !r.isNovig) ||
    rows.find((r) => !r.isNovig);
  const novigRow = rows.find((r) => r.isNovig);

  const teamName =
    bet.side === 'home' ? bet.game.home_team : bet.game.away_team;

  const animatedVig = useCountUp(worst?.vigCost ?? 0);

  if (!worst) return null;

  const vigCost = worst.vigCost;
  const novigPayout = novigRow?.bookPayout ?? 0;

  return (
    <div
      id="novig-results-card"
      className="rounded-2xl border border-white/5 bg-novig-card p-6"
    >
      {/* Unified comparison bar */}
      <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/30 uppercase tracking-wider">{worst.bookTitle}</span>
          <span className="text-xs text-white/30 uppercase tracking-wider">Novig</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-red-400 font-black text-xl">{formatCurrency(worst.bookPayout)}</span>
          <div className="flex-1 h-1 bg-white/5 rounded-full relative">
            <div
              className="absolute right-0 top-0 h-full bg-emerald-500 rounded-full"
              style={{ width: `${((novigPayout - worst.bookPayout) / novigPayout * 100).toFixed(1)}%` }}
            />
          </div>
          <span className="text-emerald-400 font-black text-xl">{formatCurrency(novigPayout)}</span>
        </div>
        <div className="text-center mt-2 text-emerald-400/70 text-xs">+{formatCurrency(vigCost)} more on Novig</div>
      </div>

      {/* Hidden fee — dominant number */}
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-red-400/70">Hidden fee on this bet</div>
      <div
        className="text-7xl font-black tracking-tight text-red-400 leading-none"
        style={{ textShadow: '0 0 40px rgba(239,68,68,0.4)' }}
      >
        {formatCurrency(animatedVig)}
      </div>
      <div className="mt-1 text-sm text-slate-400">
        paid to <span className="font-semibold text-white">{worst.bookTitle}</span> · ${bet.stake} on {teamName}
      </div>

      {/* Long-term damage */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <div className="rounded-xl bg-red-950/30 border border-red-500/15 p-3 text-center">
          <div className="text-red-400 font-black text-lg">{formatCurrency(vigCost * 100)}</div>
          <div className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">100 bets</div>
        </div>
        <div className="rounded-xl bg-red-950/30 border border-red-500/15 p-3 text-center">
          <div className="text-red-400 font-black text-lg">{formatCurrency(vigCost * 500)}</div>
          <div className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">500 bets</div>
        </div>
        <div className="rounded-xl bg-red-950/30 border border-red-500/15 p-3 text-center">
          <div className="text-red-400 font-black text-lg">{formatCurrency(vigCost * 1000)}</div>
          <div className="text-white/30 text-[10px] uppercase tracking-wider mt-0.5">1,000 bets</div>
        </div>
      </div>

      <a
        href="https://novig.co"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-500 hover:bg-blue-400 transition-colors py-4 text-base font-bold text-white"
      >
        Keep the extra {formatCurrency(vigCost)} on Novig →
      </a>
      <ShareBar bet={bet} vigCost={vigCost} bookTitle={worst.bookTitle} />
    </div>
  );
}
