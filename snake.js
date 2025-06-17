let gameboard = document.getElementById("gamecanvas");
let ctx = gameboard.getContext("2d");
let scoretext = document.querySelector("#score");
let reset = document.querySelector("#resetbtn");
let gameheight = gameboard.height;
let gamewidth = gameboard.width;
let boardbackground = "rgba(26, 26, 46, 0.9)";
let snakecolor = "#4ecdc4";
let snakeborder = "#45b7d1";
let foodcolor = "#ff6b6b";
let unitsize = 20;
let running = false;
let xVelocity = unitsize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
  { x: unitsize * 5, y: 0 },
  { x: unitsize * 4, y: 0 },
  { x: unitsize * 3, y: 0 },
  { x: unitsize * 2, y: 0 },
  { x: unitsize, y: 0 },
  { x: 0, y: 0 },
];

// Touch/Swipe handling for mobile
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

gameboard.addEventListener('touchstart', handleTouchStart, false);
gameboard.addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
  event.preventDefault();
  const firstTouch = event.touches[0];
  touchStartX = firstTouch.clientX;
  touchStartY = firstTouch.clientY;
}

function handleTouchEnd(event) {
  event.preventDefault();
  if (!touchStartX || !touchStartY) return;

  touchEndX = event.changedTouches[0].clientX;
  touchEndY = event.changedTouches[0].clientY;

  handleSwipe();
}

function handleSwipe() {
  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;
  const minSwipeDistance = 30;

  if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
      return;
  }

  let goingup = yVelocity == -unitsize;
  let goingdown = yVelocity == unitsize;
  let goingright = xVelocity == unitsize;
  let goingleft = xVelocity == -unitsize;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (deltaX > 0 && !goingleft) {
          // Swipe right
          xVelocity = unitsize;
          yVelocity = 0;
      } else if (deltaX < 0 && !goingright) {
          // Swipe left
          xVelocity = -unitsize;
          yVelocity = 0;
      }
  } else {
      // Vertical swipe
      if (deltaY > 0 && !goingup) {
          // Swipe down
          xVelocity = 0;
          yVelocity = unitsize;
      } else if (deltaY < 0 && !goingdown) {
          // Swipe up
          xVelocity = 0;
          yVelocity = -unitsize;
      }
  }

  touchStartX = 0;
  touchStartY = 0;
  touchEndX = 0;
  touchEndY = 0;
}

window.addEventListener("keydown", changedirection);
reset.addEventListener("click", resetgame);

gamestart();

function gamestart() {
  running = true;
  createfood();
  drawfood();
  nexttick();
  drawsnake();
}

function nexttick() {
  if (running) {
      let timeout = Math.max(50, 150 - score * 5);
      setTimeout(() => {
          clearboard();
          drawfood();
          movesnake();
          drawsnake();
          checkgameover();
          nexttick();
      }, timeout);
  } else {
      displaygameover();
  }
}

function clearboard() {
  ctx.fillStyle = boardbackground;
  ctx.fillRect(0, 0, gamewidth, gameheight);
}

function createfood() {
  function randomfood(min, max) {
      let randomnum = Math.floor((Math.random() * (max - min) + min) / unitsize) * unitsize;
      return randomnum;
  }
  
  // Make sure food doesn't spawn on snake
  do {
      foodX = randomfood(0, gamewidth - unitsize);
      foodY = randomfood(0, gameheight - unitsize);
  } while (snake.some(segment => segment.x === foodX && segment.y === foodY));
}

function drawfood() {
  // Draw food with glow effect
  ctx.shadowColor = foodcolor;
  ctx.shadowBlur = 10;
  ctx.fillStyle = foodcolor;
  ctx.fillRect(foodX, foodY, unitsize, unitsize);
  ctx.shadowBlur = 0;
}

function movesnake() {
  let head = { x: snake[0].x + xVelocity, y: snake[0].y + yVelocity };
  snake.unshift(head);
  
  if (snake[0].x == foodX && snake[0].y == foodY) {
      score += 1;
      scoretext.textContent = score;
      createfood();
  } else {
      snake.pop();
  }
}

