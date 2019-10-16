// Main Variables
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const divElem = document.getElementById("btn-wrapper");
const buttonElem = document.getElementById("play-btn");
const colors = {
  snakeFill: "green",
  snakeOutline: "darkgreen",
  appleFill: "red",
  appleOutline: "darkred",
  gameFill: "white",
  gameOutline: "black"
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
let score = document.querySelector("#score");
let turning = false;
let key;
let apple = {
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
};
resetDisplay();

function showApple() {
  ctx.strokeStyle = colors.appleOutline;
  ctx.fillStyle = colors.appleFill;
  ctx.fillRect(apple.x, apple.y, 10, 10);
  ctx.strokeRect(apple.x, apple.y, 10, 10);
};

function snakeMove() {
  let head = {
    x: snake[0].x + velocity.x,
    y: snake[0].y + velocity.y
  }
  snake.unshift(head);
  let ateFood = (snake[0].x === apple.x && snake[0].y === apple.y) ? true : false;
  if (ateFood) {
    scoreNum += 10;
    score.innerHTML = scoreNum;
    newApple();
  } else {
    snake.pop();
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

function newApple() {
  apple.x = Math.round((Math.random() * canvas.width - 10) / 10) * 10;
  apple.y = Math.round((Math.random() * canvas.height - 10) / 10) * 10;
  snake.forEach(part => {
    if (part.x === apple.x && part.y === apple.y) {
      newApple();
    }
  })
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
  if (pressed === 37 && velocity.x !== 10) {
    velocity.x = -10;
    velocity.y = 0;
  } else if (pressed === 38 && velocity.y !== 10) {
    velocity.x = 0;
    velocity.y = -10;
  } else if (pressed === 39 && velocity.x !== -10) {
    velocity.x = 10;
    velocity.y = 0;
  } else if (pressed === 40 && velocity.y !== -10) {
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
    snakeMove();
    showSnake();
    play();
  }, speed)
}

function start() {
  divElem.classList.add("hide");
  play();
  newApple();
}

function end() {
  clearTimeout(key);
  divElem.classList.remove("hide");
  speed = 100;
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
  scoreNum = 0;
  turning = false;
  apple = {
    x: 0,
    y: 0
  }
  velocity = {
    x: 10,
    y: 0
  }
}