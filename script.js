// Main Variables
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const divElem = document.getElementById("btn-wrapper");
const buttonElem = document.getElementById("play-btn");
const colors = {
  snakeFill: "hsla(114, 80%, 60%, 1)",
  snakeOutline: "hsla(114, 80%, 20%, 1)",
  appleFill: "hsla(0, 80%, 60%, 1)",
  appleOutline: "hsla(0, 80%, 20%, 1)",
  gameFill: "hsla(0, 0%, 100%, 1)",
  gameOutline: "hsla(0, 0%, 0%, 1)",
  speedupFill: "hsla(240, 80%, 60%, 1)",
  speedupOutline: "hsla(240, 80%, 20%, 1)",
  slowdownFill: "hsla(60, 80%, 60%, 1)",
  slowdownOutline: "hsla(60, 80%, 20%, 1)",
  doublePointsFill: "hsla(330, 80%, 60%, 1)",
  doublePointsOutline: "hsla(330, 80%, 20%, 1)"
}
let speed = 100;
let snake = [{
    x: 150,
    y: 150
  },
  {
    x: 140,
    y: 150
  },
  {
    x: 130,
    y: 150
  },
  {
    x: 120,
    y: 150
  },
  {
    x: 110,
    y: 150
  }
]
let scoreNum = 0;
let highScoreNum = 0;
let score = document.querySelector("#score");
let highScore = document.querySelector("#high-score");
let turning = false;
let points = 5;
let key, key1, key2, key3;
let apple = {
  x: 0,
  y: 0
}
let speedup = {
  x: 0,
  y: 0
}
let slowdown = {
  x: 0,
  y: 0
}
let doublePoints = {
  x: 0,
  y: 0
}
let velocity = {
  x: 10,
  y: 0
}
document.addEventListener('keydown', turn);
buttonElem.addEventListener("click", start);
// Helper Functions
function resetDisplay() {
  ctx.strokeStyle = colors.gameOutline;
  ctx.fillStyle = colors.gameFill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}
resetDisplay();

function showApple() {
  ctx.strokeStyle = colors.appleOutline;
  ctx.fillStyle = colors.appleFill;
  ctx.fillRect(apple.x, apple.y, 10, 10);
  ctx.strokeRect(apple.x, apple.y, 10, 10);
}

function showSpeedup() {
  ctx.strokeStyle = colors.speedupOutline;
  ctx.fillStyle = colors.speedupFill;
  ctx.fillRect(speedup.x, speedup.y, 10, 10);
  ctx.strokeRect(speedup.x, speedup.y, 10, 10);
}

function showSlowdown() {
  ctx.strokeStyle = colors.slowdownOutline;
  ctx.fillStyle = colors.slowdownFill;
  ctx.fillRect(slowdown.x, slowdown.y, 10, 10);
  ctx.strokeRect(slowdown.x, slowdown.y, 10, 10);
}

function showDoublePoints() {
  ctx.strokeStyle = colors.doublePointsOutline;
  ctx.fillStyle = colors.doublePointsFill;
  ctx.fillRect(doublePoints.x, doublePoints.y, 10, 10);
  ctx.strokeRect(doublePoints.x, doublePoints.y, 10, 10);
}

function snakeMove() {
  let head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y
  }
  snake.unshift(head);
  let ateFood = (snake[0].x === apple.x && snake[0].y === apple.y) ? true : false;
  let gotSpeedup = (snake[0].x === speedup.x && snake[0].y === speedup.y) ? true : false;
  let gotSlowdown = (snake[0].x === slowdown.x && snake[0].y === slowdown.y) ? true : false;
  let gotDoublePoints = (snake[0].x === doublePoints.x && snake[0].y === doublePoints.y) ? true : false;
  if (ateFood) {
    scoreNum += points * 2;
    score.innerHTML = scoreNum;
    newApple();
  } else {
    snake.pop();
  }
  if (gotSpeedup) {
    scoreNum += points;
    score.innerHTML = scoreNum;
    speed -= 5;
    hidePowerup(speedup);
    key1 = setTimeout(() => {
      spawnSpeedup();
    }, 10000)
  }
  if (gotSlowdown) {
    scoreNum += points;
    score.innerHTML = scoreNum;
    speed += 5;
    hidePowerup(slowdown);
    key2 = setTimeout(() => {
      spawnSlowdown();
    }, 10000)
  }
  if (gotDoublePoints) {
    scoreNum += points;
    score.innerHTML = scoreNum;
    points = points * 2;
    hidePowerup(doublePoints);
    key3 = setTimeout(() => {
      points = points / 2;
      spawnDoublePoints();
    }, 10000)
  }
}

function crashed() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }
  if (snake[0].x < 0 || snake[0].x > canvas.width - 10 || snake[0].y < 0 || snake[0].y > canvas.height - 10) {
    return true;
  }
  return false;
}

