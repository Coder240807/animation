let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let numberOfImg = 1;

const spriteSheet =new Image();
spriteSheet.src = 'Spritesheet.png';
spriteSheet.onload = loadImages;

let cols = 8;
let rows = 2;

let totalFrames = 8;
let currentFrame = 0;

let srcX = 0;
let srcY = 0;
let framesDrawn = 0;

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function animate() {
    drawScene();
    requestAnimationFrame(animate); 
    if(moveLeft){
        PlayerX -= speed;
    }
    if(moveRight){
        PlayerX += speed;
    }

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
    resizeImage();
    ctx.drawImage(spriteSheet, srcX, srcY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();
}

function resizeImage(){
    let scale = 2;
    ctx.translate(PlayerX - (spriteWidth * scale) / 2, PlayerY - (spriteHeight * scale) / 2);
    ctx.scale(scale, scale);
}

let PlayerX = window.innerWidth / 2;
let PlayerY = window.innerHeight / 2;
let speed = 4;

let moveLeft = false;
let moveRight = false;

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


let spriteWidth=0;
let spriteHeight=0;

function loadImages() {
    if (--numberOfImg > 0) {
        return;
    }
    spriteWidth = spriteSheet.width / cols;   
    spriteHeight = spriteSheet.height / rows; 

    animate();
}

function drawScene() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    ctx.fillStyle = '#3d251e';
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

}

window.addEventListener('resize', drawScene);