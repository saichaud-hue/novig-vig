const express = require('express');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');

const router = express.Router();

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const SUPPORTED_SPORTS = new Set([
  'basketball_nba',
  'americanfootball_nfl',
  'icehockey_nhl',
  'baseball_mlb',
]);

const ODDS_API_BASE = 'https://api.the-odds-api.com/v4';
const REQUEST_TIMEOUT_MS = 30_000;

async function fetchOdds(sport, apiKey) {
  const url = `${ODDS_API_BASE}/sports/${sport}/odds?apiKey=${apiKey}&regions=us&markets=h2h&oddsFormat=american`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const res = await fetch(url, { signal: controller.signal });
    return { status: res.status, body: await res.text() };
  } finally {
    clearTimeout(timer);
  }
}

router.get('/odds/:sport', async (req, res) => {
  const { sport } = req.params;

  if (!SUPPORTED_SPORTS.has(sport)) {
    return res.status(400).json({
      error: 'Unsupported sport',
      supported: [...SUPPORTED_SPORTS],
    });
  }

  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey || apiKey === 'your_odds_api_key_here') {
    return res.status(500).json({
      error: 'Server is missing ODDS_API_KEY configuration',
    });
  }

  const cacheKey = `odds:${sport}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached);
  }

  let result;
  try {
    result = await fetchOdds(sport, apiKey);
  } catch (err) {
    if (err.name === 'AbortError') {
      return res.status(504).json({ error: 'Odds API request timed out' });
    }
    return res.status(503).json({
      error: 'Odds API is unreachable',
      detail: err.message,
    });
  }

  if (result.status === 429) {
    return res.status(429).json({ error: 'Odds API rate limit exceeded' });
  }
  if (result.status === 401 || result.status === 403) {
    return res.status(502).json({ error: 'Odds API rejected the API key' });
  }
  if (result.status >= 500) {
    return res.status(503).json({
      error: 'Odds API is down',
      upstreamStatus: result.status,
    });
  }
  if (result.status !== 200) {
    return res.status(502).json({
      error: 'Unexpected response from Odds API',
      upstreamStatus: result.status,
    });
  }

  let parsed;
  try {
    parsed = JSON.parse(result.body);
  } catch (err) {
    return res.status(502).json({ error: 'Invalid JSON from Odds API' });
  }

  const games = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.data) ? parsed.data : parsed;

  const transformed = (Array.isArray(games) ? games : []).map(g => ({
    id: g.event_id || g.id,
    home_team: g.home_team,
    away_team: g.away_team,
    commence_time: g.start_time || g.commence_time,
    bookmakers: (g.books || g.bookmakers || []).map(b => ({
      key: b.book || b.key,
      title: b.book || b.title,
      markets: [{ key: 'h2h', outcomes: (b.outcomes || []).map(o => ({ name: o.name, price: o.price })) }],
    })),
  }));

  const payload = {
    sport,
    fetchedAt: new Date().toISOString(),
    count: transformed.length,
    games: transformed,
  };

  cache.set(cacheKey, payload);
  res.setHeader('X-Cache', 'MISS');
  res.json(payload);
});

router.get('/sports', (req, res) => {
  res.json({ sports: [...SUPPORTED_SPORTS] });
});

module.exports = router;
