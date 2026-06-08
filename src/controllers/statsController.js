const { getActiveGames } = require('../services/gameManager');

function getStats(req, res) {
  const activeGames = getActiveGames();
  res.json({
    totalActive: activeGames.length,
    games: activeGames,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getStats };