const TEAM_COLORS = {
  // NBA
  'Atlanta Hawks': '#E03A3E',
  'Boston Celtics': '#007A33',
  'Brooklyn Nets': '#000000',
  'Charlotte Hornets': '#1D1160',
  'Chicago Bulls': '#CE1141',
  'Cleveland Cavaliers': '#860038',
  'Dallas Mavericks': '#00538C',
  'Denver Nuggets': '#0E2240',
  'Detroit Pistons': '#C8102E',
  'Golden State Warriors': '#1D428A',
  'Houston Rockets': '#CE1141',
  'Indiana Pacers': '#002D62',
  'LA Clippers': '#C8102E',
  'Los Angeles Lakers': '#552583',
  'Memphis Grizzlies': '#5D76A9',
  'Miami Heat': '#98002E',
  'Milwaukee Bucks': '#00471B',
  'Minnesota Timberwolves': '#0C2340',
  'New Orleans Pelicans': '#0C2340',
  'New York Knicks': '#F58426',
  'Oklahoma City Thunder': '#007AC1',
  'Orlando Magic': '#0077C0',
  'Philadelphia 76ers': '#006BB6',
  'Phoenix Suns': '#1D1160',
  'Portland Trail Blazers': '#E03A3E',
  'Sacramento Kings': '#5A2D81',
  'San Antonio Spurs': '#C4CED4',
  'Toronto Raptors': '#CE1141',
  'Utah Jazz': '#002B5C',
  'Washington Wizards': '#002B5C',
  // NFL
  'Arizona Cardinals': '#97233F',
  'Atlanta Falcons': '#A71930',
  'Baltimore Ravens': '#241773',
  'Buffalo Bills': '#00338D',
  'Carolina Panthers': '#0085CA',
  'Chicago Bears': '#0B162A',
  'Cincinnati Bengals': '#FB4F14',
  'Cleveland Browns': '#311D00',
  'Dallas Cowboys': '#003594',
  'Denver Broncos': '#FB4F14',
  'Detroit Lions': '#0076B6',
  'Green Bay Packers': '#203731',
  'Houston Texans': '#03202F',
  'Indianapolis Colts': '#002C5F',
  'Jacksonville Jaguars': '#006778',
  'Kansas City Chiefs': '#E31837',
  'Las Vegas Raiders': '#000000',
  'Los Angeles Chargers': '#0080C6',
  'Los Angeles Rams': '#003594',
  'Miami Dolphins': '#008E97',
  'Minnesota Vikings': '#4F2683',
  'New England Patriots': '#002244',
  'New Orleans Saints': '#D3BC8D',
  'New York Giants': '#0B2265',
  'New York Jets': '#125740',
  'Philadelphia Eagles': '#004C54',
  'Pittsburgh Steelers': '#FFB612',
  'San Francisco 49ers': '#AA0000',
  'Seattle Seahawks': '#002244',
  'Tampa Bay Buccaneers': '#D50A0A',
  'Tennessee Titans': '#0C2340',
  'Washington Commanders': '#5A1414',
  // MLB
  'Arizona Diamondbacks': '#A71930',
  'Atlanta Braves': '#CE1141',
  'Baltimore Orioles': '#DF4601',
  'Boston Red Sox': '#BD3039',
  'Chicago Cubs': '#0E3386',
  'Chicago White Sox': '#27251F',
  'Cincinnati Reds': '#C6011F',
  'Cleveland Guardians': '#00385D',
  'Colorado Rockies': '#33006F',
  'Detroit Tigers': '#0C2340',
  'Houston Astros': '#002D62',
  'Kansas City Royals': '#004687',
  'Los Angeles Angels': '#BA0021',
  'Los Angeles Dodgers': '#005A9C',
  'Miami Marlins': '#00A3E0',
  'Milwaukee Brewers': '#FFC52F',
  'Minnesota Twins': '#002B5C',
  'New York Mets': '#002D72',
  'New York Yankees': '#003087',
  'Athletics': '#003831',
  'Philadelphia Phillies': '#E81828',
  'Pittsburgh Pirates': '#27251F',
  'San Diego Padres': '#2F241D',
  'San Francisco Giants': '#FD5A1E',
  'Seattle Mariners': '#0C2C56',
  'St. Louis Cardinals': '#C41E3A',
  'Tampa Bay Rays': '#092C5C',
  'Texas Rangers': '#003278',
  'Toronto Blue Jays': '#134A8E',
  'Washington Nationals': '#AB0003',
  // NHL
  'Anaheim Ducks': '#FC4C02',
  'Arizona Coyotes': '#8C2633',
  'Boston Bruins': '#FFB81C',
  'Buffalo Sabres': '#003087',
  'Calgary Flames': '#C8102E',
  'Carolina Hurricanes': '#CC0000',
  'Chicago Blackhawks': '#CF0A2C',
  'Colorado Avalanche': '#6F263D',
  'Columbus Blue Jackets': '#002654',
  'Dallas Stars': '#006847',
  'Detroit Red Wings': '#CE1126',
  'Edmonton Oilers': '#FF4C00',
  'Florida Panthers': '#041E42',
  'Los Angeles Kings': '#111111',
  'Minnesota Wild': '#154734',
  'Montreal Canadiens': '#AF1E2D',
  'Nashville Predators': '#FFB81C',
  'New Jersey Devils': '#CE1126',
  'New York Islanders': '#00539B',
  'New York Rangers': '#0038A8',
  'Ottawa Senators': '#C52032',
  'Philadelphia Flyers': '#F74902',
  'Pittsburgh Penguins': '#FCB514',
  'San Jose Sharks': '#006D75',
  'Seattle Kraken': '#001628',
  'St. Louis Blues': '#002F87',
  'Tampa Bay Lightning': '#002868',
  'Toronto Maple Leafs': '#00205B',
  'Utah Hockey Club': '#6CAEDF',
  'Vancouver Canucks': '#00205B',
  'Vegas Golden Knights': '#B4975A',
  'Washington Capitals': '#041E42',
  'Winnipeg Jets': '#041E42',
};

