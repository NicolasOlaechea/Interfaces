
let canvas = document.getElementById("canvas"); //elemento <canvas>
let ctx = canvas.getContext("2d"); //El contexto
let btnFiltro = document.getElementById("btnFiltro");
btnFiltro.addEventListener("click", function(){
    aplicarFiltro();
})

let imagen = new Image();
imagen.src = "messi.jpg";
let width = canvas.width;
let height = canvas.height;
let a = 255;

imagen.addEventListener("load", function (){
    dibujarImagen(this);
});

function dibujarImagen(img){
    ctx.drawImage(img, 0, 0, width, height);
}

function aplicarFiltro(){
    let imageData = ctx.getImageData(0, 0, width, height);
    
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);
            let valor = (r + g + b) / 3;
            setPixel(imageData, x, y, valor, valor, valor, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function setPixel(imageData, x, y, r, g, b, a){ 
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

function getRed(imageData, x, y){
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+0];
}

function getGreen(imageData, x, y){
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+1];
}

function getBlue(imageData, x, y){
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index+2];
}


    /*
    aplicarFiltro()
    for(let i=0; i<imageData.data.length; i++){
        let r = imageData.data[i*4];
        let g = imageData.data[i*4 + 1];
        let b = imageData.data[i*4 + 2];

        let valor = (r+g+b) / 3;

        imageData.data[i*4] = valor;
        imageData.data[i*4 + 1] = valor;
        imageData.data[i*4 + 2] = valor;

    }*/