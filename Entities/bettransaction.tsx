{
  "name": "BetTransaction",
  "type": "object",
  "properties": {
    "bankroll_id": {
      "type": "string",
      "description": "ID da banca"
    },
    "event_name": {
      "type": "string",
      "description": "Nome do evento/jogo"
    },
    "event_date": {
      "type": "string",
      "format": "date",
      "description": "Data do evento"
    },
    "sport": {
      "type": "string",
      "default": "Futebol",
      "description": "Esporte"
    },
    "competition": {
      "type": "string",
      "description": "Competição/Liga"
    },
    "strategy_name": {
      "type": "string",
      "description": "Nome da estratégia"
    },
    "market": {
      "type": "string",
      "description": "Mercado da aposta"
    },
    "stake": {
      "type": "number",
      "description": "Valor apostado"
    },
    "odds": {
      "type": "number",
      "description": "Odd da aposta"
    },
    "result": {
      "type": "string",
      "enum": [
        "pending",
        "win",
        "loss",
        "void"
      ],
      "default": "pending",
      "description": "Resultado da aposta"
    },
    "profit": {
      "type": "number",
      "default": 0,
      "description": "Lucro/Prejuízo"
    },
    "description": {
      "type": "string",
      "description": "Descrição da aposta"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "description": "Tags da aposta"
    },
    "is_pending": {
      "type": "boolean",
      "default": false,
      "description": "Se a aposta está pendente"
    }
  },
  "required": [
    "bankroll_id",
    "event_name",
    "stake",
    "odds"
  ]
}