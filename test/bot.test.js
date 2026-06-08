const Bot = require('../src/core/bot');
const Paddle = require('../src/core/paddle');
const Ball = require('../src/core/ball');

describe('Bot AI', () => {
  it('should move up if ball is above paddle', () => {
    const paddle = new Paddle(100);
    const ball = new Ball();
    
    // Bola bem acima do paddle
    ball.y = 10;
    paddle.y = 100;
    
    const bot = new Bot(paddle, ball);
    bot.update();
    
    expect(paddle.direction).toBe('up');
  });

  it('should move down if ball is below paddle', () => {
    const paddle = new Paddle(100);
    const ball = new Ball();
    
    // Bola bem abaixo do paddle
    ball.y = 200;
    paddle.y = 10;
    
    const bot = new Bot(paddle, ball);
    bot.update();
    
    expect(paddle.direction).toBe('down');
  });
});