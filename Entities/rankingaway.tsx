{
  "name": "RankingAway",
  "type": "object",
  "properties": {
    "league": {
      "type": "string"
    },
    "season": {
      "type": "string"
    },
    "away": {
      "type": "string"
    },
    "draw": {
      "type": "number"
    },
    "loss": {
      "type": "number"
    },
    "win": {
      "type": "number"
    },
    "points_away": {
      "type": "number"
    },
    "goal_difference_away": {
      "type": "number"
    },
    "ranking_away": {
      "type": "number"
    }
  },
  "required": [
    "league",
    "season",
    "away"
  ]
}