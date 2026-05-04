const {
  CANVAS_HEIGHT,
  PADDLE_HEIGHT,
  PADDLE_WIDTH,
  PADDLE_SPEED,
} = require('./constants');

class Paddle {
  constructor(x) {
    this.x = x;
    this.y = (CANVAS_HEIGHT - PADDLE_HEIGHT) / 2;
    this.width = PADDLE_WIDTH;
    this.height = PADDLE_HEIGHT;
    this.speed = PADDLE_SPEED;
    this.direction = 'stop'; // 'up' | 'down' | 'stop'
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