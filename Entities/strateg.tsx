{
  "name": "Strategy",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da estratégia"
    },
    "description": {
      "type": "string",
      "description": "Descrição da estratégia"
    },
    "market": {
      "type": "string",
      "enum": [
        "home_win",
        "draw",
        "away_win",
        "home_win_ht",
        "draw_ht",
        "away_win_ht",
        "over_15",
        "over_25",
        "over_35",
        "over_45",
        "under_15",
        "under_25",
        "under_35",
        "under_45",
        "btts_yes",
        "btts_no",
        "dc_1x",
        "dc_12",
        "dc_x2"
      ],
      "description": "Mercado principal"
    },
    "min_odds": {
      "type": "number",
      "description": "Odd mínima para o mercado principal"
    },
    "max_odds": {
      "type": "number",
      "description": "Odd máxima para o mercado principal"
    },
    "unit_stake": {
      "type": "number",
      "description": "Valor da aposta unitária"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Data inicial"
    },
    "end_date": {
      "type": "string",
      "format": "date",
      "description": "Data final"
    },
    "season": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Temporadas selecionadas"
    },
    "leagues": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Ligas selecionadas"
    },
    "home_teams": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Times mandantes"
    },
    "away_teams": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Times visitantes"
    },
    "min_game_week": {
      "type": "number",
      "description": "Rodada mínima"
    },
    "max_game_week": {
      "type": "number",
      "description": "Rodada máxima"
    },
    "min_home_ppg": {
      "type": "number",
      "description": "PPG casa mínimo"
    },
    "max_home_ppg": {
      "type": "number",
      "description": "PPG casa máximo"
    },
    "min_away_ppg": {
      "type": "number",
      "description": "PPG fora mínimo"
    },
    "max_away_ppg": {
      "type": "number",
      "description": "PPG fora máximo"
    },
    "min_home_xg": {
      "type": "number",
      "description": "xG casa mínimo"
    },
    "max_home_xg": {
      "type": "number",
      "description": "xG casa máximo"
    },
    "min_away_xg": {
      "type": "number",
      "description": "xG fora mínimo"
    },
    "max_away_xg": {
      "type": "number",
      "description": "xG fora máximo"
    },
    "min_shots_on_target_h": {
      "type": "number",
      "description": "Mínimo de chutes a gol (Casa)"
    },
    "max_shots_on_target_h": {
      "type": "number",
      "description": "Máximo de chutes a gol (Casa)"
    },
    "min_shots_on_target_a": {
      "type": "number",
      "description": "Mínimo de chutes a gol (Fora)"
    },
    "max_shots_on_target_a": {
      "type": "number",
      "description": "Máximo de chutes a gol (Fora)"
    },
    "min_shots_off_target_h": {
      "type": "number",
      "description": "Mínimo de chutes (Casa)"
    },
    "max_shots_off_target_h": {
      "type": "number",
      "description": "Máximo de chutes (Casa)"
    },
    "min_shots_off_target_a": {
      "type": "number",
      "description": "Mínimo de chutes (Fora)"
    },
    "max_shots_off_target_a": {
      "type": "number",
      "description": "Máximo de chutes (Fora)"
    },
    "min_goals_h_ht": {
      "type": "number",
      "description": "Gols Mínimos Casa (1T)"
    },
    "max_goals_h_ht": {
      "type": "number",
      "description": "Gols Máximos Casa (1T)"
    },
    "min_goals_a_ht": {
      "type": "number",
      "description": "Gols Mínimos Fora (1T)"
    },
    "max_goals_a_ht": {
      "type": "number",
      "description": "Gols Máximos Fora (1T)"
    },
    "min_goals_h_ft": {
      "type": "number",
      "description": "Gols Mínimos Casa (Final)"
    },
    "max_goals_h_ft": {
      "type": "number",
      "description": "Gols Máximos Casa (Final)"
    },
    "min_goals_a_ft": {
      "type": "number",
      "description": "Gols Mínimos Fora (Final)"
    },
    "max_goals_a_ft": {
      "type": "number",
      "description": "Gols Máximos Fora (Final)"
    },
    "min_ranking_home": {
      "type": "number",
      "description": "Ranking Casa Mínimo"
    },
    "max_ranking_home": {
      "type": "number",
      "description": "Ranking Casa Máximo"
    },
    "min_ranking_away": {
      "type": "number",
      "description": "Ranking Fora Mínimo"
    },
    "max_ranking_away": {
      "type": "number",
      "description": "Ranking Fora Máximo"
    },
    "min_odds_h_ht": {
      "type": "number",
      "description": "Odd Mínima 1x2 Casa (1T)"
    },
    "max_odds_h_ht": {
      "type": "number",
      "description": "Odd Máxima 1x2 Casa (1T)"
    },
    "min_odds_d_ht": {
      "type": "number",
      "description": "Odd Mínima 1x2 Empate (1T)"
    },
    "max_odds_d_ht": {
      "type": "number",
      "description": "Odd Máxima 1x2 Empate (1T)"
    },
    "min_odds_a_ht": {
      "type": "number",
      "description": "Odd Mínima 1x2 Fora (1T)"
    },
    "max_odds_a_ht": {
      "type": "number",
      "description": "Odd Máxima 1x2 Fora (1T)"
    },
    "min_odds_ft_home_team_win": {
      "type": "number",
      "description": "Odd Mínima 1x2 Casa"
    },
    "max_odds_ft_home_team_win": {
      "type": "number",
      "description": "Odd Máxima 1x2 Casa"
    },
    "min_odds_ft_draw": {
      "type": "number",
      "description": "Odd Mínima 1x2 Empate"
    },
    "max_odds_ft_draw": {
      "type": "number",
      "description": "Odd Máxima 1x2 Empate"
    },
    "min_odds_ft_away_team_win": {
      "type": "number",
      "description": "Odd Mínima 1x2 Fora"
    },
    "max_odds_ft_away_team_win": {
      "type": "number",
      "description": "Odd Máxima 1x2 Fora"
    },
    "min_odds_ft_over15": {
      "type": "number",
      "description": "Odd Mínima Over 1.5FT"
    },
    "max_odds_ft_over15": {
      "type": "number",
      "description": "Odd Máxima Over 1.5FT"
    },
    "min_odds_ft_over25": {
      "type": "number",
      "description": "Odd Mínima Over 2.5FT"
    },
    "max_odds_ft_over25": {
      "type": "number",
      "description": "Odd Máxima Over 2.5FT"
    },
    "min_odds_ft_over35": {
      "type": "number",
      "description": "Odd Mínima Over 3.5FT"
    },
    "max_odds_ft_over35": {
      "type": "number",
      "description": "Odd Máxima Over 3.5FT"
    },
    "min_odds_ft_over45": {
      "type": "number",
      "description": "Odd Mínima Over 4.5FT"
    },
    "max_odds_ft_over45": {
      "type": "number",
      "description": "Odd Máxima Over 4.5FT"
    },
    "min_odds_btts_yes": {
      "type": "number",
      "description": "Odd Mínima BTTS Sim"
    },
    "max_odds_btts_yes": {
      "type": "number",
      "description": "Odd Máxima BTTS Sim"
    },
    "min_odds_btts_no": {
      "type": "number",
      "description": "Odd Mínima BTTS Não"
    },
    "max_odds_btts_no": {
      "type": "number",
      "description": "Odd Máxima BTTS Não"
    },
    "min_odds_under05_ft": {
      "type": "number",
      "description": "Odd Mínima Under 0.5FT"
    },
    "max_odds_under05_ft": {
      "type": "number",
      "description": "Odd Máxima Under 0.5FT"
    },
    "min_odds_under15_ft": {
      "type": "number",
      "description": "Odd Mínima Under 1.5FT"
    },
    "max_odds_under15_ft": {
      "type": "number",
      "description": "Odd Máxima Under 1.5FT"
    },
    "min_odds_under25_ft": {
      "type": "number",
      "description": "Odd Mínima Under 2.5FT"
    },
    "max_odds_under25_ft": {
      "type": "number",
      "description": "Odd Máxima Under 2.5FT"
    },
    "min_odds_under35_ft": {
      "type": "number",
      "description": "Odd Mínima Under 3.5FT"
    },
    "max_odds_under35_ft": {
      "type": "number",
      "description": "Odd Máxima Under 3.5FT"
    },
    "min_odds_under45_ft": {
      "type": "number",
      "description": "Odd Mínima Under 4.5FT"
    },
    "max_odds_under45_ft": {
      "type": "number",
      "description": "Odd Máxima Under 4.5FT"
    },
    "min_odds_dc_1x": {
      "type": "number",
      "description": "Odd Mínima DC 1X"
    },
    "max_odds_dc_1x": {
      "type": "number",
      "description": "Odd Máxima DC 1X"
    },
    "min_odds_dc_12": {
      "type": "number",
      "description": "Odd Mínima DC 12"
    },
    "max_odds_dc_12": {
      "type": "number",
      "description": "Odd Máxima DC 12"
    },
    "min_odds_dc_x2": {
      "type": "number",
      "description": "Odd Mínima DC X2"
    },
    "max_odds_dc_x2": {
      "type": "number",
      "description": "Odd Máxima DC X2"
    },
    "results": {
      "type": "object",
      "properties": {
        "total_bets": {
          "type": "number"
        },
        "winning_bets": {
          "type": "number"
        },
        "hit_rate": {
          "type": "number"
        },
        "average_odds": {
          "type": "number"
        },
        "total_profit": {
          "type": "number"
        },
        "roi": {
          "type": "number"
        },
        "max_winning_streak": {
          "type": "number"
        },
        "max_winning_streak_profit": {
          "type": "number"
        },
        "max_losing_streak": {
          "type": "number"
        },
        "max_losing_streak_loss": {
          "type": "number"
        },
        "sample_bets": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "best_leagues": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "worst_leagues": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "best_teams": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "worst_teams": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "common_scores": {
          "type": "array",
          "items": {
            "type": "object"
          }
        },
        "evolution_chart": {
          "type": "array",
          "items": {
            "type": "object"
          }
        }
      }
    }
  },
  "required": [
    "name",
    "market",
    "unit_stake"
  ]
}