function randomTen(min, max) {
  return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function newApple() {
  apple.x = randomTen(0, canvas.width - 10);
  apple.y = randomTen(0, canvas.height - 10);
  snake.forEach(part => {
    if (part.x === apple.x && part.y === apple.y) {
      newApple();
    }
  })
  if (apple.x === speedup.x && apple.y === speedup.y) {
    newApple();
  }
  if (apple.x === slowdown.x && apple.y === slowdown.y) {
    newApple();
  }
  if (apple.x === doublePoints.x && apple.y === doublePoints.y) {
    newApple();
  }
}

function spawnSpeedup() {
  speedup.x = randomTen(0, canvas.width - 10);
  speedup.y = randomTen(0, canvas.height - 10);
  snake.forEach(part => {
    if (part.x === speedup.x && part.y === speedup.y) {
      spawnSpeedup();
    }
  })
  if (apple.x === speedup.x && apple.y === speedup.y) {
    spawnSpeedup();
  }
  if (slowdown.x === speedup.x && slowdown.y === speedup.y) {
    spawnSpeedup();
  }
  if (speedup.x === doublePoints.x && speedup.y === doublePoints.y) {
    spawnSpeedup();
  }
}

function spawnSlowdown() {
  slowdown.x = randomTen(0, canvas.width - 10);
  slowdown.y = randomTen(0, canvas.height - 10);
  snake.forEach(part => {
    if (part.x === slowdown.x && part.y === slowdown.y) {
      spawnSlowdown();
    }
  })
  if (apple.x === slowdown.x && apple.y === slowdown.y) {
    spawnSlowdown();
  }
  if (slowdown.x === speedup.x && slowdown.y === speedup.y) {
    spawnSlowdown();
  }
  if (slowdown.x === doublePoints.x && slowdown.y === doublePoints.y) {
    spawnSlowdown();
  }
}

function spawnDoublePoints() {
  doublePoints.x = randomTen(0, canvas.width - 10);
  doublePoints.y = randomTen(0, canvas.height - 10);
  snake.forEach(part => {
    if (part.x === doublePoints.x && part.y === doublePoints.y) {
      spawnDoublePoints();
    }
  })
  if (slowdown.x === doublePoints.x && slowdown.y === doublePoints.y) {
    spawnDoublePoints();
  }
  if (speedup.x === doublePoints.x && speedup.y === doublePoints.y) {
    spawnDoublePoints();
  }
  if (apple.x === doublePoints.x && apple.y === doublePoints.y) {
    spawnDoublePoints();
  }
}

function hidePowerup(powerup) {
  powerup.x = -100;
  powerup.y = -100;
}

function showSnake() {
  snake.forEach(part => {
    ctx.fillStyle = colors.snakeFill;
    ctx.strokeStyle = colors.snakeOutline;
    ctx.fillRect(part.x, part.y, 10, 10);
    ctx.strokeRect(part.x, part.y, 10, 10);
  })
}

function turn(event) {
  if (turning) {
    return;
  }
  turning = true;
  let pressed = event.keyCode;
  // 1) Left 2) Up 3) Right 4) Down
  if ((pressed === 37 || pressed === 65) && velocity.x !== 10) {
    velocity.x = -10;
    velocity.y = 0;
  } else if ((pressed === 38 || pressed === 87) && velocity.y !== 10) {
    velocity.x = 0;
    velocity.y = -10;
  } else if ((pressed === 39 || pressed === 68) && velocity.x !== -10) {
    velocity.x = 10;
    velocity.y = 0;
  } else if ((pressed === 40 || pressed === 83) && velocity.y !== -10) {
    velocity.x = 0;
    velocity.y = 10;
  }
}

function play() {
  if (crashed()) {
    end();
    return;
  }
  key = setTimeout(() => {
    turning = false;
    resetDisplay();
    showApple();
    showSpeedup();
    showSlowdown();
    showDoublePoints();
    snakeMove();
    showSnake();
    play();
  }, speed)
}

function start() {
  divElem.classList.add("hide");
  const smallSize = document.getElementById("small");
  const mediumSize = document.getElementById("medium");
  const largeSize = document.getElementById("large");
  if (smallSize.checked) {
    canvas.width = 300;
    canvas.height = 300;
  } else if (mediumSize.checked) {
    canvas.width = 600;
    canvas.height = 600;
  } else if (largeSize.checked) {
    canvas.width = 900;
    canvas.height = 900;
  }
  play();
  newApple();
  spawnSpeedup();
  spawnSlowdown();
  spawnDoublePoints();
  scoreNum = 0;
  score.innerHTML = scoreNum;
}

function end() {
  clearTimeout(key);
  clearTimeout(key1);
  clearTimeout(key2);
  clearTimeout(key3);
  divElem.classList.remove("hide");
  speed = 100;
  points = 5;
  snake = [{
      x: 150,
      y: 150
    },
    {
      x: 140,
      y: 150
    },
    {
      x: 130,
      y: 150
    },
    {
      x: 120,
      y: 150
    },
    {
      x: 110,
      y: 150
    }
  ]
  if (scoreNum > highScoreNum) {
    highScoreNum = scoreNum;
    highScore.innerHTML = highScoreNum;
  }
  turning = false;
  apple = {
    x: 0,
    y: 0
  }
  speedup = {
    x: 0,
    y: 0
  }
  slowdown = {
    x: 0,
    y: 0
  }
  doublePoints = {
    x: 0,
    y: 0
  }
  velocity = {
    x: 10,
    y: 0
  }
}