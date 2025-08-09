{
  "name": "CustomCompetition",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "description": "Nome da competição"
    },
    "sport": {
      "type": "string",
      "default": "Futebol",
      "description": "Esporte"
    },
    "country": {
      "type": "string",
      "description": "País da competição"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Se a competição está ativa"
    }
  },
  "required": [
    "name"
  ]
}