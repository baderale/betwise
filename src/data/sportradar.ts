import axios from 'axios';
import { ParsedSlip } from './parser';

interface PlayerStats {
  lastGames: Array<{
    date: string;
    points: number;
    rebounds: number;
    assists: number;
    minutes: number;
    opponent: string;
    isHome: boolean;
  }>;
  seasonAverages: {
    points: number;
    rebounds: number;
    assists: number;
    minutes: number;
  };
  teamSpecific: {
    [team: string]: {
      points: number;
      rebounds: number;
      assists: number;
      games: number;
    };
  };
}

export class SportradarClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.SPORTRADAR_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('SPORTRADAR_API_KEY environment variable is required');
    }
    this.baseUrl = 'https://api.sportradar.com/nba/trial/v7/en';
  }

  async fetchPlayerData(parsedSlip: ParsedSlip): Promise<Record<string, PlayerStats>> {
    const playerStats: Record<string, PlayerStats> = {};

    for (const player of parsedSlip.players) {
      try {
        // Fetch player profile to get their ID
        const profileResponse = await axios.get(
          `${this.baseUrl}/players/search.json`,
          {
            params: {
              api_key: this.apiKey,
              name: player.name
            }
          }
        );

        const playerId = profileResponse.data.players[0]?.id;
        if (!playerId) {
          throw new Error(`Player not found: ${player.name}`);
        }

        // Fetch player statistics
        const statsResponse = await axios.get(
          `${this.baseUrl}/players/${playerId}/statistics.json`,
          {
            params: {
              api_key: this.apiKey
            }
          }
        );

        // Process and format the data
        playerStats[player.name] = this.formatPlayerStats(statsResponse.data);
      } catch (error) {
        console.error(`Error fetching data for ${player.name}:`, error);
        throw new Error(`Failed to fetch data for ${player.name}`);
      }
    }

    return playerStats;
  }

  private formatPlayerStats(data: any): PlayerStats {
    // This is a placeholder implementation
    // You'll need to adapt this based on the actual Sportradar API response structure
    return {
      lastGames: [],
      seasonAverages: {
        points: 0,
        rebounds: 0,
        assists: 0,
        minutes: 0
      },
      teamSpecific: {}
    };
  }
} 