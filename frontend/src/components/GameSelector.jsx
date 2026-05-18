function formatGameLabel(game) {
  const when = new Date(game.commence_time);
  const dateStr = when.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${game.away_team} @ ${game.home_team} — ${dateStr}`;
}

export default function GameSelector({
  games,
  loading,
  error,
  selectedGameId,
  onSelect,
}) {
  return (
    <div className="card">
      <label className="label" htmlFor="game-select">
        Game
      </label>

      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </div>
      ) : loading ? (
        <div className="text-sm text-slate-400">Loading games…</div>
      ) : games.length === 0 ? (
        <div className="text-sm text-slate-400">
          No upcoming games found for this sport.
        </div>
      ) : (
        <select
          id="game-select"
          className="input"
          value={selectedGameId}
          onChange={(e) => onSelect(e.target.value)}
        >
          <option value="">Select a game…</option>
          {games.map((g) => (
            <option key={g.id} value={g.id}>
              {formatGameLabel(g)}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
