{
  "name": "DailyGame",
  "type": "object",
  "properties": {
    "league": {
      "type": "string",
      "description": "Nome da liga"
    },
    "date": {
      "type": "string",
      "description": "Data do jogo"
    },
    "time": {
      "type": "string",
      "description": "Horário do jogo"
    },
    "rodada": {
      "type": [
        "string",
        "number"
      ],
      "description": "Rodada do campeonato"
    },
    "home": {
      "type": "string",
      "description": "Nome do time mandante"
    },
    "away": {
      "type": "string",
      "description": "Nome do time visitante"
    },
    "odd_h_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Casa Vence (1T)"
    },
    "odd_d_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Empate (1T)"
    },
    "odd_a_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Visitante Vence (1T)"
    },
    "odd_h_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Casa Vence (Final)"
    },
    "odd_d_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Empate (Final)"
    },
    "odd_a_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Visitante Vence (Final)"
    },
    "odd_over05_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 0.5 (1T)"
    },
    "odd_under05_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 0.5 (1T)"
    },
    "odd_over15_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 1.5 (1T)"
    },
    "odd_under15_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 1.5 (1T)"
    },
    "odd_over25_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 2.5 (1T)"
    },
    "odd_under25_ht": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 2.5 (1T)"
    },
    "odd_over05_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 0.5 (Final)"
    },
    "odd_under05_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 0.5 (Final)"
    },
    "odd_over15_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 1.5 (Final)"
    },
    "odd_under15_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 1.5 (Final)"
    },
    "odd_over25_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Over 2.5 (Final)"
    },
    "odd_under25_ft": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Under 2.5 (Final)"
    },
    "odd_btts_yes": {
      "type": "number",
      "minimum": 0,
      "description": "Odd BTTS Sim"
    },
    "odd_btts_no": {
      "type": "number",
      "minimum": 0,
      "description": "Odd BTTS Não"
    },
    "odd_dc_1x": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Dupla Chance 1X"
    },
    "odd_dc_12": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Dupla Chance 12"
    },
    "odd_dc_x2": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Dupla Chance X2"
    },
    "ppg_home": {
      "type": "number",
      "minimum": 0,
      "description": "PPG Casa"
    },
    "ppg_away": {
      "type": "number",
      "minimum": 0,
      "description": "PPG Fora"
    },
    "xg_home_pre": {
      "type": "number",
      "minimum": 0,
      "description": "xG Casa Pré-jogo"
    },
    "xg_away_pre": {
      "type": "number",
      "minimum": 0,
      "description": "xG Fora Pré-jogo"
    },
    "xg_total_pre": {
      "type": "number",
      "minimum": 0,
      "description": "xG Total Pré-jogo"
    },
    "odd_corners_h": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Casa Vence"
    },
    "odd_corners_d": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Empate"
    },
    "odd_corners_a": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Visitante Vence"
    },
    "odd_corners_over75": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Over 7.5"
    },
    "odd_corners_under75": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Under 7.5"
    },
    "odd_corners_over85": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Over 8.5"
    },
    "odd_corners_under85": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Under 8.5"
    },
    "odd_corners_over95": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Over 9.5"
    },
    "odd_corners_under95": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Under 9.5"
    },
    "odd_corners_over105": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Over 10.5"
    },
    "odd_corners_under105": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Under 10.5"
    },
    "odd_corners_over115": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Over 11.5"
    },
    "odd_corners_under115": {
      "type": "number",
      "minimum": 0,
      "description": "Odd Escanteios Under 11.5"
    }
  },
  "required": [
    "league",
    "date",
    "time",
    "home",
    "away"
  ]
}