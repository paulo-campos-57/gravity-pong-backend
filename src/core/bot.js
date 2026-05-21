class Bot {
  constructor(paddle, ball) {
    this.paddle = paddle;
    this.ball = ball;
  }

  update() {
    const paddleCenter = this.paddle.y + this.paddle.height / 2;

    const deadzone = 15;

    if (this.ball.y < paddleCenter - deadzone) {
      this.paddle.setDirection('up');
    } else if (this.ball.y > paddleCenter + deadzone) {
      this.paddle.setDirection('down');
    } else {
      this.paddle.setDirection('stop');
    }
  }
}

module.exports = Bot;