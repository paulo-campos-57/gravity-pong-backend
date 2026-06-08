const Ball = require('./ball');
const Paddle = require('./paddle');
const Bot = require('./bot');
const { PADDLE1_X, PADDLE2_X, TICK_INTERVAL, DEFAULT_MAX_SCORE } = require('./constants');

/**
 * @swagger
 * components:
 *   schemas:
 *     GameState:
 *       type: object
 *       properties:
 *         ball:
 *           $ref: '#/components/schemas/BallState'
 *           description: Estado atual da bola
 *         paddle1:
 *           $ref: '#/components/schemas/PaddleState'
 *           description: Estado do paddle do jogador 1
 *         paddle2:
 *           $ref: '#/components/schemas/PaddleState'
 *           description: Estado do paddle do jogador 2
 *         enemyColor:
 *           type: string
 *           description: Cor da torre (fase atual da partida)
 *         stage:
 *           type: integer
 *           description: Dificuldade/fase atual da partida (1 a 4)
 *         scores:
 *           type: object
 *           properties:
 *             player1:
 *               type: integer
 *               description: Pontuação do jogador 1
 *             player2:
 *               type: integer
 *               description: Pontuação do jogador 2
 *         players:
 *           type: object
 *           properties:
 *             player1:
 *               type: string
 *               description: Nome do jogador 1
 *             player2:
 *               type: string
 *               description: Nome do jogador 2
 *     GameConfig:
 *       type: object
 *       properties:
 *         gameId:
 *           type: string
 *           description: Identificador único da partida
 *         maxScore:
 *           type: integer
 *           description: Pontuação máxima para vencer a partida
 *         stage:
 *           type: integer
 *           description: Fase inicial da partida (1 a 4)
 */
class GameLoop {
  constructor({ gameId, players, maxScore, onStateUpdate, onGameOver, onLog }) {
    this.gameId = gameId;
    this.players = players;
    this.maxScore = maxScore || DEFAULT_MAX_SCORE;
    this.onStateUpdate = onStateUpdate;
    this.onGameOver = onGameOver;
    this.onLog = onLog;

    this.scores = { player1: 0, player2: 0 };
    this.paddle1 = new Paddle(PADDLE1_X);
    this.paddle2 = new Paddle(PADDLE2_X);
    this.ball = new Ball();

    this.stage = players.player2?.stage || 1;
    const stageColors = {
      1: '#22c55e',
      2: '#eab308',
      3: '#ef4444',
      4: '#a855f7'
    };
    this.enemyColor = stageColors[this.stage] || '#22c55e';

    this.bot = this.players.player2?.isBot ? new Bot(this.paddle2, this.ball, this.stage) : null;

    this.intervalId = null;
    this.running = false;
    this.isPaused = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.intervalId = setInterval(() => this._tick(), TICK_INTERVAL);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.running = false;
  }

  movePaddle(role, direction) {
    if (role === 'player1') this.paddle1.setDirection(direction);
    else if (role === 'player2' && !this.bot) this.paddle2.setDirection(direction);
  }

  _tick() {
    if (this.isPaused) return;
    
    if (this.bot) this.bot.update();

    this.paddle1.update();
    this.paddle2.update();
    
    this.ball.update(this.paddle1, this.paddle2, this.stage);

    const scorer = this.ball.checkScored();
    if (scorer) {
      this.scores[scorer]++;
      if (this.scores[scorer] >= this.maxScore) {
        this.stop();
        const winnerName = this.players[scorer]?.name || scorer;
        this.onGameOver?.({ winner: winnerName, scores: this.scores });
        return;
      }
      this.ball.reset();
    }

    this.onStateUpdate?.(this._buildState());
  }

  _buildState() {
    return {
      ball: this.ball.getState(),
      paddle1: this.paddle1.getState(),
      paddle2: this.paddle2.getState(),
      enemyColor: this.enemyColor,
      stage: this.stage,
      scores: { ...this.scores },
      players: {
        player1: this.players.player1?.name || 'Player 1',
        player2: this.players.player2?.name || 'Player 2',
      },
    };
  }
}

module.exports = GameLoop;