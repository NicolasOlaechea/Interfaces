"use strict";

//Creo las variable globales
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
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
    ctx.drawImage(imagen, 0, 0, widthCanvas, heightCanvas);
}