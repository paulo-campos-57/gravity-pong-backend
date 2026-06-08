const { Server } = require('socket.io');
const { socketCorsOptions } = require('../config/corsConfig');
const { validateCreateGame, validateJoinGame, validateMovePaddle } = require('../middlewares/validateMiddleware');
const gameManager = require('./gameManager');

/**
 * @swagger
 * components:
 *   schemas:
 *     SocketCreateGamePayload:
 *       type: object
 *       required:
 *         - playerName
 *       properties:
 *         playerName:
 *           type: string
 *           description: Nome do criador do jogo
 *         maxScore:
 *           type: integer
 *           description: Pontuação limite da partida (padrão é 5)
 *     SocketCreateSinglePlayerPayload:
 *       type: object
 *       required:
 *         - playerName
 *       properties:
 *         playerName:
 *           type: string
 *           description: Nome do jogador
 *         maxScore:
 *           type: integer
 *           description: Pontuação limite da partida (padrão é 5)
 *         stage:
 *           type: integer
 *           description: Fase inicial do bot de 1 (Fácil) a 4 (Boss)
 *     SocketJoinGamePayload:
 *       type: object
 *       required:
 *         - playerName
 *         - gameId
 *       properties:
 *         playerName:
 *           type: string
 *           description: Nome do jogador que quer se juntar
 *         gameId:
 *           type: string
 *           description: ID da partida que deseja entrar
 *     SocketMovePaddlePayload:
 *       type: object
 *       required:
 *         - gameId
 *         - direction
 *       properties:
 *         gameId:
 *           type: string
 *           description: ID da partida ativa
 *         direction:
 *           type: string
 *           enum: [up, down, stop]
 *           description: Direção de movimento do paddle do jogador
 *     SocketGameCreatedResponse:
 *       type: object
 *       properties:
 *         gameId:
 *           type: string
 *           description: ID da partida criada
 *         playerRole:
 *           type: string
 *           enum: [player1, player2]
 *           description: Papel atribuído ao criador (geralmente player1)
 *     SocketGameJoinedResponse:
 *       type: object
 *       properties:
 *         gameId:
 *           type: string
 *           description: ID da partida em que o jogador entrou
 *         playerRole:
 *           type: string
 *           enum: [player1, player2]
 *           description: Papel atribuído ao jogador
 *     SocketGameErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensagem descritiva do erro ocorrido
 */

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
      const { playerName, maxScore, stage } = data; // Extrai a fase enviada
      
      const gameId = gameManager.createSinglePlayerGame(
        { socketId: socket.id, playerName, maxScore, stage: stage || 1 },
        {
          onStateUpdate: (state) => io.to(gameId).emit('game_state', state),
          onGameOver: ({ winner, scores }) => {
            io.to(gameId).emit('game_over', { winner, scores });
          },
          onLog: (msg) => io.to(gameId).emit('game_log', msg),
        }
      );

      socket.join(gameId);
      socket.emit('game_created', { gameId, playerRole: 'player1' });
      socket.emit('game_joined', { gameId, playerRole: 'player1' });
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