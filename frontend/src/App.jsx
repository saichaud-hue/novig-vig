import { useEffect, useMemo, useState } from 'react';
import novigLogo from './assets/novig-logo.png'
import axios from 'axios';
import SportSelector from './components/SportSelector.jsx';
import GameSelector from './components/GameSelector.jsx';
import BetInput from './components/BetInput.jsx';
import VigComparison from './components/VigComparison.jsx';
import ResultsCard from './components/ResultsCard.jsx';
import BetSlip from './components/BetSlip.jsx';
import { buildComparisonRows } from './lib/extractBookmakerOdds.js';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export default function App() {
  const [sport, setSport] = useState('basketball_nba');
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState(null);

  const [selectedGameId, setSelectedGameId] = useState('');
  const [side, setSide] = useState('home');
  const [stake, setStake] = useState(30);
  const [committedBet, setCommittedBet] = useState(null);
  const [selectedBookKey, setSelectedBookKey] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingGames(true);
    setGamesError(null);
    setSelectedGameId('');
    setCommittedBet(null);

    axios
      .get(`${API_BASE}/api/odds/${sport}`, { timeout: 35_000 })
      .then((res) => {
        if (cancelled) return;
        const list = Array.isArray(res.data?.games) ? res.data.games : [];
        const sorted = [...list].sort(
          (a, b) => new Date(a.commence_time) - new Date(b.commence_time)
        );
        setGames(sorted);
        const fanduelExists = sorted[0]?.bookmakers?.find((b) => b.key === 'fanduel');
        setSelectedBookKey(fanduelExists ? 'fanduel' : null);
      })
      .catch((err) => {
        if (cancelled) return;
        const msg =
          err.response?.data?.error ||
          err.message ||
          'Failed to load games';
        setGamesError(msg);
        setGames([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingGames(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sport]);

  const selectedGame = games.find((g) => g.id === selectedGameId) || null;
  const committedRows = useMemo(
    () => (committedBet ? buildComparisonRows(committedBet) : []),
    [committedBet]
  );

  useEffect(() => {
    if (!selectedGame || !stake || stake < 1) return;
    const bet = { game: selectedGame, side, stake: Number(stake) };
    setCommittedBet(bet);
    const rows = buildComparisonRows(bet);
    const worstBook = rows.find((r) => !r.isNovig);
    setSelectedBookKey((prev) => prev || worstBook?.bookKey || null);
  }, [selectedGame, side, stake, selectedBookKey]);

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={novigLogo} alt="Novig" className="h-9 w-9 rounded-lg" />
          <div>
            <div className="text-white/40 text-[10px] font-semibold tracking-widest uppercase leading-none">Novig</div>
            <div className="text-white font-black text-base leading-tight">Vig Calculator</div>
          </div>
        </div>
        <a
          href="https://novig.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold text-sm px-4 py-2 rounded-xl transition"
        >
          <img src={novigLogo} alt="" className="h-4 w-4 rounded" />
          Bet on Novig
        </a>
      </nav>

      {/* Two-column content */}
      <div className="flex-1 overflow-hidden px-6 pb-4 pt-5">
        <div className="grid h-full gap-4 items-start" style={{ gridTemplateColumns: '40% 1fr' }}>
          {/* Left column - hero + inputs */}
          <div className="flex flex-col gap-3 overflow-y-auto min-w-0">
            <div>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
                Sportsbooks are charging you hidden fees.
              </h1>
              <p className="mt-1 text-white/50 text-sm max-w-md">
                See exactly how much — and what you'd keep on Novig.
              </p>
            </div>
            <SportSelector
              sport={sport}
              onChange={setSport}
              loading={loadingGames}
            />
            <GameSelector
              games={games}
              loading={loadingGames}
              error={gamesError}
              selectedGameId={selectedGameId}
              onSelect={(id) => {
                setSelectedGameId(id);
                setCommittedBet(null);
                const game = games.find((g) => g.id === id);
                const hasFanduel = game?.bookmakers?.find((b) => b.key === 'fanduel');
                setSelectedBookKey(hasFanduel ? 'fanduel' : game?.bookmakers?.[0]?.key || null);
              }}
            />
            {selectedGameId && (
              <div className="card">
                <label className="label">Compare against</label>
                <select
                  className="input"
                  value={selectedBookKey || ''}
                  onChange={(e) => setSelectedBookKey(e.target.value)}
                >
                  <option value="">Pick a sportsbook...</option>
                  {(selectedGame?.bookmakers || []).map((b) => (
                    <option key={b.key} value={b.key}>{b.title}</option>
                  ))}
                </select>
              </div>
            )}
            {selectedBookKey && (
              <BetInput
                game={selectedGame}
                side={side}
                stake={stake}
                onSideChange={setSide}
                onStakeChange={setStake}
              />
            )}
          </div>

          {/* Right column - results */}
          <div className="self-start overflow-hidden min-w-0">
            {committedBet ? (
              <div className="max-h-[calc(100vh-5rem)] overflow-y-auto space-y-3 pr-2">
                <BetSlip bet={committedBet} rows={committedRows} />
                <ResultsCard bet={committedBet} selectedBookKey={selectedBookKey} />
                <VigComparison bet={committedBet} selectedBookKey={selectedBookKey} onSelectBook={setSelectedBookKey} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 rounded-2xl border border-white/5 bg-white/[0.02] text-white/20 text-sm">
                Select a game and pick your team to see your vig cost
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
