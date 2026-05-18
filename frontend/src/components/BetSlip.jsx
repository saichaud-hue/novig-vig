import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';
import novigLogo from '../assets/novig-logo.png';
import { formatCurrency, formatOdds } from '../lib/calculator.js';

/* SVG zigzag edge — ticket perforation bottom */
const ZigzagEdge = () => (
  <svg viewBox="0 0 400 12" preserveAspectRatio="none" className="w-full h-3 block" style={{ marginTop: -1 }}>
    <path
      d="M0,0 L10,10 L20,0 L30,10 L40,0 L50,10 L60,0 L70,10 L80,0 L90,10 L100,0 L110,10 L120,0 L130,10 L140,0 L150,10 L160,0 L170,10 L180,0 L190,10 L200,0 L210,10 L220,0 L230,10 L240,0 L250,10 L260,0 L270,10 L280,0 L290,10 L300,0 L310,10 L320,0 L330,10 L340,0 L350,10 L360,0 L370,10 L380,0 L390,10 L400,0 L400,12 L0,12 Z"
      fill="#0d1117"
    />
  </svg>
);

export default function BetSlip({ bet, rows }) {
  const slipRef = useRef(null);

  const novigRow = rows?.find((r) => r.isNovig);
  const worstRow = rows?.find((r) => !r.isNovig);
  const hasData = bet && novigRow && worstRow;

  const teamName = hasData ? (bet.side === 'home' ? bet.game.home_team : bet.game.away_team) : null;
  const payout = hasData ? novigRow.bookPayout + bet.stake : null;

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

  if (!hasData) {
    return (
      <div className="rounded-2xl border border-white/10 overflow-hidden" style={{ background: '#0d1117' }}>
        <div className="px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={novigLogo} alt="Novig" className="h-7 w-7 rounded-md" />
            <span className="text-white font-black text-base tracking-wide">NOVIG</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-3 py-0.5 text-[11px] font-bold uppercase tracking-widest text-emerald-400">
            Zero Vig
          </span>
        </div>
        <div className="mx-5 border-t border-dashed border-white/20" />
        <div className="px-5 py-10 flex items-center justify-center text-white/20 text-sm text-center">
          Your bet slip will appear here
        </div>
        <ZigzagEdge />
      </div>
    );
  }

  return (
    <div>
      {/* The slip card — captured by html2canvas */}
      <div
        ref={slipRef}
        className="rounded-2xl border border-white/10 overflow-hidden relative"
        style={{ background: '#0d1117' }}
      >
        {/* Watermark logo */}
        <img
          src={novigLogo}
          alt=""
          aria-hidden
          className="absolute inset-0 m-auto w-32 h-32 object-contain pointer-events-none select-none"
          style={{ opacity: 0.05 }}
        />

        {/* Header */}
        <div className="relative px-5 py-4 flex items-center justify-between">
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
        <div className="relative px-5 py-4 space-y-3">
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

        {/* Zigzag ticket edge */}
        <div className="relative bg-white/5">
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
        <ZigzagEdge />
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
