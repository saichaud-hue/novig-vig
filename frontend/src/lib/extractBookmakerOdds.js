import { calculateNoVigOdds, calculatePayout } from './calculator.js';

export function buildComparisonRows({ game, side, stake }) {
  if (!game || !Array.isArray(game.bookmakers)) return [];

  const teamName = side === 'home' ? game.home_team : game.away_team;
  const opponentName = side === 'home' ? game.away_team : game.home_team;

  const rows = [];

  for (const book of game.bookmakers) {
    const h2h = book.markets?.find((m) => m.key === 'h2h');
    if (!h2h) continue;

    const teamOutcome = h2h.outcomes?.find((o) => o.name === teamName);
    const opponentOutcome = h2h.outcomes?.find((o) => o.name === opponentName);
    if (!teamOutcome || !opponentOutcome) continue;

    const teamOdds = Number(teamOutcome.price);
    const opponentOdds = Number(opponentOutcome.price);
    if (!Number.isFinite(teamOdds) || !Number.isFinite(opponentOdds)) continue;

    const bookPayout = calculatePayout(stake, teamOdds);
    const { team1, vigPercent } = calculateNoVigOdds(teamOdds, opponentOdds);
    const fairPayout = calculatePayout(stake, team1.noVigOdds);
    const vigCost = fairPayout - bookPayout;

    rows.push({
      bookKey: book.key,
      bookTitle: book.title,
      odds: teamOdds,
      opponentOdds,
      noVigOdds: team1.noVigOdds,
      noVigProb: team1.noVigProb,
      vigPercent,
      bookPayout,
      fairPayout,
      vigCost,
      isNovig: false,
    });
  }

  rows.sort((a, b) => b.vigCost - a.vigCost);

  if (rows.length > 0) {
    const fairNoVigProb =
      rows.reduce((sum, r) => sum + r.noVigProb, 0) / rows.length;
    const consensusNoVigOdds = (() => {
      if (!Number.isFinite(fairNoVigProb)) return NaN;
      return fairNoVigProb > 0.5
        ? -100 * (fairNoVigProb / (1 - fairNoVigProb))
        : 100 * ((1 - fairNoVigProb) / fairNoVigProb);
    })();
    const novigPayout = calculatePayout(stake, consensusNoVigOdds);

    rows.push({
      bookKey: 'novig',
      bookTitle: 'NOVIG',
      odds: consensusNoVigOdds,
      opponentOdds: null,
      noVigOdds: consensusNoVigOdds,
      noVigProb: fairNoVigProb,
      vigPercent: 0,
      bookPayout: novigPayout,
      fairPayout: novigPayout,
      vigCost: 0,
      isNovig: true,
    });
  }

  return rows;
}
