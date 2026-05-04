const Ball = require('./Ball');
const Paddle = require('./Paddle');
const { PADDLE1_X, PADDLE2_X, TICK_INTERVAL, DEFAULT_MAX_SCORE } = require('./constants');

class GameLoop {
  constructor({ gameId, players, maxScore, onStateUpdate, onGameOver, onLog }) {
    this.gameId = gameId;
    this.players = players; // { player1: { socketId, name }, player2: { socketId, name } }
    this.maxScore = maxScore || DEFAULT_MAX_SCORE;
    this.onStateUpdate = onStateUpdate;
    this.onGameOver = onGameOver;
    this.onLog = onLog;

    this.scores = { player1: 0, player2: 0 };
    this.paddle1 = new Paddle(PADDLE1_X);
    this.paddle2 = new Paddle(PADDLE2_X);
    this.ball = new Ball();

    this.intervalId = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.onLog?.(`Partida ${this.gameId} iniciada!`);

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
    else if (role === 'player2') this.paddle2.setDirection(direction);
  }

  _tick() {
    this.paddle1.update();
    this.paddle2.update();
    this.ball.update(this.paddle1, this.paddle2);

    const scorer = this.ball.checkScored();
    if (scorer) {
      this.scores[scorer]++;
      this.onLog?.(`Ponto para ${scorer}! Placar: ${this.scores.player1} x ${this.scores.player2}`);

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
      scores: { ...this.scores },
      players: {
        player1: this.players.player1?.name || 'Player 1',
        player2: this.players.player2?.name || 'Player 2',
      },
    };
  }
}

module.exports = GameLoop;