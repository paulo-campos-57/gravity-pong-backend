/**
 * @swagger
 * components:
 *   schemas:
 *     Bot:
 *       type: object
 *       properties:
 *         deadzone:
 *           type: number
 *           description: Margem de erro de reação (reduz com a dificuldade da fase)
 *         speedModifier:
 *           type: number
 *           description: Multiplicador de velocidade para acompanhar bolas mais rápidas
 *         stage:
 *           type: integer
 *           description: Nível de dificuldade da fase do bot (1 a 4)
 */
class Bot {
  constructor(paddle, ball, stage = 1) {
    this.paddle = paddle;
    this.ball = ball;
    this.stage = stage;

    // DIFICULDADE GRADUAL:
    // Reduz a deadzone (margem de erro de reação) a cada nível
    this.deadzone = Math.max(2, 20 - stage * 4.5); 
    
    // Multiplicador de velocidade para acompanhar bolas mais velozes
    this.speedModifier = 0.7 + stage * 0.2; 
  }

  update() {
    const paddleCenter = this.paddle.y + this.paddle.height / 2;
    
    // O bot foca no eixo Y central da bolinha
    if (this.ball.y < paddleCenter - this.deadzone) {
      this.paddle.setDirection('up');
      this.paddle.speed = 6 * this.speedModifier;
    } else if (this.ball.y > paddleCenter + this.deadzone) {
      this.paddle.setDirection('down');
      this.paddle.speed = 6 * this.speedModifier;
    } else {
      this.paddle.setDirection('stop');
    }
  }
}

module.exports = Bot;