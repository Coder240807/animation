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
let spriteWidth = spriteSheet.width / cols;   
let spriteHeight = spriteSheet.height / rows; 

ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;

function animate() {
    drawScene();
    requestAnimationFrame(animate); 
    currentFrame = currentFrame % totalFrames;
    srcX = currentFrame * spriteWidth;

    ctx.save();
    resizeImage();
    ctx.drawImage(spriteSheet, srcX, srcY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight);
    ctx.restore();
    //img, srcX, srcY, spriteWidth, spriteHeight, x, y, width, height
    framesDrawn++;
    if(framesDrawn >= 10){
        currentFrame++;
        framesDrawn = 0;
    }
}

function resizeImage(){
    let scale = 2;
    let midXpos = innerWidth / 2 - (spriteWidth * scale) / 2;
    let midYpos = innerHeight / 2 - (spriteHeight * scale) / 2;
    ctx.translate(midXpos, midYpos);
    ctx.scale(scale, scale);
}

addEventListener("keydown", e => {
    if(e.key === "ArrowLeft") {
        srcY = spriteHeight*1;
    }
})

addEventListener("keyup", e => {
    if(e.key === "ArrowRight") {
        srcY = spriteHeight*0;
    }
})



function loadImages() {
    if (--numberOfImg > 0) {
        return;
    }
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