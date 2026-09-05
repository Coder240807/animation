let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

function drawScene() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = 'skyblue';
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

    ctx.fillStyle = '#3d251e';
    ctx.fillRect(0, canvas.height * 0.65, canvas.width, canvas.height * 0.35);

}

drawScene();

window.addEventListener('resize', drawScene);