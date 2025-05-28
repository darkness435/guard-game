const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let gameLevel = 1;
let enemies = [];
let towers = [];
let baseHealth = 100;
let gold = 200;
let themes = ["orman", "çöl", "şehir", "arazi", "dağ"];

class Enemy {
  constructor(type, x, y, speed, health) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.health = health;
    this.alive = true;
  }

  update() {
    this.x -= this.speed;
    if (this.x < 50) {
      baseHealth -= 10;
      this.alive = false;
    }
  }

  draw() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, 20, 20);
  }
}

class Tower {
  constructor(x, y, range, damage) {
    this.x = x;
    this.y = y;
    this.range = range;
    this.damage = damage;
    this.cooldown = 0;
  }

  update() {
    if (this.cooldown > 0) this.cooldown--;
    for (let enemy of enemies) {
      const dx = enemy.x - this.x;
      const dy = enemy.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < this.range && this.cooldown === 0) {
        enemy.health -= this.damage;
        this.cooldown = 30;
        if (enemy.health <= 0) {
          enemy.alive = false;
          gold += 10;
        }
        break;
      }
    }
  }

  draw() {
    ctx.fillStyle = "blue";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 15, 0, Math.PI * 2);
    ctx.fill();
  }
}

function spawnEnemies() {
  for (let i = 0; i < gameLevel + 2; i++) {
    const y = Math.random() * (canvas.height - 20);
    enemies.push(new Enemy("basic", canvas.width, y, 1 + gameLevel * 0.1, 30 + gameLevel * 5));
  }
}

function updateGame() {
  enemies = enemies.filter(e => e.alive);
  for (let enemy of enemies) enemy.update();
  for (let tower of towers) tower.update();

  if (enemies.length === 0) {
    gameLevel++;
    spawnEnemies();
  }
}

function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ccc";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let enemy of enemies) enemy.draw();
  for (let tower of towers) tower.draw();

  ctx.fillStyle = "black";
  ctx.fillText("Seviye: " + gameLevel, 10, 20);
  ctx.fillText("Üs Sağlığı: " + baseHealth, 10, 40);
  ctx.fillText("Altın: " + gold, 10, 60);
}

canvas.addEventListener("click", function (e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if (gold >= 50) {
    towers.push(new Tower(x, y, 100, 10));
    gold -= 50;
  }
});

function gameLoop() {
  updateGame();
  drawGame();
  if (baseHealth > 0) {
    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "black";
    ctx.fillText("Oyun Bitti!", canvas.width / 2 - 40, canvas.height / 2);
  }
}

spawnEnemies();
gameLoop();
