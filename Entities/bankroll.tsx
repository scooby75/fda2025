{
  "name": "Bankroll",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da banca"
    },
    "currency": {
      "type": "string",
      "enum": [
        "BRL",
        "USD",
        "EUR"
      ],
      "default": "BRL",
      "description": "Moeda da banca"
    },
    "initial_balance": {
      "type": "number",
      "description": "Saldo inicial da banca"
    },
    "current_balance": {
      "type": "number",
      "description": "Saldo atual da banca"
    },
    "start_date": {
      "type": "string",
      "format": "date",
      "description": "Data inicial da banca"
    },
    "commission_percentage": {
      "type": "number",
      "default": 0,
      "description": "Porcentagem de comissão"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se a banca está ativa"
    }
  },
  "required": [
    "name",
    "initial_balance",
    "start_date"
  ]
}