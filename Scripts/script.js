var board;
var score = 0;
var rows = 4;
var columns = 4;

window.onload = function() {
    setGame();
    document.getElementById('restart').addEventListener('click', resetGame);
}

function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

function resetGame() {
    // Clear the board
    document.getElementById("board").innerHTML = "";
    score = 0;
    document.getElementById("score").innerText = score;
    setGame();
}

function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    tile.classList.add("tile");
    if (num > 0) {
        tile.innerText = num.toString();
        tile.classList.add("x" + num.toString());
        tile.style.transform = "scale(1.1)";
        setTimeout(() => tile.style.transform = "scale(1)", 100);
    }
}

document.addEventListener('keyup', (e) => {
    if (e.code === "ArrowLeft") {
        slideLeft();
        setTwo();
    } else if (e.code === "ArrowRight") {
        slideRight();
        setTwo();
    } else if (e.code === "ArrowUp") {
        slideUp();
        setTwo();
    } else if (e.code === "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;
})

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(row) {
    row = filterZero(row);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            row[i + 1] = 0;
            score += row[i];
        }
    }
    row = filterZero(row);
    while (row.length < columns) {
        row.push(0);
    }
    return row;
}

function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row.reverse();
        row = slide(row);
        board[r] = row.reverse();
        for (let c = 0; c < columns; c++) {
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideUp() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row = slide(row);
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function slideDown() {
    for (let c = 0; c < columns; c++) {
        let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        for (let r = 0; r < rows; r++) {
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function setTwo() {
    if (!hasEmptyTile()) {
        return;
    }
    let found = false;
    while (!found) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        if (board[r][c] === 0) {
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            tile.style.transform = "scale(1.2)";
            setTimeout(() => tile.style.transform = "scale(1)", 100);
            found = true;
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === 0) {
                return true;
            }
        }
    }
    return false;
}


// Raindrops Script
let ctx, cW, cH, raindrops;
let rainStrength = 1;
let mouseX = 0;

function initCanvas() {
  const canvas = document.getElementById("particleCanvas");
  ctx = canvas.getContext("2d");

  canvas.width = 1800 * 0.75;
  canvas.height = 780 * 0.75;

  cW = canvas.width;
  cH = canvas.height;

  mouseX = cW / 2;
}

class Raindrops {
  constructor() {
    this.drops = [];
    this.splashes = [];
  }

  addDrop() {
    const x = (Math.random() * (cW + 100)) - 100;
    const s = (Math.random() * 7) + 2;

    this.drops.push({
      x: x,
      y: 0,
      velY: 2,
      width: s / 3,
      height: s * 1.2,
      speed: s,
      life: 60
    });
  }

  render() {
    for (let i = 0; i < rainStrength; i++) {
      this.addDrop();
    }

    ctx.save();
    ctx.clearRect(0, 0, cW, cH);
    ctx.fillStyle = '#487596';

    this.drops.forEach((drop, index) => {
      ctx.fillRect(drop.x, drop.y, drop.width, drop.height);

      const direction = (mouseX - cW / 2) * 0.01;
      drop.x += direction;
      drop.y += drop.speed * 2;

      if (drop.y + drop.height > cH) {
        this.splashes.push({
          x: drop.x + (Math.random() * 20 - 10),
          y: drop.y,
          width: drop.width,
          height: drop.height,
          velY: drop.velY,
          speed: drop.speed,
          life: drop.life
        });

        this.drops.splice(index, 1);
      }
    });

    this.splashes.forEach((splash, index) => {
      ctx.fillRect(splash.x, splash.y, splash.width / 3, splash.height / 3);

      splash.y -= splash.velY * splash.speed / 6;
      splash.life--;
      splash.velY -= 0.1;

      if (splash.life <= 0) {
        this.splashes.splice(index, 1);
      }
    });

    ctx.restore();
  }
}

function init() {
  raindrops = new Raindrops();
  loop();
}

function render() {
  raindrops.render();
}

function loop() {
  requestAnimationFrame(loop);
  render();
}

window.addEventListener('mousemove', (event) => {
  mouseX = event.clientX - ctx.canvas.getBoundingClientRect().left;
});

window.addEventListener('load', () => {
  initCanvas();
  init();
  typewriteTitle('Arta');
});
