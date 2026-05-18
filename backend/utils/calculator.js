function americanToImpliedProb(odds) {
  const n = Number(odds);
  if (!Number.isFinite(n) || n === 0) {
    throw new Error(`Invalid American odds: ${odds}`);
  }
  if (n < 0) {
    return Math.abs(n) / (Math.abs(n) + 100);
  }
  return 100 / (n + 100);
}

function impliedProbToAmerican(probability) {
  const p = Number(probability);
  if (!Number.isFinite(p) || p <= 0 || p >= 1) {
    throw new Error(`Invalid probability: ${probability}`);
  }
  if (p > 0.5) {
    return -100 * (p / (1 - p));
  }
  return 100 * ((1 - p) / p);
}

function calculateNoVigOdds(team1Odds, team2Odds) {
  const p1 = americanToImpliedProb(team1Odds);
  const p2 = americanToImpliedProb(team2Odds);
  const total = p1 + p2;

  const fair1 = p1 / total;
  const fair2 = p2 / total;

  return {
    team1: {
      noVigProb: fair1,
      noVigOdds: impliedProbToAmerican(fair1),
    },
    team2: {
      noVigProb: fair2,
      noVigOdds: impliedProbToAmerican(fair2),
    },
    vigPercent: (total - 1) * 100,
  };
}

function calculatePayout(stake, odds) {
  const n = Number(odds);
  const s = Number(stake);
  if (!Number.isFinite(n) || n === 0) {
    throw new Error(`Invalid American odds: ${odds}`);
  }
  if (!Number.isFinite(s) || s < 0) {
    throw new Error(`Invalid stake: ${stake}`);
  }
  if (n < 0) {
    return s * (100 / Math.abs(n));
  }
  return s * (n / 100);
}

module.exports = {
  americanToImpliedProb,
  impliedProbToAmerican,
  calculateNoVigOdds,
  calculatePayout,
};
