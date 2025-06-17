let gameboard = document.getElementById("gamecanvas");
let ctx = gameboard.getContext("2d");
let scoretext = document.querySelector("#score");
let reset = document.querySelector("#resetbtn");
let gameheight = gameboard.height;
let gamewidth = gameboard.width;
let boardbackground = "white";
let snakecolor = "green";
let snakeborder = "black";
let foodcolor = "red";
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
    let timeout = 70 - score *2;
    setTimeout(() => {
      clearborad();
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
function clearborad() {
  ctx.fillStyle = boardbackground;
  ctx.fillRect(0, 0, gamewidth, gameheight);
}
function createfood() {
  function randomfood(min, max) {
    let randomnum =
      Math.floor((Math.random() * (max - min) + min) / unitsize) * unitsize;
    return randomnum;
  }
  foodX = randomfood(0, gamewidth - unitsize);
  foodY = randomfood(0, gamewidth - unitsize);
  // console.log(foodX);
  // console.log(foodY);
}
function drawfood() {
  ctx.fillStyle = foodcolor;
  ctx.fillRect(foodX, foodY, unitsize, unitsize);
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
  ctx.fillStyle = snakecolor;
  ctx.strokeStyle = snakeborder;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitsize, unitsize);
    ctx.strokeRect(snakePart.x, snakePart.y, unitsize, unitsize);
  });
}
function changedirection(event) {
  let keypressed = event.keyCode;
  console.log(keypressed);
  let Left = 100;
  let Up = 104;
  let Right = 102;
  let Down = 101;

  let left = 37;
  let up = 38;
  let right = 39;
  let down = 40;

  let A = 65;
  let W = 87;
  let D = 68;
  let S = 83;

  let goingup = yVelocity == -unitsize;
  let goingdown = yVelocity == unitsize;
  let goingright = xVelocity == unitsize;
  let goingleft = xVelocity == -unitsize;

  switch (true) {
    case keypressed == Left && !goingright:
      xVelocity = -unitsize;
      yVelocity = 0;
      break;
    case keypressed == Up && !goingdown:
      xVelocity = 0;
      yVelocity = -unitsize;
      break;
    case keypressed == Right && !goingleft:
      xVelocity = unitsize;
      yVelocity = 0;
      break;
    case keypressed == Down && !goingup:
      xVelocity = 0;
      yVelocity = unitsize;
      break;
  }
  switch (true) {
    case keypressed == left && !goingright:
      xVelocity = -unitsize;
      yVelocity = 0;
      break;
    case keypressed == up && !goingdown:
      xVelocity = 0;
      yVelocity = -unitsize;
      break;
    case keypressed == right && !goingleft:
      xVelocity = unitsize;
      yVelocity = 0;
      break;
    case keypressed == down && !goingup:
      xVelocity = 0;
      yVelocity = unitsize;
      break;
  }
  switch (true) {
    case keypressed == A && !goingright:
      xVelocity = -unitsize;
      yVelocity = 0;
      break;
    case keypressed == W && !goingdown:
      xVelocity = 0;
      yVelocity = -unitsize;
      break;
    case keypressed == D && !goingleft:
      xVelocity = unitsize;
      yVelocity = 0;
      break;
    case keypressed == S && !goingup:
      xVelocity = 0;
      yVelocity = unitsize;
      break;
  }
}
function checkgameover() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gamewidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameheight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}
function displaygameover() {
  ctx.font = "50px Permanent Marker";
  ctx.fillStyle = "black";
  ctx.textAlight = "center";
  ctx.fillText("Game Over!!!", 150, 300);
}
function resetgame() {
  reset = 13;
  score = 0;
  xVelocity = unitsize;
  yVelocity = 0;
  snake = [
    { x: unitsize * 4, y: 0 },
    { x: unitsize * 3, y: 0 },
    { x: unitsize * 2, y: 0 },
    { x: unitsize, y: 0 },
    { x: 0, y: 0 },
  ];
  scoretext.textContent = score;
  running = true;
  gamestart();
}
