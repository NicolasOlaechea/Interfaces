"use strict";

//Creo las variable globales
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let width = canvas.width;
let height = canvas.height;
let rectCanvas = canvas.getBoundingClientRect(); //Coordenadas iniciales del canvas, el left y el top. Respecto a la pantalla
let x = 0; 
let y = 0;
let dibujando = false;
let borrando = false;
let color;
let grosor = document.getElementById("grosor_lapiz");
let lapiz = document.getElementById("logo_lapiz");
let goma = document.getElementById("logo_goma");
let archivo = document.getElementById("archivo");
let btnLimpiarLienzo = document.getElementById("btnLimpiarLienzo");
let btnFiltroEscalaGrises = document.getElementById("btn_escala_grises");
let btnFiltroNegativo = document.getElementById("btn_negativo");
let btnFiltroBrillo = document.getElementById("btn_brillo");
let btnFiltroBinarizacion = document.getElementById("btn_binarizacion");
let btnFiltroSepia = document.getElementById("btn_sepia");
//let btnFiltroNegativo = document.getElementById("btn_negativo");
let a = 255;

//Le asigno los eventos a los elementos correspondientes------------------------------------------------------

archivo.addEventListener("change", function(e){ //Cuando se cargue un archivo...
    let reader = new FileReader(); //Creo un objeto para almacenar la imagen ingresada
    reader.readAsDataURL(e.target.files[0]); //Leo el archivo y se lo paso al reader
    reader.addEventListener("load", function(){ //Cuando cargue la imagen...
        insertarImagen(reader);
    });
})

lapiz.addEventListener("click", function(){
    borrando = false; //Para cambiar el valor de la variable color cuando dibuja
    permitirDibujar();
})

goma.addEventListener("click", function(){
    borrando = true; //Para cambiar el valor de la variable color cuando borra
    permitirDibujar();
})

btnLimpiarLienzo.addEventListener("click", function(){
    limpiarLienzo();
})

btnFiltroEscalaGrises.addEventListener("click", function(){
    aplicarFiltroEscalaGrises();
})

btnFiltroNegativo.addEventListener("click", function(){
    aplicarFiltroNegativo();
})

btnFiltroBinarizacion.addEventListener("click", function(){
    aplicarFiltroBinarizacion();
})

btnFiltroBrillo.addEventListener("click", function(){
    aplicarFiltroBrillo();
})

btnFiltroSepia.addEventListener("click", function(){
    aplicarFiltroSepia();
})

//Creo las funciones
function permitirDibujar(){
    //Le asigno al canvas distintos eventos para poder dibujar sobre él
    canvas.addEventListener("mousedown", function(e){ //Cuando se hace click dentro del canvas
        //Uso el e para saber donde dio click el usuario en la pantalla, dentro del canvas
        //La posicion en X respecto a la pantalla - la x del canvas. Lo mismo con la Y
        x = e.clientX - rectCanvas.left;
        y = e.clientY - rectCanvas.top;
        dibujando = true;
    })
        
    canvas.addEventListener("mousemove", function(e){//Cuando se mueve el mouse dentro del canvas
        //Uso e para saber donde esta moviendo el mouse el usuario
        //Le paso el punto inicial de donde di click por primera vez y donde estoy ahora. Cada vez que muevo el 
        //mouse modifico el valor de x e y
        if(dibujando===true){ //Si el mouse sigue presionado...
            dibujar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = e.clientX - rectCanvas.left;
            y = e.clientY - rectCanvas.top;
        }
    })
        
    canvas.addEventListener("mouseup", function(e){ //Cuando se suelta el mouse dentro del canvas
        //Si venia dibujando, llama a la funcion dibujar y por ultimo reestablece los valores de dibujando, x, y
        if(dibujando===true){
            dibujar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    })
}

function dibujar(x1, y1, x2, y2){ //Recibe las x e y iniciales y finales para dibujar
    ctx.beginPath(); //Crea una nueva ruta
    if(borrando===true){
        color = "#ffffff";
    }else{
        color = document.getElementById("color_lapiz").value;
    }
    ctx.strokeStyle = color; //Defino el color
    ctx.lineWidth = grosor.value; //Defino el grosor
    ctx.moveTo(x1, y1); //Mueve el lapiz a la coordenada x1, y1
    ctx.lineTo(x2, y2); //Dibuja una linea entre la coordenada x1, y2
    ctx.stroke();
    ctx.closePath(); //Cierro la ruta
}

function limpiarLienzo(){
    //Limpio el canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function insertarImagen(reader){
    let imagen = new Image(); //Creo la imagen
    imagen.src = reader.result; //Guardo el src
    imagen.addEventListener("load", function (){ //Cuando cargue la imagen...
        dibujarImagen(this);
    });
}

function dibujarImagen(imagen){
    ctx.drawImage(imagen, 0, 0, width, height);
}

//TERMINADO
function aplicarFiltroEscalaGrises(){
    let imageData = ctx.getImageData(0, 0, width, height);
    //Saco el promedio entre la suma de los valores de rgb de cada pixel asigno ese valor
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

//EN DUDA
function aplicarFiltroBrillo(){
    let imageData = ctx.getImageData(0, 0, width, height);
    let nivelBrillo = document.getElementById("brillo").value;

    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            let r = parseInt(nivelBrillo * getRed(imageData, x, y));
            let g = parseInt(nivelBrillo * getGreen(imageData, x, y));
            let b = parseInt(nivelBrillo * getBlue(imageData, x, y));

            if(r > 255){
                r = 255;
            }else if(r < 0){
                r = 0;
            }
            if(g > 255){
                g = 255;
            }else if(r < 0){
                g = 0;
            }
            if(b > 255){
                b = 255;
            }else if(r < 0){
                b = 0;
            }
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

//TERMINADO
function aplicarFiltroNegativo(){
    let imageData = ctx.getImageData(0, 0, width, height);
    //A cada valor del rgb le asigno su opuesto, que es el valor lo que le falta al valor actual para llegar a 255
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            let r = 255 - getRed(imageData, x, y);
            let g = 255 - getGreen(imageData, x, y);
            let b = 255 - getBlue(imageData, x, y);
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

//TERMINADO
function aplicarFiltroBinarizacion(){
    let imageData = ctx.getImageData(0, 0, width, height);
    //Si los valores de rgb son menores a 255/2 les asigno 0 y si son mayores les asigno 255
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);
            if((r+g+b)/3 < (255/3)){
                r = 0;
                g = 0;
                b = 0;
            }else{
                r = 255;
                g = 255;
                b = 255;
            }
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

//TERMINADO
function aplicarFiltroSepia(){
    let imageData = ctx.getImageData(0, 0, width, height);

    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            let red = (r * .393) + (g * .769) + (b * .189);
            let green = (r * .349) + (g * .686) + (b * .168);
            let blue = (r * .272) + (g * .534) + (b * .131);
            setPixel(imageData, x, y, red, green, blue, a);
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