function drawsnake() {
  snake.forEach((snakePart, index) => {
      // Head gets special treatment
      if (index === 0) {
          ctx.shadowColor = snakecolor;
          ctx.shadowBlur = 15;
          ctx.fillStyle = snakecolor;
      } else {
          ctx.shadowBlur = 5;
          ctx.fillStyle = `rgba(78, 205, 196, ${0.8 - index * 0.1})`;
      }
      
      ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
      ctx.strokeStyle = snakeborder;
      ctx.lineWidth = 2;
      ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
  });
  ctx.shadowBlur = 0;
}

function changedirection(event) {
  let keypressed = event.keyCode;
  
  // Numpad keys
  let Left = 100, Up = 104, Right = 102, Down = 101;
  // Arrow keys
  let left = 37, up = 38, right = 39, down = 40;
  // WASD keys
  let A = 65, W = 87, D = 68, S = 83;

  let goingup = yVelocity == -unitsize;
  let goingdown = yVelocity == unitsize;
  let goingright = xVelocity == unitsize;
  let goingleft = xVelocity == -unitsize;

  // Handle all key types in one switch
  switch (keypressed) {
      case Left:
      case left:
      case A:
          if (!goingright) {
              xVelocity = -unitsize;
              yVelocity = 0;
          }
          break;
      case Up:
      case up:
      case W:
          if (!goingdown) {
              xVelocity = 0;
              yVelocity = -unitsize;
          }
          break;
      case Right:
      case right:
      case D:
          if (!goingleft) {
              xVelocity = unitsize;
              yVelocity = 0;
          }
          break;
      case Down:
      case down:
      case S:
          if (!goingup) {
              xVelocity = 0;
              yVelocity = unitsize;
          }
          break;
  }
}

function checkgameover() {
  // Check wall collision
  if (snake[0].x < 0 || snake[0].x >= gamewidth || 
      snake[0].y < 0 || snake[0].y >= gameheight) {
      running = false;
      return;
  }
  
  // Check self collision
  for (let i = 1; i < snake.length; i++) {
      if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
          running = false;
          return;
      }
  }
}

function displaygameover() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
  ctx.fillRect(0, 0, gamewidth, gameheight);
  
  ctx.font = "bold 40px Orbitron";
  ctx.fillStyle = "#ff6b6b";
  ctx.textAlign = "center";
  ctx.shadowColor = "#ff6b6b";
  ctx.shadowBlur = 20;
  ctx.fillText("GAME OVER", gamewidth/2, gameheight/2 - 40);
  
  ctx.font = "20px Orbitron";
  ctx.fillStyle = "#4ecdc4";
  ctx.shadowColor = "#4ecdc4";
  ctx.shadowBlur = 10;
  ctx.fillText(`Final Score: ${score}`, gamewidth/2, gameheight/2 + 20);
  
  ctx.font = "16px Orbitron";
  ctx.fillStyle = "white";
  ctx.shadowBlur = 5;
  ctx.fillText("Click RESET to play again", gamewidth/2, gameheight/2 + 60);
  
  ctx.shadowBlur = 0;
}

function resetgame() {
  score = 0;
  xVelocity = unitsize;
  yVelocity = 0;
  snake = [
      { x: unitsize * 5, y: 0 },
      { x: unitsize * 4, y: 0 },
      { x: unitsize * 3, y: 0 },
      { x: unitsize * 2, y: 0 },
      { x: unitsize, y: 0 },
      { x: 0, y: 0 },
  ];
  scoretext.textContent = score;
  gamestart();
}

// Prevent scrolling on mobile when playing
document.body.addEventListener('touchstart', function(e) {
  if (e.target == gameboard) {
      e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener('touchend', function(e) {
  if (e.target == gameboard) {
      e.preventDefault();
  }
}, { passive: false });

document.body.addEventListener('touchmove', function(e) {
  if (e.target == gameboard) {
      e.preventDefault();
  }
}, { passive: false });