export default function BetInput({
  game,
  side,
  stake,
  onSideChange,
  onStakeChange,
}) {
  const clamp = (v) => {
    const n = Number(v);
    if (!Number.isFinite(n)) return 1;
    return Math.min(10_000, Math.max(1, n));
  };

  const awayColor = TEAM_COLORS[game.away_team] ?? '#179BE7';
  const homeColor = TEAM_COLORS[game.home_team] ?? '#179BE7';

  return (
    <div className="card">
      <label className="label">Your trade</label>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => onSideChange('away')}
          className="rounded-xl border px-4 py-3 text-left transition"
          style={
            side === 'away'
              ? { borderColor: awayColor, backgroundColor: awayColor + '22' }
              : { borderColor: 'rgba(255,255,255,0.20)', backgroundColor: 'rgba(255,255,255,0.06)' }
          }
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Away
          </div>
          <div className={`font-bold text-lg ${side === 'away' ? 'text-white' : 'text-white/90'}`}>
            {side === 'away' && '✓ '}{game.away_team}
          </div>
        </button>
        <button
          type="button"
          onClick={() => onSideChange('home')}
          className="rounded-xl border px-4 py-3 text-left transition"
          style={
            side === 'home'
              ? { borderColor: homeColor, backgroundColor: homeColor + '22' }
              : { borderColor: 'rgba(255,255,255,0.20)', backgroundColor: 'rgba(255,255,255,0.06)' }
          }
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-white/50">
            Home
          </div>
          <div className={`font-bold text-lg ${side === 'home' ? 'text-white' : 'text-white/90'}`}>
            {side === 'home' && '✓ '}{game.home_team}
          </div>
        </button>
      </div>

      <div className="mt-4">
        <label className="label">Stake</label>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">Stake</span>
            <div className="flex items-center gap-1">
              <span className="text-white/50">$</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={stake}
                onChange={(e) => onStakeChange(e.target.value)}
                onBlur={(e) => onStakeChange(clamp(e.target.value))}
                className="w-20 bg-transparent text-right text-white font-black text-xl outline-none"
              />
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={1000}
            step={5}
            value={Math.min(stake, 1000)}
            onChange={(e) => onStakeChange(Number(e.target.value))}
            className="w-full accent-[#179BE7] h-1.5 rounded-full"
          />
          <div className="flex justify-between mt-1 text-[10px] text-white/25">
            <span>$1</span><span>$250</span><span>$500</span><span>$1,000+</span>
          </div>
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100, 500].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onStakeChange(v)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  Number(stake) === v
                    ? 'border-[#179BE7] bg-[#179BE7]/20 text-[#179BE7]'
                    : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                }`}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
