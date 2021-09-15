let canvas = document.getElementById("canvas"); //elemento <canvas>
let ctx = canvas.getContext("2d"); //El contexto
let width = 200; //Width y Heigth del rectangulo
let height = 100;
let x = 0;
let y = 0;

let imageData = ctx.createImageData(width, height); //Creo el rectangulo
let r = 0; //Los valores del rgba
let g = 130;
let b = 210;
let a = 255;

function drawRect(imageData, r, g, b, a){
    for(let x=0; x<width; x++){ //Recorro el rectangulo y seteo los colores de cada pixel
        for(let y=0; y<height; y++){
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
}

function setPixel(imageData, x, y, r, g, b, a){ 
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

drawRect(imageData, r, g, b, a);
ctx.putImageData(imageData, x, y) * 4; 