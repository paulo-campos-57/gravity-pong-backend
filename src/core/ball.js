const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BALL_SIZE,
  BALL_INITIAL_SPEED,
  BALL_SPEED_INCREMENT,
  BALL_MAX_SPEED,
  GRAVITY_WELL_STRENGTH,
  PADDLE_WIDTH,
  PADDLE1_X,
  PADDLE2_X,
  PADDLE_HEIGHT,
} = require('./constants');

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = CANVAS_WIDTH / 2;
    this.y = CANVAS_HEIGHT / 2;
    this.size = BALL_SIZE;
    this.speed = BALL_INITIAL_SPEED;
    this.x_orientation = Math.random() < 0.5 ? 1 : -1;
    this.y_orientation = Math.random() < 0.5 ? 1 : -1;
    this.vx = this.speed * this.x_orientation;
    this.vy = this.speed * this.y_orientation;
  }

  update(paddle1, paddle2) {
    // ---- FÍSICA GRAVITY PONG (Buraco Negro no centro) ----
    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 20) { // Evita forças infinitas no centro exato
      const force = GRAVITY_WELL_STRENGTH / (distance * 0.05); // Suaviza a força
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    // Limite de velocidade para o jogo não quebrar
    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > BALL_MAX_SPEED) {
      this.vx = (this.vx / currentSpeed) * BALL_MAX_SPEED;
      this.vy = (this.vy / currentSpeed) * BALL_MAX_SPEED;
    }
    // -------------------------------------------------------

    this.x += this.vx;
    this.y += this.vy;

    // Colisão com teto e chão
    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    } else if (this.y + this.size >= CANVAS_HEIGHT) {
      this.y = CANVAS_HEIGHT - this.size;
      this.vy *= -1;
    }

    // Colisão Paddle 1
    if (
      this.x <= PADDLE1_X + PADDLE_WIDTH &&
      this.x >= PADDLE1_X &&
      this.y + this.size >= paddle1.y &&
      this.y <= paddle1.y + PADDLE_HEIGHT
    ) {
      this.x = PADDLE1_X + PADDLE_WIDTH;
      // Ao rebater, tira um pouco da influência gravitacional lateral forçando velocidade para frente
      this.vx = Math.abs(this.vx) + BALL_SPEED_INCREMENT; 
      this._adjustAngle(paddle1);
    }

    // Colisão Paddle 2
    if (
      this.x + this.size >= PADDLE2_X &&
      this.x + this.size <= PADDLE2_X + PADDLE_WIDTH &&
      this.y + this.size >= paddle2.y &&
      this.y <= paddle2.y + PADDLE_HEIGHT
    ) {
      this.x = PADDLE2_X - this.size;
      this.vx = -(Math.abs(this.vx) + BALL_SPEED_INCREMENT);
      this._adjustAngle(paddle2);
    }
  }

  _adjustAngle(paddle) {
    const paddleCenter = paddle.y + PADDLE_HEIGHT / 2;
    const ballCenter = this.y + this.size / 2;
    const diff = ballCenter - paddleCenter;
    this.vy = diff * 0.15;
  }

  checkScored() {
    if (this.x + this.size < 0) return 'player2';
    if (this.x > CANVAS_WIDTH) return 'player1';
    return null;
  }

  getState() {
    return {
      x: Math.round(this.x),
      y: Math.round(this.y),
      size: this.size,
    };
  }
}

module.exports = Ball;