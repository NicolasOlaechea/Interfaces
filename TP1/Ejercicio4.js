let canvas = document.getElementById("canvas"); //elemento <canvas>
let ctx = canvas.getContext("2d"); //El contexto
let width = 500; //Width y Heigth del rectangulo
let height = 500;
let x = 0;
let y = 0;

let imageData = ctx.createImageData(width, height); //Creo el rectangulo
let a = 255;

function drawRect(imageData, a){
    for(let x=0; x<width; x++){ //Recorro el rectangulo y seteo los colores de cada pixel
        for(let y=0; y<height; y++){
            let color = (y*255) / height;
            setPixel(imageData, x, y, color, color, color, a);
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

drawRect(imageData, a);
ctx.putImageData(imageData, x, y) * 4; 