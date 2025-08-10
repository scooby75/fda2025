
export interface Game {
  id: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season: number;
  goals_h_ft: number;
  goals_a_ft: number;
  [key: string]: any;
}

export interface GameData {
  id?: string;
  home: string;
  away: string;
  date: string;
  league: string;
  season?: number;
  goals_h_ft?: number;
  goals_a_ft?: number;
  [key: string]: any;
}

export interface Strategy {
  id?: number;
  name: string;
  market: string;
  season?: string | string[];
  min_ranking_home?: number;
  max_ranking_home?: number;
  min_ranking_away?: number;
  max_ranking_away?: number;
  [key: string]: any;
}

export default class BacktestingEngine {
  filterGames(strategy: Strategy, gameData: GameData[], excludeTeams: string[] = [], includeTeams: string[] = []): Game[] {
    return gameData
      .filter((game) => {
        // Basic filtering logic
        if (excludeTeams.length > 0 && (excludeTeams.includes(game.home) || excludeTeams.includes(game.away))) {
          return false;
        }
        
        if (includeTeams.length > 0 && !(includeTeams.includes(game.home) || includeTeams.includes(game.away))) {
          return false;
        }

        return true;
      })
      .map(game => ({
        ...game,
        id: game.id || `${game.home}-${game.away}-${game.date}`,
        goals_h_ft: game.goals_h_ft || 0,
        goals_a_ft: game.goals_a_ft || 0,
        season: game.season || new Date(game.date).getFullYear()
      })) as Game[];
  }

  calculateResults(games: Game[], strategy: Strategy) {
    // Basic results calculation
    return {
      totalGames: games.length,
      wins: 0,
      losses: 0,
      profit: 0,
      roi: 0
    };
  }
}
