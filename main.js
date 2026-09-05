const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let numberOfImg = 2;

let cols = 8;
let rows = 2;

let totalFrames = 8;
let currentFrame = 0;

let srcX = 0;
let srcY = 0;
let framesDrawn = 0;

let spriteWidth=0;
let spriteHeight=0;
let scale = 1.5;

let PlayerX;
let PlayerY;

let moveLeft = false;
let moveRight = false;

let ufoX = 0;
let ufoY = 0;
let ufoWidth = 80;  
let ufoHeight = 80;

let speed = 4;

let lasers = [];
let laserCooldown = 0;
let laserCooldownMax = 60;
let laserSpeed = 5;
let laserRange = 100;
let ufoFollowSpeed = 0.01;

let gameOver = false;

function drawScene() {

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    ctx.fillStyle = '#3d251e';
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);
}

function resizeSprite(){
    let scale = 1.5;
    ctx.translate(PlayerX - (spriteWidth * scale) / 2, PlayerY - (spriteHeight * scale) / 2);
    ctx.scale(scale, scale);
}

function resizeUFO(){
    let scale = 0.35;
    let topMargin = -20; 
    ctx.translate(
       ufoX, topMargin
    );
    ctx.scale(scale, scale);
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;

    PlayerX = canvas.width / 2;
    PlayerY = canvas.height * 0.68 - (spriteHeight * scale) / 2;

    ufoX = canvas.width / 2 - ufoWidth / 2;
    ufoY = canvas.height * 0.2;
}

function tryLaser() {
    if (laserCooldown <= 0) {
        let offset = (Math.random() * 2 - 1) * laserRange;

        let startX = ufoX + ufoWidth / 2;
        let startY = ufoY + ufoHeight * 0.8;

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
            length: 40 
        });

        laserCooldown = laserCooldownMax;
    }

    if (laserCooldown > 0) laserCooldown--;
}

function updateAndDrawLasers() {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 10;
    ctx.lineCap = "round";

    for (let i = lasers.length - 1; i >= 0; i--) {
        let laser = lasers[i];
        laser.travelled += laserSpeed;

        let headX = laser.startX + laser.dirX * laser.travelled;
        let headY = laser.startY + laser.dirY * laser.travelled;
        let tailX = headX - laser.dirX * laser.length;
        let tailY = headY - laser.dirY * laser.length;

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

function animate() {
    if(gameOver) return;
    drawScene();
    requestAnimationFrame(animate); 
    if(moveLeft){
        PlayerX -= speed;
    }
    if(moveRight){
        PlayerX += speed;
    }

    let scale = 1.5; 
    let halfW = (spriteWidth * scale) / 2;
    PlayerX = Math.max(halfW, Math.min(window.innerWidth - halfW, PlayerX));

    let targetUfoX = PlayerX - ufoWidth / 2; 
    ufoX += (targetUfoX - ufoX) * ufoFollowSpeed;
    
    if(moveLeft || moveRight){
        currentFrame = currentFrame % totalFrames;
        srcX = currentFrame * spriteWidth;
    
        framesDrawn++;
        if(framesDrawn >= 10){
        currentFrame++;
        framesDrawn = 0;
       }
    }
    else{
        currentFrame = 2;
        srcX = currentFrame * spriteWidth;
    }

    ctx.save();
    resizeUFO();
    ctx.drawImage(UFO, 0, 0, UFO.width, UFO.height);
    ctx.restore();

    tryLaser();
    updateAndDrawLasers();

    ctx.save();
    resizeSprite();
    ctx.drawImage(spriteSheet, srcX, srcY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();

    if (checkLaserCollision()) {
        gameOver = true;
        showGameOver();
    }
}

function showGameOver() {
    ctx.setTransform(1, 0, 0, 1, 0, 0); 
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
}

function loadImages() {
    if(--numberOfImg > 0) return;
    spriteWidth = spriteSheet.width / cols;   
    spriteHeight = spriteSheet.height / rows; 

    resizeCanvas();
    animate();
}

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
    if (e.key === "ArrowLeft"){ moveLeft = false; }
    if (e.key === "ArrowRight"){ moveRight = false; }
});

window.addEventListener('resize', resizeCanvas);

const spriteSheet = new Image();
const UFO = new Image();
 
spriteSheet.onload = loadImages;
UFO.onload = loadImages;
 
spriteSheet.src = 'Spritesheet.png';
UFO.src = 'UFO.png';

resizeCanvas();