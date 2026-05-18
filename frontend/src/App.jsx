import { useEffect, useMemo, useState } from 'react';
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
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="40" height="40" rx="9" fill="#3b82f6"/>
              <path d="M10 30V10h4.5l11 14.5V10H30v20h-4.5L14.5 15.5V30H10z" fill="black"/>
            </svg>
            <span className="text-2xl font-black tracking-tight text-white">Novig</span>
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-novig-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-novig-accent" />
            Zero-vig sportsbook
          </div>
          <h1 className="bg-gradient-to-r from-white to-novig-accent bg-clip-text text-4xl font-black tracking-tight text-transparent sm:text-5xl">
            What You Left on the Table
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium text-slate-400 sm:text-lg">
            See how much vig you're paying vs Novig's zero-commission pricing.
          </p>
        </header>

        <div className="space-y-6">
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

          {committedBet && (
            <>
              <ResultsCard bet={committedBet} selectedBookKey={selectedBookKey} />
              <VigComparison bet={committedBet} selectedBookKey={selectedBookKey} onSelectBook={setSelectedBookKey} />
            </>
          )}
        </div>

        <footer className="mt-16 text-center text-xs text-slate-500">
          Odds data from The Odds API. Vig calculations use proportional
          de-vigging from the two-way moneyline market.
        </footer>
      </div>
    </div>
  );
}
