
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DixonColesModel } from './dixoncolesmodel';

interface H2HInsightsProps {
  homeRecentGames: any[];
  awayRecentGames: any[];
  h2hMatches: any[];
  homeTeam: string;
  awayTeam: string;
}

const calculateForm = (games: any[], team: string) => {
  if (!games || games.length === 0) return { wins: 0, draws: 0, losses: 0 };
  
  let wins = 0, draws = 0, losses = 0;
  
  games.forEach((game: any) => {
    const isHome = game.home_team === team;
    const homeGoals = game.goals_h_ft || 0;
    const awayGoals = game.goals_a_ft || 0;
    
    if (homeGoals === awayGoals) {
      draws++;
    } else if ((isHome && homeGoals > awayGoals) || (!isHome && awayGoals > homeGoals)) {
      wins++;
    } else {
      losses++;
    }
  });
  
  return { wins, draws, losses };
};

interface ComparisonRowProps {
  title: string;
  homeValue: any;
  awayValue: any;
  homeColor: string;
  awayColor: string;
}

const ComparisonRow = ({ title, homeValue, awayValue, homeColor, awayColor }: ComparisonRowProps) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex-1 text-left">
      <span className={`font-medium ${homeColor}`}>{homeValue}</span>
    </div>
    <div className="flex-1 text-center">
      <span className="text-sm text-gray-600">{title}</span>
    </div>
    <div className="flex-1 text-right">
      <span className={`font-medium ${awayColor}`}>{awayValue}</span>
    </div>
  </div>
);

export default function H2HInsights({ homeRecentGames, awayRecentGames, h2hMatches, homeTeam, awayTeam }: H2HInsightsProps) {
  const model = new DixonColesModel();
  const insights = model.calculateH2HInsights(homeRecentGames, awayRecentGames, h2hMatches);
  
  const homeForm = calculateForm(homeRecentGames, homeTeam);
  const awayForm = calculateForm(awayRecentGames, awayTeam);
  
  const comparisons = [
    { title: "Vitórias (últimos 5)", homeValue: homeForm.wins, awayValue: awayForm.wins, homeColor: "text-green-600", awayColor: "text-green-600" },
    { title: "Empates (últimos 5)", homeValue: homeForm.draws, awayValue: awayForm.draws, homeColor: "text-yellow-600", awayColor: "text-yellow-600" },
    { title: "Derrotas (últimos 5)", homeValue: homeForm.losses, awayValue: awayForm.losses, homeColor: "text-red-600", awayColor: "text-red-600" },
    { title: "Força de Ataque", homeValue: `${(insights.rates.homeAttack * 100).toFixed(0)}%`, awayValue: `${(insights.rates.awayAttack * 100).toFixed(0)}%`, homeColor: "text-blue-600", awayColor: "text-blue-600" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Team Comparison */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Comparação Direta</CardTitle>
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span className="font-medium">{homeTeam}</span>
            <span>vs</span>
            <span className="font-medium">{awayTeam}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {comparisons.map((comp, index) => (
              <ComparisonRow key={index} {...comp} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dixon-Coles Predictions */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Previsões (Dixon-Coles)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Resultado da Partida</h4>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="text-center p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-700">Casa</div>
                  <div className="text-green-600">{(insights.match.homeWin * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center p-2 bg-yellow-50 rounded">
                  <div className="font-semibold text-yellow-700">Empate</div>
                  <div className="text-yellow-600">{(insights.match.draw * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center p-2 bg-blue-50 rounded">
                  <div className="font-semibold text-blue-700">Fora</div>
                  <div className="text-blue-600">{(insights.match.awayWin * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 mb-2">Mercado de Gols</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-center p-2 bg-purple-50 rounded">
                  <div className="font-medium text-purple-700">Over 2.5</div>
                  <div className="text-purple-600">{(insights.goals.over25 * 100).toFixed(1)}%</div>
                </div>
                <div className="text-center p-2 bg-orange-50 rounded">
                  <div className="font-medium text-orange-700">BTTS</div>
                  <div className="text-orange-600">{(insights.btts.bttsYes * 100).toFixed(1)}%</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
