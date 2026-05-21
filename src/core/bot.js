const { CANVAS_HEIGHT } = require('./constants');

class Bot {
  constructor(paddle, ball) {
    this.paddle = paddle;
    this.ball = ball;
  }

  update() {
    const paddleCenter = this.paddle.y + this.paddle.height / 2;
    
    // Pequena margem de erro (o bot só se move se a bola estiver a uma certa distância)
    const deadzone = 15; 

    // O bot tenta acompanhar o eixo Y da bola
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