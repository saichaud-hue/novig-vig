import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';
import novigLogo from '../assets/novig-logo.png';
import { formatCurrency, formatOdds } from '../lib/calculator.js';

export default function BetSlip({ bet, rows }) {
  const slipRef = useRef(null);

  if (!bet || !rows || rows.length === 0) return null;

  const novigRow = rows.find((r) => r.isNovig);
  const worstRow = rows.find((r) => !r.isNovig);
  if (!novigRow || !worstRow) return null;

  const teamName = bet.side === 'home' ? bet.game.home_team : bet.game.away_team;
  const payout = novigRow.bookPayout + bet.stake;

  const download = async () => {
    if (!slipRef.current) return;
    const canvas = await html2canvas(slipRef.current, {
      backgroundColor: '#0d1117',
      scale: 2,
    });
    const link = document.createElement('a');
    link.download = 'novig-bet-slip.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div>
      {/* The slip card — captured by html2canvas */}
      <div
        ref={slipRef}
        className="rounded-2xl border border-white/10 overflow-hidden"
        style={{ background: '#0d1117' }}
      >
        {/* Header */}
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={novigLogo} alt="Novig" className="h-7 w-7 rounded-md" />
            <span className="text-white font-black text-base tracking-wide">NOVIG</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Zero Vig
          </span>
        </div>

        {/* Dashed divider — ticket perforation */}
        <div className="mx-5 border-t border-dashed border-white/20" />

        {/* Bet details */}
        <div className="px-5 py-4 space-y-3">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">Matchup</div>
            <div className="text-white/70 text-sm">
              {bet.game.away_team} <span className="text-white/30">@</span> {bet.game.home_team}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">Pick</div>
              <div className="text-white font-bold text-sm">{teamName}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">Odds</div>
              <div className="text-blue-300 font-bold text-sm">{formatOdds(novigRow.odds)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">Stake</div>
              <div className="text-white font-bold text-sm">{formatCurrency(bet.stake)}</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-widest text-white/30 mb-0.5">To Win</div>
              <div className="text-emerald-400 font-black text-lg">{formatCurrency(payout)}</div>
            </div>
          </div>
        </div>

        {/* Dashed divider */}
        <div className="mx-5 border-t border-dashed border-white/20" />

        {/* Comparison footer */}
        <div className="px-5 py-3">
          <div className="text-[11px] text-white/30">
            vs{' '}
            <span className="text-white/50 font-semibold">{worstRow.bookTitle}</span>
            {': '}
            <span className="text-red-400 font-semibold">
              would only pay {formatCurrency(worstRow.bookPayout + bet.stake)}
            </span>
            {' — '}
            <span className="text-red-400 font-semibold">{formatCurrency(novigRow.bookPayout - worstRow.bookPayout)} less</span>
          </div>
        </div>
      </div>

      {/* Download button — outside the captured area */}
      <button
        onClick={download}
        className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-sm text-white/70 hover:text-white transition"
      >
        <FaDownload />
        Download Slip
      </button>
    </div>
  );
}
