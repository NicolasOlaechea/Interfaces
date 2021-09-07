let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let rectCanvas = canvas.getBoundingClientRect(); //Coordenadas iniciales del canvas
let x = 0; 
let y = 0;
let widthCanvas = canvas.width;
let heightCanvas = canvas.height;
let dibujando = false;
let borrando = false;
let color = document.getElementById("color_lapiz");
let grosor = document.getElementById("grosor_lapiz");
let lapiz = document.getElementById("logo_lapiz");
let goma = document.getElementById("logo_goma");
let archivo = document.getElementById("archivo");

archivo.addEventListener("change", function(e){
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.addEventListener("load", function(){
        insertarImagen(reader);
    });
})

lapiz.addEventListener("click", function(){
    permitirDibujar();
})

goma.addEventListener("click", function(){
    permitirBorrar();
})

function permitirDibujar(){
    goma.removeEventListener("click", permitirBorrar);
    canvas.addEventListener("mousedown", function(e){ //Cuando se hace click dentro del canvas
        x = e.clientX - rectCanvas.left;
        y = e.clientY - rectCanvas.top;
        dibujando = true;
    })
        
    canvas.addEventListener("mousemove", function(e){//Cuando se mueve el mouse dentro del canvas
        if((dibujando===true) && (borrando===false)){
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
    console.log("dibujo "+color.value);
    ctx.beginPath();
    ctx.strokeStyle = color.value;
    ctx.lineWidth = grosor.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function permitirBorrar(){
    lapiz.removeEventListener("click", permitirDibujar);
    canvas.addEventListener("mousedown", function(e){
        x = e.clientX - rectCanvas.left;
        y = e.clientY - rectCanvas.top;
        dibujando = true;
    })
        
    canvas.addEventListener("mousemove", function(e){
        if(dibujando===true){
            borrar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = e.clientX - rectCanvas.left;
            y = e.clientY - rectCanvas.top;
        }
    })
        
    canvas.addEventListener("mouseup", function(e){
        if(dibujando===true){
            borrar(x, y, e.clientX - rectCanvas.left, e.clientY - rectCanvas.top);
            x = 0;
            y = 0;
            dibujando = false;
        }
    })
}

function borrar(x1, y1, x2, y2){
    color = "#ffffff";
    console.log("borro "+color);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = grosor.value;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function limpiarLienzo(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

let btnLimpiarLienzo = document.getElementById("btnLimpiarLienzo");
btnLimpiarLienzo.addEventListener("click", function(){
    limpiarLienzo();
})

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