const {
  CANVAS_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_SPEED,
} = require('./constants');

/**
 * @swagger
 * components:
 *   schemas:
 *     Paddle:
 *       type: object
 *       properties:
 *         x:
 *           type: number
 *           description: Posição X fixa do paddle
 *         y:
 *           type: number
 *           description: Posição Y atual do paddle
 *         width:
 *           type: number
 *           description: Largura do paddle
 *         height:
 *           type: number
 *           description: Altura do paddle
 *         speed:
 *           type: number
 *           description: Velocidade base de movimento do paddle
 *         direction:
 *           type: string
 *           enum: [up, down, stop]
 *           description: Direção atual de movimento do paddle
 *     PaddleState:
 *       type: object
 *       properties:
 *         x:
 *           type: integer
 *           description: Posição X do paddle
 *         y:
 *           type: integer
 *           description: Posição Y arredondada do paddle
 *         width:
 *           type: integer
 *           description: Largura do paddle
 *         height:
 *           type: integer
 *           description: Altura do paddle
 */
class Paddle {
  constructor(x) {
    this.x = x;
    this.y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.speed = PADDLE_SPEED;
    this.direction = 'stop';
  }

  setDirection(direction) {
    this.direction = direction;
  }

  update() {
    if (this.direction === 'up') {
      this.y = Math.max(0, this.y - this.speed);
    } else if (this.direction === 'down') {
      this.y = Math.min(CANVAS_HEIGHT - this.height, this.y + this.speed);
    }
  }

  getState() {
    return {
      x: this.x,
      y: Math.round(this.y),
      width: this.width,
      height: this.height,
    };
  }
}

module.exports = Paddle;