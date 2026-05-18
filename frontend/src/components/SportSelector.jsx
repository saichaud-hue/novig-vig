import { FaBasketballBall, FaFootballBall, FaHockeyPuck, FaBaseballBall } from 'react-icons/fa';

const SPORTS = [
  { id: 'basketball_nba', label: 'NBA', Icon: FaBasketballBall },
  { id: 'americanfootball_nfl', label: 'NFL', Icon: FaFootballBall },
  { id: 'icehockey_nhl', label: 'NHL', Icon: FaHockeyPuck },
  { id: 'baseball_mlb', label: 'MLB', Icon: FaBaseballBall },
];

export default function SportSelector({ sport, onChange, loading }) {
  return (
    <div className="card">
      <label className="label">Sport</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SPORTS.map(({ id, label, Icon }) => {
          const active = sport === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              disabled={loading && active}
              className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                active
                  ? 'border-blue-500/50 bg-blue-500/10 text-blue-400'
                  : 'border-white/5 bg-white/[0.03] text-white/50 hover:bg-white/[0.06] hover:text-white/80'
              }`}
            >
              <Icon className="text-base" />
              {label}
            </button>
          );
        })}
      </div>
      {loading && (
        <div className="mt-3 flex items-center gap-2 text-xs text-white/30">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-novig-accent border-t-transparent" />
          Loading games…
        </div>
      )}
    </div>
  );
}
