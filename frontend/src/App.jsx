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
  const [page, setPage] = useState('configure');

  const [sport, setSport] = useState('basketball_nba');
  const [games, setGames] = useState([]);
  const [loadingGames, setLoadingGames] = useState(false);
  const [gamesError, setGamesError] = useState(null);

  const [selectedGameId, setSelectedGameId] = useState('');
  const [side, setSide] = useState('');
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

    return () => { cancelled = true; };
  }, [sport]);

  const selectedGame = games.find((g) => g.id === selectedGameId) || null;
  const committedRows = useMemo(
    () => (committedBet ? buildComparisonRows(committedBet) : []),
    [committedBet]
  );

  const canCalculate = !!(selectedGame && selectedBookKey && side);

  const handleCalculate = () => {
    if (!canCalculate) return;
    const bet = { game: selectedGame, side, stake: Number(stake) };
    setCommittedBet(bet);
    setPage('results');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3">
          {page === 'results' && (
            <button
              onClick={() => setPage('configure')}
              className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition mr-1"
            >
              ← Change Trade
            </button>
          )}
          <div className="flex items-center gap-2.5">
            <img src={novigLogo} alt="Novig" className="h-9 w-9 rounded-lg" />
            <div>
              <div className="text-white/40 text-[10px] font-semibold tracking-widest uppercase leading-none">Novig</div>
              <div className="text-white font-black text-base leading-tight">Vig Calculator</div>
            </div>
          </div>
        </div>
        <a
          href="https://novig.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#179BE7] hover:bg-[#179BE7]/90 text-white font-bold text-sm px-4 py-2 rounded-xl transition"
        >
          <img src={novigLogo} alt="" className="h-4 w-4 rounded" />
          Trade on Novig
        </a>
      </nav>

      {/* Page 1 — Configure */}
      {page === 'configure' && (
        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-[480px] mx-auto flex flex-col gap-5">
            <div>
              <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
                Sportsbooks charge hidden fees on every trade.
              </h1>
              <p className="mt-1 text-white/50 text-sm">
                See exactly how much — and what you'd keep on Novig.
              </p>
            </div>

            <SportSelector
              sport={sport}
              onChange={(s) => { setSport(s); setSide(''); }}
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
                setSide('');
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

            {selectedBookKey && selectedGame && (
              <BetInput
                game={selectedGame}
                side={side}
                stake={stake}
                onSideChange={setSide}
                onStakeChange={setStake}
              />
            )}

            <button
              type="button"
              onClick={handleCalculate}
              disabled={!canCalculate}
              className={`w-full py-4 rounded-xl font-bold text-base transition ${
                canCalculate
                  ? 'bg-[#179BE7] hover:bg-[#179BE7]/90 text-white'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              Calculate Savings →
            </button>
          </div>
        </div>
      )}

      {/* Page 2 — Results */}
      {page === 'results' && (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-4">
            <BetSlip bet={committedBet} rows={committedRows} />
            {committedBet && (
              <>
                <ResultsCard bet={committedBet} selectedBookKey={selectedBookKey} />
                <VigComparison
                  bet={committedBet}
                  selectedBookKey={selectedBookKey}
                  onSelectBook={setSelectedBookKey}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
