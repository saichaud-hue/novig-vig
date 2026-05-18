import { FaCalculator } from 'react-icons/fa';

export default function BetInput({
  game,
  side,
  stake,
  onSideChange,
  onStakeChange,
  onCalculate,
}) {
  const clamp = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 1;
    return Math.min(10_000, Math.max(1, n));
  };

  return (
    <div className="card">
      <label className="label">Your bet</label>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSideChange('away')}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            side === 'away'
              ? 'border-transparent bg-novig-gradient text-white shadow-soft'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
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
              ? 'border-transparent bg-novig-gradient text-white shadow-soft'
              : 'border-white/10 bg-white/[0.04] hover:bg-white/[0.08]'
          }`}
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider opacity-70">
            Home
          </div>
          <div className="font-semibold">{game.home_team}</div>
        </button>
      </div>

      <div className="mt-4">
        <label className="label" htmlFor="stake">
          Stake
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            $
          </span>
          <input
            id="stake"
            type="number"
            min={1}
            max={10_000}
            step={1}
            value={stake}
            onChange={(e) => onStakeChange(e.target.value)}
            onBlur={(e) => onStakeChange(clamp(e.target.value))}
            className="input pl-8"
          />
        </div>
        <div className="mt-1 text-xs text-slate-500">Min $1 · Max $10,000</div>
      </div>

      <button
        type="button"
        onClick={onCalculate}
        className="btn-primary mt-5 w-full"
      >
        <FaCalculator />
        Calculate Savings
      </button>
    </div>
  );
}
