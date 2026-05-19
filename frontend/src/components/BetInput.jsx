export default function BetInput({
  game,
  side,
  stake,
  onSideChange,
  onStakeChange,
}) {
  const clamp = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 1;
    return Math.min(10_000, Math.max(1, n));
  };

  return (
    <div className="card">
      <label className="label">Your trade</label>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSideChange('away')}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            side === 'away'
              ? 'border-[#179BE7]/50 bg-[#179BE7]/10 text-white'
              : 'border-white/5 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white/80'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Away
          </div>
          <div className="font-semibold">{game.away_team}</div>
        </button>
        <button
          type="button"
          onClick={() => onSideChange('home')}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            side === 'home'
              ? 'border-[#179BE7]/50 bg-[#179BE7]/10 text-white'
              : 'border-white/5 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white/80'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Home
          </div>
          <div className="font-semibold">{game.home_team}</div>
        </button>
      </div>

      <div className="mt-4">
        <label className="label">Stake</label>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Stake</span>
            <div className="flex items-center gap-1">
              <span className="text-white/50">$</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={stake}
                onChange={(e) => onStakeChange(e.target.value)}
                onBlur={(e) => onStakeChange(clamp(e.target.value))}
                className="w-20 bg-transparent text-right text-white font-black text-xl outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            step={5}
            value={Math.min(stake, 1000)}
            onChange={(e) => onStakeChange(Number(e.target.value))}
            className="w-full accent-[#179BE7] h-1.5 rounded-full"
          />
          <div className="flex justify-between mt-1 text-[10px] text-white/25">
            <span>$1</span><span>$250</span><span>$500</span><span>$1,000+</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100, 500].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onStakeChange(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  Number(stake) === v
                    ? 'border-[#179BE7] bg-[#179BE7]/20 text-[#179BE7]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
