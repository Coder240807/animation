let canvas = document.getElementById('canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let ctx = canvas.getContext('2d');

ctx.fillStyle = 'skyblue';
ctx.fillRect(0, 0, canvas.width, 550);

ctx.fillStyle = '#3d251e';
ctx.fillRect(0, 550, canvas.width, canvas.height - 550);