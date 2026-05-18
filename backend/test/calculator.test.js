const {
  americanToImpliedProb,
  impliedProbToAmerican,
  calculateNoVigOdds,
  calculatePayout,
} = require('../utils/calculator');

let passed = 0;
let failed = 0;

function approx(a, b, tolerance = 0.01) {
  return Math.abs(a - b) <= tolerance;
}

function test(name, fn) {
  try {
    fn();
    console.log(`  ok  ${name}`);
    passed++;
  } catch (err) {
    console.log(`  FAIL  ${name}`);
    console.log(`    ${err.message}`);
    failed++;
  }
}

console.log('americanToImpliedProb');
test('-150 -> 0.6', () => {
  const p = americanToImpliedProb(-150);
  if (!approx(p, 0.6, 0.001)) throw new Error(`got ${p}`);
});
test('+130 -> 0.4348', () => {
  const p = americanToImpliedProb(130);
  if (!approx(p, 0.4348, 0.001)) throw new Error(`got ${p}`);
});
test('+100 -> 0.5', () => {
  const p = americanToImpliedProb(100);
  if (!approx(p, 0.5, 0.001)) throw new Error(`got ${p}`);
});
test('-200 -> 0.6667', () => {
  const p = americanToImpliedProb(-200);
  if (!approx(p, 0.6667, 0.001)) throw new Error(`got ${p}`);
});

console.log('\nimpliedProbToAmerican');
test('0.6 -> -150', () => {
  const o = impliedProbToAmerican(0.6);
  if (!approx(o, -150, 0.1)) throw new Error(`got ${o}`);
});
test('0.4348 -> +130', () => {
  const o = impliedProbToAmerican(0.4348);
  if (!approx(o, 130, 0.5)) throw new Error(`got ${o}`);
});
test('0.5 -> +100 (boundary, prob<=0.5)', () => {
  const o = impliedProbToAmerican(0.5);
  if (!approx(o, 100, 0.1)) throw new Error(`got ${o}`);
});

console.log('\ncalculateNoVigOdds (DraftKings example: Lakers -150, Celtics +130)');
test('Lakers no-vig prob ~ 0.58', () => {
  const r = calculateNoVigOdds(-150, 130);
  if (!approx(r.team1.noVigProb, 0.58, 0.005)) {
    throw new Error(`got ${r.team1.noVigProb}`);
  }
});
test('Lakers no-vig odds ~ -138', () => {
  const r = calculateNoVigOdds(-150, 130);
  if (!approx(r.team1.noVigOdds, -138, 1)) {
    throw new Error(`got ${r.team1.noVigOdds}`);
  }
});
test('Vig ~ 3.5%', () => {
  const r = calculateNoVigOdds(-150, 130);
  if (!approx(r.vigPercent, 3.5, 0.2)) throw new Error(`got ${r.vigPercent}`);
});

console.log('\ncalculatePayout');
test('$30 at -150 -> $20', () => {
  const p = calculatePayout(30, -150);
  if (!approx(p, 20, 0.01)) throw new Error(`got ${p}`);
});
test('$30 at -138 -> $21.74', () => {
  const p = calculatePayout(30, -138);
  if (!approx(p, 21.74, 0.01)) throw new Error(`got ${p}`);
});
test('$100 at +200 -> $200', () => {
  const p = calculatePayout(100, 200);
  if (!approx(p, 200, 0.01)) throw new Error(`got ${p}`);
});

console.log('\nFull spec example: $30 on Lakers -150 vs Celtics +130');
test('DraftKings payout $20.00', () => {
  const p = calculatePayout(30, -150);
  if (!approx(p, 20.0, 0.01)) throw new Error(`got ${p}`);
});
test('No-vig payout ~ $21.74', () => {
  const r = calculateNoVigOdds(-150, 130);
  const p = calculatePayout(30, r.team1.noVigOdds);
  if (!approx(p, 21.74, 0.05)) throw new Error(`got ${p}`);
});
test('Vig cost ~ $1.74', () => {
  const r = calculateNoVigOdds(-150, 130);
  const dkPayout = calculatePayout(30, -150);
  const fairPayout = calculatePayout(30, r.team1.noVigOdds);
  const vigCost = fairPayout - dkPayout;
  if (!approx(vigCost, 1.74, 0.05)) throw new Error(`got ${vigCost}`);
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
