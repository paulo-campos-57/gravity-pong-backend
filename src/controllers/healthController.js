const { getActiveGames } = require('../services/gameManager');

function getRoot(req, res) {
  res.send('Pong Multiplayer Server is running.');
}

function getHealth(req, res) {
  const activeGames = getActiveGames();
  res.json({
    status: 'ok',
    activeGames: activeGames.length,
    games: activeGames,
  });
}

module.exports = { getRoot, getHealth };