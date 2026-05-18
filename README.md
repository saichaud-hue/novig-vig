# Novig Vig Comparison

A public web app that shows bettors how much money they're leaving on the
table to vig on other sportsbooks vs Novig's zero-vig pricing.

## Structure

- `backend/` — Express API that proxies The Odds API with a 5-minute cache
  and exposes the core vig math.
- `frontend/` — React + Tailwind UI for picking a sport, game, side, and
  stake, then rendering a per-book vig comparison.

## Running locally

### Backend

```
cd backend
cp .env.example .env   # then set ODDS_API_KEY to your Odds API key
npm install
npm start              # http://localhost:4000
npm test               # runs the calculator unit tests
```

Endpoints:

- `GET /health`
- `GET /api/sports`
- `GET /api/odds/:sport` — `basketball_nba`, `americanfootball_nfl`,
  `icehockey_nhl`, or `baseball_mlb`.

### Frontend

```
cd frontend
npm install
npm run dev            # http://localhost:5173, proxies /api -> :4000
npm run build
```

## How the no-vig math works

For a two-way moneyline, both sides' implied probabilities sum to more
than 1.0 — the excess is the book's vig. Dividing each side's implied
probability by the sum yields the proportionally de-vigged fair
probabilities, which are then converted back to American odds.

Example: DraftKings posts Lakers -150 / Celtics +130 (implied 60% +
43.5% = 103.5%, so 3.5% vig). De-vigged Lakers prob is 60% / 103.5% =
58%, which converts to -138. A $30 bet pays $20.00 at the book vs $21.74
at fair odds — $1.74 of vig per bet, $174 over 100 bets like it.
