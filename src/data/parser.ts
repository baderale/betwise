export interface ParsedSlip {
  players: Array<{
    name: string;
    team: string;
  }>;
  matchups: Array<{
    homeTeam: string;
    awayTeam: string;
  }>;
  statTargets: Array<{
    playerName: string;
    statType: string;
    target: number;
    operator: 'over' | 'under';
  }>;
}

export class BetSlipParser {
  parse(betSlip: string): ParsedSlip {
    const lines = betSlip.split('\n').map(line => line.trim()).filter(Boolean);
    
    const result: ParsedSlip = {
      players: [],
      matchups: [],
      statTargets: []
    };

    // Extract matchups (assuming format like "Celtics vs Suns")
    const matchupRegex = /([A-Za-z\s]+)\s+vs\s+([A-Za-z\s]+)/;
    
    // Extract player stats (assuming format like "Jokic 25+ Points")
    const statRegex = /([A-Za-z\s]+)\s+(\d+)([+-])\s+([A-Za-z]+)/;

    for (const line of lines) {
      // Try to match a matchup
      const matchupMatch = line.match(matchupRegex);
      if (matchupMatch) {
        result.matchups.push({
          homeTeam: matchupMatch[1].trim(),
          awayTeam: matchupMatch[2].trim()
        });
        continue;
      }

      // Try to match a player stat
      const statMatch = line.match(statRegex);
      if (statMatch) {
        const [_, playerName, target, operator, statType] = statMatch;
        result.statTargets.push({
          playerName: playerName.trim(),
          statType: statType.trim(),
          target: parseInt(target),
          operator: operator === '+' ? 'over' : 'under'
        });

        // Add player to players list if not already present
        if (!result.players.some(p => p.name === playerName.trim())) {
          result.players.push({
            name: playerName.trim(),
            team: '' // Team will be determined from matchups
          });
        }
      }
    }

    return result;
  }
} 