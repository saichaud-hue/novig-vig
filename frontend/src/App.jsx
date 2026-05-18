import { useEffect, useMemo, useState } from 'react';
import novigLogo from './assets/novig-logo.png'
import axios from 'axios';
import SportSelector from './components/SportSelector.jsx';
import GameSelector from './components/GameSelector.jsx';
import BetInput from './components/BetInput.jsx';
import VigComparison from './components/VigComparison.jsx';
import ResultsCard from './components/ResultsCard.jsx';
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

  const handleCalculate = () => {
    if (!selectedGame) return;
    const bet = {
      game: selectedGame,
      side,
      stake: Number(stake),
    };
    setCommittedBet(bet);
    const rows = buildComparisonRows(bet);
    const worstBook = rows.find((r) => !r.isNovig);
    setSelectedBookKey(worstBook?.bookKey || null);
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-2.5 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2.5">
          <img src={novigLogo} alt="Novig" className="h-7 w-7 rounded-lg" />
          <div>
            <div className="text-white/40 text-[10px] font-semibold tracking-widest uppercase leading-none">Novig</div>
            <div className="text-white font-bold text-sm leading-tight">Vig Calculator</div>
          </div>
        </div>
        <a
          href="https://novig.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-white/40 hover:text-white transition-colors"
        >
          Place bets on Novig →
        </a>
      </nav>

      {/* Hero */}
      <div className="px-6 pt-5 pb-3 shrink-0">
        <div className="mb-1 section-label">Vig Calculator</div>
        <h1 className="text-3xl font-black text-white leading-tight tracking-tight">
          See your{' '}
          <em className="text-blue-400 not-italic font-black">vig.</em>
        </h1>
        <p className="mt-1 text-white/40 text-xs max-w-md">
          How much commission you're paying versus Novig's zero-vig pricing — broken down by sportsbook.
        </p>
      </div>

      {/* Two-column content */}
      <div className="flex-1 overflow-hidden px-6 pb-4">
        <div className="grid h-full gap-4" style={{ gridTemplateColumns: '40% 1fr' }}>
          {/* Left column - inputs */}
          <div className="flex flex-col gap-3 overflow-y-auto min-w-0">
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
                setSelectedBookKey(null);
              }}
            />
            {selectedGame && (
              <BetInput
                game={selectedGame}
                side={side}
                stake={stake}
                onSideChange={setSide}
                onStakeChange={setStake}
                onCalculate={handleCalculate}
              />
            )}
          </div>

          {/* Right column - results */}
          <div className="h-full overflow-hidden min-w-0">
            {committedBet ? (
              <div className="h-full overflow-y-auto space-y-4 pr-2">
                <ResultsCard bet={committedBet} selectedBookKey={selectedBookKey} />
                <VigComparison bet={committedBet} selectedBookKey={selectedBookKey} onSelectBook={setSelectedBookKey} />
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-white/20 text-sm text-center px-8">
                Select a game and calculate to see your vig cost
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
