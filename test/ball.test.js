const Ball = require('../src/core/ball');
const Paddle = require('../src/core/paddle');
const { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE1_X, PADDLE2_X } = require('../src/core/constants');

describe('Ball Physics with Gravity', () => {
  it('should reset to center', () => {
    const ball = new Ball();
    expect(ball.x).toBe(CANVAS_WIDTH / 2);
    expect(ball.y).toBe(CANVAS_HEIGHT / 2);
  });

  it('should bounce off the top and bottom walls', () => {
    const ball = new Ball();
    const paddle1 = new Paddle(PADDLE1_X);
    const paddle2 = new Paddle(PADDLE2_X);

    ball.y = 1;
    ball.vy = -5; // Indo para cima
    ball.update(paddle1, paddle2); // Vai passar do limite <= 0
    
    expect(ball.y).toBe(0);
    expect(ball.vy).toBeGreaterThan(0); // Deve ser positivo agora (indo para baixo)
  });
});