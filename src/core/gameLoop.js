const Ball = require('./ball');
const Paddle = require('./paddle');
const Bot = require('./bot');
const { PADDLE1_X, PADDLE2_X, TICK_INTERVAL, DEFAULT_MAX_SCORE } = require('./constants');

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

    // Mapeamento de cores da torre MK de acordo com a dificuldade
    this.stage = players.player2?.stage || 1;
    const stageColors = {
      1: '#22c55e', // Verde (Fácil)
      2: '#eab308', // Amarelo (Médio)
      3: '#ef4444', // Vermelho (Difícil)
      4: '#a855f7'  // Roxo (Boss / Impossível)
    };
    this.enemyColor = stageColors[this.stage] || '#22c55e';

    this.bot = this.players.player2?.isBot ? new Bot(this.paddle2, this.ball, this.stage) : null;

    this.intervalId = null;
    this.running = false;
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
    if (this.bot) this.bot.update();

    this.paddle1.update();
    this.paddle2.update();
    
    // Repassa o nível atual da torre para ajustar a dinâmica da bola
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
      enemyColor: this.enemyColor, // Envia a cor dinâmica para renderização do canvas
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