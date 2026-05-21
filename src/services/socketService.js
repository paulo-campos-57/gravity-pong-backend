const { Server } = require('socket.io');
const { socketCorsOptions } = require('../config/corsConfig');
const { validateCreateGame, validateJoinGame, validateMovePaddle } = require('../middlewares/validateMiddleware');
const gameManager = require('./gameManager');

let io;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: socketCorsOptions,
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Conectado: ${socket.id}`);

    // Criação Multiplayer Normal
    socket.on('create_game', (data) => {
      const error = validateCreateGame(data);
      if (error) {
        socket.emit('game_error', error);
        return;
      }
      const { playerName, maxScore } = data;
      const gameId = gameManager.createGame({ socketId: socket.id, playerName, maxScore });

      socket.join(gameId);
      socket.emit('game_created', { gameId, playerRole: 'player1' });
      socket.emit('game_log', `Partida criada! Aguardando oponente... Código: ${gameId}`);
    });

    // NOVO: Criação Single Player (Vs Bot)
    socket.on('create_single_player', (data) => {
      const error = validateCreateGame(data);
      if (error) {
        socket.emit('game_error', error);
        return;
      }
      const { playerName, maxScore } = data;
      
      const gameId = gameManager.createSinglePlayerGame(
        { socketId: socket.id, playerName, maxScore },
        {
          onStateUpdate: (state) => io.to(gameId).emit('game_state', state),
          onGameOver: ({ winner, scores }) => {
            io.to(gameId).emit('game_over', { winner, scores });
            io.to(gameId).emit('game_log', `Fim de jogo! Vencedor: ${winner}`);
          },
          onLog: (msg) => io.to(gameId).emit('game_log', msg),
        }
      );

      socket.join(gameId);
      socket.emit('game_created', { gameId, playerRole: 'player1' });
      socket.emit('game_joined', { gameId, playerRole: 'player1' }); // Força início no frontend
      io.to(gameId).emit('game_log', `Partida Single Player iniciada! Enfrente a CPU.`);
    });

    socket.on('join_game', (data) => {
      //... (O código original do join_game continua inalterado)
      const error = validateJoinGame(data);
      if (error) {
        socket.emit('game_error', error);
        return;
      }

      const { playerName, gameId } = data;
      const result = gameManager.joinGame(
        { socketId: socket.id, playerName, gameId },
        {
          onStateUpdate: (state) => io.to(gameId).emit('game_state', state),
          onGameOver: ({ winner, scores }) => {
            io.to(gameId).emit('game_over', { winner, scores });
            io.to(gameId).emit('game_log', `Fim de jogo! Vencedor: ${winner}`);
          },
          onLog: (msg) => io.to(gameId).emit('game_log', msg),
        }
      );

      if (!result.success) {
        socket.emit('game_error', result.error);
        return;
      }

      socket.join(gameId);
      socket.emit('game_joined', { gameId, playerRole: result.role });
      io.to(gameId).emit('game_log', `${playerName} entrou na partida! O jogo vai começar.`);
    });

    socket.on('move_paddle', (data) => {
      const error = validateMovePaddle(data);
      if (error) {
        socket.emit('game_error', error);
        return;
      }
      const { gameId, direction } = data;
      gameManager.movePaddle({ gameId, socketId: socket.id, direction });
    });

    socket.on('disconnect', () => {
      gameManager.handleDisconnect(socket.id);
    });
  });

  return io;
}

function getIo() {
  if (!io) throw new Error('Socket.IO não foi inicializado.');
  return io;
}

module.exports = { initSocket, getIo };