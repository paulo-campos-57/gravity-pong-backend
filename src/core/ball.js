const {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  BALL_SIZE,
  BALL_INITIAL_SPEED,
  BALL_SPEED_INCREMENT,
  BALL_MAX_SPEED,
  GRAVITY_WELL_STRENGTH,
  GRAVITY_RADIUS,
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

  update(paddle1, paddle2, stage = 1) {
    // ---- POWER-UPS / MODIFICADORES DA TORRE ----
    let gravityStrength = GRAVITY_WELL_STRENGTH;
    let maxSpeed = BALL_MAX_SPEED;
    let speedIncrement = BALL_SPEED_INCREMENT;

    if (stage === 2) {
      // Fase Amarela: Aceleração mais agressiva ao rebater
      speedIncrement = BALL_SPEED_INCREMENT * 2;
    } else if (stage === 3) {
      // Fase Vermelha: Anomalia Gravitacional (Buraco Negro muito mais forte)
      gravityStrength = GRAVITY_WELL_STRENGTH * 2.2;
    } else if (stage === 4) {
      // Fase Roxa (Boss): Velocidade limite insana + Alta gravidade
      maxSpeed = BALL_MAX_SPEED * 1.4;
      gravityStrength = GRAVITY_WELL_STRENGTH * 1.6;
    }

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const dx = centerX - this.x;
    const dy = centerY - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 20 && distance < GRAVITY_RADIUS) {
      const force = gravityStrength * ((GRAVITY_RADIUS - distance) / GRAVITY_RADIUS);
      this.vx += (dx / distance) * force;
      this.vy += (dy / distance) * force;
    }

    const MIN_X_SPEED = 3.5;
    if (Math.abs(this.vx) < MIN_X_SPEED) {
      this.vx = this.vx >= 0 ? MIN_X_SPEED : -MIN_X_SPEED;
    }

    const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (currentSpeed > maxSpeed) {
      this.vx = (this.vx / currentSpeed) * maxSpeed;
      this.vy = (this.vy / currentSpeed) * maxSpeed;
    }

    this.x += this.vx;
    this.y += this.vy;

    // Colisões com teto/chão
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
      this.vx = Math.abs(this.vx) + speedIncrement; 
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
      this.vx = -(Math.abs(this.vx) + speedIncrement);
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
    return { x: Math.round(this.x), y: Math.round(this.y), size: this.size };
  }
}

module.exports = Ball;