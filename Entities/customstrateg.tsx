{
  "name": "CustomStrategy",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da estratégia personalizada"
    },
    "description": {
      "type": "string",
      "description": "Descrição da estratégia"
    },
    "market": {
      "type": "string",
      "description": "Mercado principal"
    },
    "sport": {
      "type": "string",
      "default": "Futebol",
      "description": "Esporte"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se a estratégia está ativa"
    }
  },
  "required": [
    "name",
    "market"
  ]
}