const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const paddleWidth = 10;
const paddleHeight = 100;
const ballRadius = 10;
const winningScore = 9;

let playerY = canvas.height / 2 - paddleHeight / 2;
let computerY = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 4;
let ballSpeedY = 4;

const playerSpeed = 6;
let playerMoveUp = false;
let playerMoveDown = false;

let playerScore = 0;
let computerScore = 0;
let gameStarted = false;
let gameOver = false;

// Sound effects
const hitSound = new Audio('hit.wav');
const missSound = new Audio('miss.wav');

function drawRect(x, y, width, height) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, width, height);
}

function drawCircle(x, y, radius) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2, false);
  ctx.closePath();
  ctx.fill();
}

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function movePaddles() {
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
      playerMoveUp = true;
    } else if (e.key === 'ArrowDown') {
      playerMoveDown = true;
    }
  });

  document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowUp') {
      playerMoveUp = false;
    } else if (e.key === 'ArrowDown') {
      playerMoveDown = false;
    }
  });

  if (playerMoveUp && playerY > 0) {
    playerY -= playerSpeed;
  } else if (playerMoveDown && playerY < canvas.height - paddleHeight) {
    playerY += playerSpeed;
  }
}

function moveBall() {
  if (!gameStarted) return;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballY + ballRadius > canvas.height || ballY - ballRadius < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (
    ballX + ballRadius > canvas.width - paddleWidth &&
    ballY > computerY &&
    ballY < computerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(hitSound);
  } else if (ballX + ballRadius > canvas.width) {
    computerScore++;
    playSound(missSound);
    reset();
  }

  if (
    ballX - ballRadius < paddleWidth &&
    ballY > playerY &&
    ballY < playerY + paddleHeight
  ) {
    ballSpeedX = -ballSpeedX;
    playSound(hitSound);
  } else if (ballX - ballRadius < 0) {
    playerScore++;
    playSound(missSound);
    reset();
  }
}

function moveComputerPaddle() {
  const computerSpeed = 3; // Reduced speed
  const reactionDelay = Math.random() * 0.2; // Random delay to reactions

  if (computerY + paddleHeight / 2 < ballY - reactionDelay) {
    computerY += computerSpeed;
  } else if (computerY + paddleHeight / 2 > ballY + reactionDelay) {
    computerY -= computerSpeed;
  }
}

function reset() {
  if (playerScore >= winningScore || computerScore >= winningScore) {
    gameOver = true;
    gameStarted = false;
    return;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 4;
  gameStarted = false;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawRect(0, playerY, paddleWidth, paddleHeight);
  drawRect(canvas.width - paddleWidth, computerY, paddleWidth, paddleHeight);
  drawCircle(ballX, ballY, ballRadius);

  // Updated scoreboard
  ctx.fillText(`Computer: ${computerScore}`, 10, 20);
  ctx.fillText(`Player: ${playerScore}`, 10, 40);

  if (gameOver) {
    ctx.fillStyle = '#ff0000';
    ctx.font = '50px Arial';
    ctx.fillText('Champion!', canvas.width / 2 - 100, canvas.height / 2);
  }
}

function gameLoop() {
  movePaddles();
  moveBall();
  moveComputerPaddle();
  draw();

  if (!gameStarted && !gameOver) {
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText(
      'Press Space to Start',
      canvas.width / 2 - 130,
      canvas.height / 2
    );
  }

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', function (e) {
  if (e.key === ' ' && !gameStarted && !gameOver) {
    gameStarted = true;
  }
});

gameLoop();
