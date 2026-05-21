const GameLoop = require('../core/gameLoop');

const games = new Map();
let gameCounter = 0;

function generateGameId() {
  gameCounter++;
  return `G${gameCounter}`;
}

function createGame({ socketId, playerName, maxScore }) {
  const gameId = generateGameId();
  games.set(gameId, {
    gameId,
    status: 'waiting',
    maxScore,
    players: {
      player1: { socketId, name: playerName },
      player2: null,
    },
    loop: null,
  });
  return gameId;
}

// NOVA FUNÇÃO: Cria a partida e já inicia com o bot
function createSinglePlayerGame({ socketId, playerName, maxScore }, callbacks) {
  const gameId = generateGameId();
  games.set(gameId, {
    gameId,
    status: 'playing',
    maxScore,
    players: {
      player1: { socketId, name: playerName },
      player2: { socketId: 'cpu_bot', name: 'CPU (Bot)', isBot: true },
    },
    loop: null,
  });

  const game = games.get(gameId);

  game.loop = new GameLoop({
    gameId,
    players: game.players,
    maxScore: game.maxScore,
    onStateUpdate: callbacks.onStateUpdate,
    onGameOver: (result) => {
      game.status = 'finished';
      callbacks.onGameOver?.(result);
    },
    onLog: callbacks.onLog,
  });

  game.loop.start();
  return gameId;
}

function joinGame({ socketId, playerName, gameId }, callbacks) {
  const game = games.get(gameId);
  if (!game) return { success: false, error: 'Partida não encontrada.' };
  if (game.status !== 'waiting') return { success: false, error: 'Partida já em andamento ou encerrada.' };
  if (game.players.player2) return { success: false, error: 'Partida cheia.' };

  game.players.player2 = { socketId, name: playerName, isBot: false };
  game.status = 'playing';

  game.loop = new GameLoop({
    gameId,
    players: game.players,
    maxScore: game.maxScore,
    onStateUpdate: callbacks.onStateUpdate,
    onGameOver: (result) => {
      game.status = 'finished';
      callbacks.onGameOver?.(result);
    },
    onLog: callbacks.onLog,
  });

  game.loop.start();
  return { success: true, role: 'player2' };
}

function movePaddle({ gameId, socketId, direction }) {
  const game = games.get(gameId);
  if (!game || game.status !== 'playing') return;

  let role = null;
  if (game.players.player1?.socketId === socketId) role = 'player1';
  else if (game.players.player2?.socketId === socketId) role = 'player2';

  if (role) game.loop.movePaddle(role, direction);
}

function handleDisconnect(socketId) {
  for (const [gameId, game] of games.entries()) {
    const inGame =
      game.players.player1?.socketId === socketId ||
      game.players.player2?.socketId === socketId;

    if (inGame) {
      game.loop?.stop();
      game.status = 'finished';
      games.delete(gameId);
    }
  }
}

function getActiveGames() {
  const activeIds = [];
  for (const [gameId, game] of games.entries()) {
    if (game.status === 'playing' || game.status === 'waiting') {
      activeIds.push(gameId);
    }
  }
  return activeIds;
}

function getRoleInGame(gameId, socketId) {
  const game = games.get(gameId);
  if (!game) return null;
  if (game.players.player1?.socketId === socketId) return 'player1';
  if (game.players.player2?.socketId === socketId) return 'player2';
  return null;
}

module.exports = {
  createGame,
  createSinglePlayerGame,
  joinGame,
  movePaddle,
  handleDisconnect,
  getActiveGames,
  getRoleInGame,
};