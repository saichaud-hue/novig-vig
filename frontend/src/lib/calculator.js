export function americanToImpliedProb(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || n === 0) return NaN;
  return n < 0 ? Math.abs(n) / (Math.abs(n) + 100) : 100 / (n + 100);
}

export function impliedProbToAmerican(p) {
  if (!Number.isFinite(p) || p <= 0 || p >= 1) return NaN;
  return p > 0.5 ? -100 * (p / (1 - p)) : 100 * ((1 - p) / p);
}

export function calculateNoVigOdds(team1Odds, team2Odds) {
  const p1 = americanToImpliedProb(team1Odds);
  const p2 = americanToImpliedProb(team2Odds);
  const total = p1 + p2;
  const fair1 = p1 / total;
  const fair2 = p2 / total;
  return {
    team1: { noVigProb: fair1, noVigOdds: impliedProbToAmerican(fair1) },
    team2: { noVigProb: fair2, noVigOdds: impliedProbToAmerican(fair2) },
    vigPercent: (total - 1) * 100,
  };
}

export function calculatePayout(stake, odds) {
  const n = Number(odds);
  const s = Number(stake);
  if (!Number.isFinite(n) || n === 0) return NaN;
  if (!Number.isFinite(s) || s < 0) return NaN;
  return n < 0 ? s * (100 / Math.abs(n)) : s * (n / 100);
}

export function formatOdds(odds) {
  if (!Number.isFinite(odds)) return '—';
  const rounded = Math.round(odds);
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

export function formatCurrency(amount) {
  if (!Number.isFinite(amount)) return '—';
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  return `${sign}$${abs.toFixed(2)}`;
}
