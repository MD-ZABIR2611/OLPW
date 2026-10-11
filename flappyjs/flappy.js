// OLPW:flappyjs/flappy.js | script for flappy.html
(function() {
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');
  var gravity = 0.6;
  var lift = -10;
  var pipeSpeed = 3;
  var pipeGap = 120;
  var groundY = 500;
  var score = 0;
  var frame = 0;
  var gameOver = false;
  var bird = { x: 50, y: 200, vy: 0, alive: true };
  var pipes = [];

  function drawBird() {
    ctx.fillStyle = '#e91e63';
    ctx.fillRect(bird.x, bird.y, 40, 40);
  }

  function drawPipes() {
    pipes.forEach(function(p) {
      ctx.fillStyle = '#ff5722';
      ctx.fillRect(p.x, 0, 50, p.topHeight);
      ctx.fillRect(p.x, p.topHeight + pipeGap, 50, canvas.height - p.topHeight - pipeGap);
    });
  }

  function drawGround() {
    ctx.fillStyle = '#ffeb3b';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
  }

  function update() {
    if (!bird.alive) return;
    frame++;
    bird.vy += gravity;
    bird.y += bird.vy;
    if (frame % 90 === 0) {
      pipes.push({ x: 320, topHeight: Math.random() * (groundY - 150) + 20, passed: false });
    }
    pipes.forEach(function(p) {
      p.x -= pipeSpeed;
      if (!p.passed && p.x < 50) { p.passed = true; score++; }
      if (p.x + 50 < 0) pipes.shift();
      if (p.x < 80 && p.x > 30) {
        if (bird.y < p.topHeight || bird.y > p.topHeight + pipeGap) bird.alive = false;
      }
    });
    if (bird.y + 40 > groundY || bird.y < 0) bird.alive = false;
    if (!bird.alive) gameOver = true;
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGround();
    drawPipes();
    if (bird.alive) drawBird();
    // score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 40);
    if (gameOver) {
      ctx.fillText('Game Over - Final Score: ' + score, 80, 250);
    }
  }

  function loop() {
    update();
    draw();
    if (bird.alive && !gameOver) {
      requestAnimationFrame(loop);
    }
  }

  // event handlers
  canvas.addEventListener('click', function() {
    if (bird.alive) bird.vy = lift;
  });

  // start
  document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' || e.code === 'KeyE') {
      bird.alive = true;
      score = 0;
      pipes = [];
      bird.y = 200;
      bird.vy = 0;
      gameOver = false;
      loop();
    }
  });
})();