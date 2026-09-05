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

function drawScene() {

    ctx.fillStyle = 'skyblue';
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
        canvas.width / 2 - (UFO.width * scale) / 2,
        topMargin
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

function animate() {
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

    ctx.save();
    resizeSprite();
    ctx.drawImage(spriteSheet, srcX, srcY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();
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