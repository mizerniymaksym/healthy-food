"use strict";

(function () {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const HEALTHY = ["🥗", "🥦", "🍎", "🥕", "🫐", "🥑", "🍇", "🌽", "🥝", "🍊"];
  const JUNK = ["🍔", "🍟", "🍕", "🍩", "🍦", "🧃", "🍭", "🥤"];

  const BASKET_W = 80,
    BASKET_H = 20;
  const ITEM_SIZE = 36;

  let score, lives, level, items, basket, animId, running, speed;

  function initState() {
    score = 0;
    lives = 3;
    level = 1;
    items = [];
    speed = 2.5;
    running = false;
    basket = {
      x: canvas.width / 2 - BASKET_W / 2,
      y: canvas.height - 40,
      w: BASKET_W,
      h: BASKET_H,
    };
  }

  initState();

  const keys = { left: false, right: false };

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") keys.left = true;
    if (e.key === "ArrowRight") keys.right = true;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key === "ArrowLeft") keys.left = false;
    if (e.key === "ArrowRight") keys.right = false;
  });

  const btnLeft = document.getElementById("btnLeft");
  const btnRight = document.getElementById("btnRight");
  if (btnLeft && btnRight) {
    ["touchstart", "mousedown"].forEach((ev) => {
      btnLeft.addEventListener(ev, (e) => {
        e.preventDefault();
        keys.left = true;
      });
      btnRight.addEventListener(ev, (e) => {
        e.preventDefault();
        keys.right = true;
      });
    });
    ["touchend", "mouseup"].forEach((ev) => {
      btnLeft.addEventListener(ev, () => (keys.left = false));
      btnRight.addEventListener(ev, () => (keys.right = false));
    });
  }

  function spawnItem() {
    const isHealthy = Math.random() > 0.32;
    items.push({
      x: Math.random() * (canvas.width - ITEM_SIZE),
      y: -ITEM_SIZE,
      emoji: isHealthy
        ? HEALTHY[Math.floor(Math.random() * HEALTHY.length)]
        : JUNK[Math.floor(Math.random() * JUNK.length)],
      healthy: isHealthy,
      speed: speed + Math.random() * 1.5,
    });
  }

  let spawnTimer = 0;

  function loop() {
    if (!running) return;
    animId = requestAnimationFrame(loop);
    spawnTimer++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    const bspeed = 7;
    if (keys.left) basket.x = Math.max(0, basket.x - bspeed);
    if (keys.right)
      basket.x = Math.min(canvas.width - basket.w, basket.x + bspeed);

    const spawnRate = Math.max(30, 70 - level * 5);
    if (spawnTimer % spawnRate === 0) spawnItem();

    for (let i = items.length - 1; i >= 0; i--) {
      const it = items[i];
      it.y += it.speed;

      ctx.font = `${ITEM_SIZE}px serif`;
      ctx.textAlign = "center";
      ctx.fillText(it.emoji, it.x + ITEM_SIZE / 2, it.y + ITEM_SIZE);

      if (
        it.y + ITEM_SIZE >= basket.y &&
        it.y <= basket.y + basket.h &&
        it.x + ITEM_SIZE >= basket.x &&
        it.x <= basket.x + basket.w
      ) {
        if (it.healthy) {
          score += 10 * level;
          showEffect(it.x, it.y, "+" + 10 * level, "#4a7c59");
          if (score >= 400 && !window.secretsUnlocked) {
            if (typeof window.unlockSecrets === "function") {
              window.unlockSecrets();
              keys.left = false;
              keys.right = false;
            }
          }
        } else {
          lives--;
          showEffect(it.x, it.y, "-1 ❤️", "#c0392b");
          updateHud();
          if (lives <= 0) {
            endGame();
            return;
          }
        }
        items.splice(i, 1);
        continue;
      }

      if (it.y > canvas.height) {
        if (it.healthy) {
          lives--;
          showEffect(it.x, canvas.height - 20, "Missed!", "#e67e22");
          updateHud();
          if (lives <= 0) {
            endGame();
            return;
          }
        }
        items.splice(i, 1);
      }
    }

    if (score > 0 && score % 150 === 0 && Math.floor(score / 150) >= level) {
      level++;
      speed += 0.4;
    }

    drawBasket();
    updateHud();
    drawEffects();
  }

  const effects = [];

  function showEffect(x, y, text, color) {
    effects.push({ x, y, text, color, life: 40 });
  }

  function drawEffects() {
    for (let i = effects.length - 1; i >= 0; i--) {
      const ef = effects[i];
      ctx.save();
      ctx.globalAlpha = ef.life / 40;
      ctx.fillStyle = ef.color;
      ctx.font = 'bold 16px "DM Sans", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText(ef.text, ef.x + ITEM_SIZE / 2, ef.y - (40 - ef.life) * 0.8);
      ctx.restore();
      ef.life--;
      ef.y -= 0.5;
      if (ef.life <= 0) effects.splice(i, 1);
    }
  }

  function drawBackground() {
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, "#f0f7eb");
    grad.addColorStop(1, "#e4f0da");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(74,124,89,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, basket.y + basket.h + 4);
    ctx.lineTo(canvas.width, basket.y + basket.h + 4);
    ctx.stroke();
  }

  function drawBasket() {
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.15)";
    ctx.shadowBlur = 8;
    const grad = ctx.createLinearGradient(
      basket.x,
      basket.y,
      basket.x,
      basket.y + basket.h
    );
    grad.addColorStop(0, "#5a9c3a");
    grad.addColorStop(1, "#3d7028");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(basket.x, basket.y, basket.w, basket.h, 6);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.beginPath();
    ctx.roundRect(basket.x + 4, basket.y + 2, basket.w - 8, 5, 3);
    ctx.fill();
    ctx.restore();
  }

  function updateHud() {
    document.getElementById("gameScore").textContent = score;
    document.getElementById("gameLives").textContent = "❤️".repeat(
      Math.max(0, lives)
    );
    document.getElementById("gameLevel").textContent = level;
  }

  window.startGame = function () {
    cancelAnimationFrame(animId);
    initState();
    items = [];
    effects.length = 0;
    spawnTimer = 0;
    running = true;
    document.getElementById("gameOver").classList.add("hidden");
    updateHud();
    loop();
  };

  function endGame() {
    running = false;
    cancelAnimationFrame(animId);
    document.getElementById("finalScore").textContent = score;
    document.getElementById("gameOver").classList.remove("hidden");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    ctx.save();
    ctx.fillStyle = "rgba(74,124,89,0.18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 48px "Playfair Display", serif';
    ctx.fillStyle = "#2b3a2e";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '24px "DM Sans", sans-serif';
    ctx.fillStyle = "#4a7c59";
    ctx.fillText("Score: " + score, canvas.width / 2, canvas.height / 2 + 24);
    ctx.restore();
  }

  drawBackground();
  ctx.font = '28px "Playfair Display", serif';
  ctx.fillStyle = "#4a7c59";
  ctx.textAlign = "center";
  ctx.fillText(
    "Press ▶ Start to play!",
    canvas.width / 2,
    canvas.height / 2 - 10
  );
  ctx.font = '18px "DM Sans", sans-serif';
  ctx.fillStyle = "#7a8f7e";
  ctx.fillText(
    "Use ← → arrow keys or buttons to move",
    canvas.width / 2,
    canvas.height / 2 + 28
  );
})();
