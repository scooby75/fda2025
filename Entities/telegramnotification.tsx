{
  "name": "TelegramNotification",
  "type": "object",
  "properties": {
    "strategy_id": {
      "type": "string",
      "description": "Identificador único da estratégia de notificação"
    },
    "strategy_name": {
      "type": "string",
      "description": "Nome legível da estratégia"
    },
    "telegram_chat_id": {
      "type": "string",
      "description": "ID do destino das notificações no Telegram"
    },
    "is_active": {
      "type": "boolean",
      "default": true,
      "description": "Status de ativação da notificação"
    },
    "last_sent_date": {
      "type": "string",
      "format": "date-time",
      "description": "Data do último envio bem-sucedido"
    },
    "games_sent_count": {
      "type": "number",
      "minimum": 0,
      "default": 0,
      "description": "Total de notificações de jogos enviadas"
    },
    "bot_token": {
      "type": "string",
      "description": "Token do bot para envio dedicado (opcional)"
    },
    "fallback_email": {
      "type": "string",
      "format": "email",
      "description": "E-mail alternativo para fallback"
    },
    "notification_preferences": {
      "type": "object",
      "properties": {
        "send_warnings": {
          "type": "boolean",
          "default": true
        },
        "send_errors": {
          "type": "boolean",
          "default": true
        },
        "send_success": {
          "type": "boolean",
          "default": false
        }
      },
      "required": [
        "send_warnings",
        "send_errors",
        "send_success"
      ]
    },
    "sent_games": {
      "type": "array",
      "items": {
        "type": "object"
      },
      "description": "Lista de jogos enviados nesta notificação"
    }
  },
  "required": [
    "strategy_id",
    "strategy_name",
    "telegram_chat_id"
  ]
}