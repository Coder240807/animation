const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');


let numberOfImg = 3;

let cols = 8;
let rows = 2;
let totalFrames = 8;
let currentFrame = 0;
let srcX = 0;
let srcY = 0;
let framesDrawn = 0;

let spriteWidth = 0;
let spriteHeight = 0;
let scale = 1.5;
let PlayerX, PlayerY;

let moveLeft = false;
let moveRight = false;

let ufoX;
let ufoWidth;
let ufoHeight;
let ufoScale = 0.35;
let topMargin = -10;
let ufoFollowSpeed = 0.02;

let lasers = [];
let laserCooldownMax = 35;
let laserCooldown = 0;
let laserSpread = 50;
let gameOver = false;

let gameStartTime = 0;
let speed = 6;      
let maxLaserSpeed = 18;      
let speedRampDuration = 30000;

function drawScene() {
    ctx.drawImage(NightCity,0,0, canvas.width, canvas.height*0.75);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, canvas.height * 0.75, canvas.width, canvas.height * 0.25);
}

function resizeImage() {
    ctx.translate(PlayerX - (spriteWidth * scale) / 2, PlayerY - (spriteHeight * scale) / 2);
    ctx.scale(scale, scale);
}

function resizeUFO() {
    ctx.translate(ufoX, topMargin);
    ctx.scale(ufoScale, ufoScale);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;

    PlayerX = canvas.width / 2;
    PlayerY = canvas.height * 0.78 - (spriteHeight * scale) / 2;

    ufoX = canvas.width / 2 - (ufoWidth || 0) / 2;
}

function tryFireLaser() {
    if (laserCooldown <= 0) {
        let offset = (Math.random() * 2 - 1) * laserSpread;
        let startX = ufoX + ufoWidth / 2;
        let startY = topMargin + ufoHeight * 0.8;
        let targetX = PlayerX + offset;
        let targetY = PlayerY;

        let dx = targetX - startX;
        let dy = targetY - startY;
        let dist = Math.sqrt(dx * dx + dy * dy);

        lasers.push({
            startX, startY,
            dirX: dx / dist,
            dirY: dy / dist,
            travelled: 0,
            length: 50,
            flicker: Math.random() * 10
        });
        laserCooldown = laserCooldownMax;
    }
    if (laserCooldown > 0) laserCooldown--;
}

function updateAndDrawLasers() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.strokeStyle = "red";
    ctx.lineCap = "round"
    ctx.lineWidth = 10;

    let currentSpeed = getCurrentLaserSpeed();

    for (let i = lasers.length - 1; i >= 0; i--) {
        let laser = lasers[i];
        laser.travelled += currentSpeed;

        let headX = laser.startX + laser.dirX * laser.travelled;
        let headY = laser.startY + laser.dirY * laser.travelled;
        let tailX = headX - laser.dirX * laser.length;
        let tailY = headY - laser.dirY * laser.length;

        let pulse = 1 + Math.sin(laser.flicker) * 0.15;

        ctx.strokeStyle = 'rgba(255, 60, 60, 0.35)';
        ctx.lineWidth = 10 * pulse;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'red';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();

        ctx.strokeStyle = '#fff4e0';
        ctx.lineWidth = 4 * pulse;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.stroke();


        if (headY > canvas.height + laser.length || headX < -50 || headX > canvas.width + 50) {
            lasers.splice(i, 1);
        }
    }
    ctx.restore();
}

function checkLaserCollision() {
    let hitboxMargin = 0.5;
    let halfW = (spriteWidth * scale * hitboxMargin) / 2;
    let halfH = (spriteHeight * scale * hitboxMargin) / 2;

    let left = PlayerX - halfW;
    let right = PlayerX + halfW;
    let top = PlayerY - halfH;
    let bottom = PlayerY + halfH;

    for (let laser of lasers) {
        let headX = laser.startX + laser.dirX * laser.travelled;
        let headY = laser.startY + laser.dirY * laser.travelled;

        if (headX >= left && headX <= right && headY >= top && headY <= bottom) {
            return true;
        }
    }
    return false;
}

function getCurrentLaserSpeed() {
    let elapsed = performance.now() - gameStartTime;
    let progress = Math.min(elapsed / speedRampDuration, 1); 
    return speed + (maxLaserSpeed - speed) * progress;
}

function showGameOver() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

    restartBtn.style.display = 'block';
}

function animate() {
    if (gameOver) return;

    drawScene();
    requestAnimationFrame(animate);

    if (moveLeft) PlayerX -= speed;
    if (moveRight) PlayerX += speed;

    let halfW = (spriteWidth * scale) / 2;
    PlayerX = Math.max(halfW, Math.min(window.innerWidth - halfW, PlayerX));

    let targetUfoX = PlayerX - ufoWidth / 2;
    ufoX += (targetUfoX - ufoX) * ufoFollowSpeed;

    if (moveLeft || moveRight) {
        currentFrame = currentFrame % totalFrames;
        srcX = currentFrame * spriteWidth;
        framesDrawn++;
        if (framesDrawn >= 10) {
            currentFrame++;
            framesDrawn = 0;
        }
    } else {
        currentFrame = 2;
        srcX = currentFrame * spriteWidth;
    }

    ctx.save();
    resizeUFO();
    ctx.drawImage(UFO, 0, 0, UFO.width, UFO.height);
    ctx.restore();

    tryFireLaser();
    updateAndDrawLasers();

    ctx.save();
    resizeImage();
    ctx.drawImage(spriteSheet, srcX, srcY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();

    if (checkLaserCollision()) {
        gameOver = true;
        showGameOver();
    }
}

function loadImages() {
    if (--numberOfImg > 0) return;

    spriteWidth = spriteSheet.width / cols;
    spriteHeight = spriteSheet.height / rows;

    ufoWidth = UFO.width * ufoScale;
    ufoHeight = UFO.height * ufoScale;

    resizeCanvas();
    drawScene(); 
}

function startGame() {
    startBtn.style.display = 'none';

    gameOver = false;
    lasers = [];
    laserCooldown = 60;
    currentFrame = 0;
    framesDrawn = 0;
    moveLeft = false;
    moveRight = false;
    gameStartTime = performance.now();

    resizeCanvas();
    animate();
}

function restartGame() {
    restartBtn.style.display = 'none';
    startGame(); 
}

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") {
        srcY = spriteHeight * 1;
        moveLeft = true;
    }
    if (e.key === "ArrowRight") {
        srcY = spriteHeight * 0;
        moveRight = true;
    }
});

addEventListener("keyup", e => {
    if (e.key === "ArrowLeft") moveLeft = false;
    if (e.key === "ArrowRight") moveRight = false;
});

window.addEventListener('resize', resizeCanvas);


const spriteSheet = new Image();
const UFO = new Image();
const NightCity = new Image();

spriteSheet.onload = loadImages;
UFO.onload = loadImages;
NightCity.onload = loadImages;

spriteSheet.src = 'Spritesheet.png';
UFO.src = 'UFO.png';
NightCity.src = 'Nightcity.jpg'

resizeCanvas();