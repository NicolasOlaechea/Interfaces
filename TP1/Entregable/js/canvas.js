"use strict";

//Creo las variable globales
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let rectCanvas = canvas.getBoundingClientRect(); //Coordenadas iniciales del canvas
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

//Le asigno los eventos a los elementos correspondientes
archivo.addEventListener("change", function(e){
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener("load", function(){
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

//Creo las funciones
function permitirDibujar(){
    //Le asigno al canvas distintos eventos para poder dibujar sobre él
    canvas.addEventListener("mousedown", function(e){ //Cuando se hace click dentro del canvas
        x = e.clientX - rectCanvas.left;
        y = e.clientY - rectCanvas.top;
        dibujando = true;
    })
        
    canvas.addEventListener("mousemove", function(e){//Cuando se mueve el mouse dentro del canvas
        if(dibujando===true){
            dibujar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = e.clientX - rectCanvas.left;
            y = e.clientY - rectCanvas.top;
        }
    })
        
    canvas.addEventListener("mouseup", function(e){ //Cuando se suelta el mouse dentro del canvas
        if(dibujando===true){
            dibujar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    })
}

function dibujar(x1, y1, x2, y2){
    ctx.beginPath();
    if(borrando===true){
        color = "#ffffff";
    }else{
        color = document.getElementById("color_lapiz").value;
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function limpiarLienzo(){
    //Limpio el canvas completamente
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function insertarImagen(reader){
    let imagen = new Image();
    imagen.src = reader.result;
    console.log(imagen.src);
    imagen.addEventListener("load", function (){
        dibujarImagen(this);
    });
}

function dibujarImagen(imagen){
    ctx.drawImage(imagen, 0, 0, widthCanvas, heightCanvas);
}