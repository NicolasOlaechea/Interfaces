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
let btnDescargarImagen = document.getElementById("btn_descargar_imagen");
let btnLimpiarLienzo = document.getElementById("btnLimpiarLienzo");
let btnRestaurarImagen = document.getElementById("btn_restaurar_imagen");
let btnFiltroEscalaGrises = document.getElementById("btn_escala_grises");
let btnFiltroNegativo = document.getElementById("btn_negativo");
let sliderBrillo = document.getElementById("brillo");
let btnFiltroBinarizacion = document.getElementById("btn_binarizacion");
let btnFiltroSepia = document.getElementById("btn_sepia");
let btnFiltroBlur = document.getElementById("btn_blur");
let btnFiltroSaturacion = document.getElementById("btn_saturacion");
let a = 255;
let copiaImagen = null;

//Le asigno los eventos a los elementos correspondientes------------------------------------------------------

archivo.addEventListener("change", function(e){ //Cuando se cargue un archivo...
    let reader = new FileReader(); //Creo un objeto para almacenar la imagen ingresada
    reader.readAsDataURL(e.target.files[0]); //Leo el archivo y se lo paso al reader
    reader.addEventListener("load", function(){ //Cuando cargue la imagen...
        insertarImagen(reader);
    });
})

btnDescargarImagen.addEventListener("click", function(){
    descargarImagen();
})

btnRestaurarImagen.addEventListener("click", function(){
    restaurarImagen();
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

sliderBrillo.addEventListener("change", function(){
    aplicarFiltroBrillo();
})

btnFiltroBlur.addEventListener("click", function(){
    aplicarFiltroBlur();
})

btnFiltroSepia.addEventListener("click", function(){
    aplicarFiltroSepia();
})

btnFiltroSaturacion.addEventListener("click", function(){
    aplicarFiltroSaturacion();
})

//Creo las funciones
function permitirDibujar(){
    //Le asigno al canvas distintos eventos para poder dibujar sobre él
    canvas.addEventListener("mousedown", function(e){ //Cuando se hace click dentro del canvas
        //Uso el e para saber donde dio click el usuario en la pantalla dentro del canvas
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

    //Cambio el color, dependiendo si esta borrando o dibujando
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
    copiaImagen = imagen; //Creo una copia
    imagen.addEventListener("load", function (){ //Cuando cargue la imagen...
        //Hago que la imagen se adapte al ancho del canvas
        //Y el alto del canvas se adapte al alto de la imagen
        //Todo eso para no perder el aspecto de la imagen

        //Si la imagen es menos ancha que el canvas... el canvas se achica y toma las medidas de la imagen
        if(imagen.width < width){ 
            canvas.width = imagen.width;
            canvas.height = imagen.height;
            width = canvas.width;
            height = canvas.height;
            dibujarImagen(this, width, height); 
        }else if(imagen.width > width || imagen.height > height){ //Si la imagen es mas grande que el canvas...
            //la imagen se adapta al ancho del canvas y el alto del canvas se adapta al de la imagen
            //Poniendo un limite de altura del canvas de 500px para que no se permite scrollear
            let max_height = 500;
            if(imagen.height > max_height){
                canvas.height = max_height;
                height = canvas.height;
                dibujarImagen(this, width, height);
            }else{
                canvas.height = imagen.height;
                height = canvas.height;
                dibujarImagen(this, width, height);
            }
        }
    });
}

function dibujarImagen(imagen, width, height){
    //Dibujo la imagen en el contexto
    ctx.drawImage(imagen, 0, 0, width, height);
}

function aplicarFiltroEscalaGrises(){
    //Me base en: https://www.youtube.com/watch?v=7jNEvl8KIr0&list=PLr5HJLJH1e4c8HbsyOBXK_J5bwgqebT0a&index=3
    
    let imageData = ctx.getImageData(0, 0, width, height);
    
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            //Obtengo los valores de r, g, b de cada pixel
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            //Saco el promedio entre la suma de los valores de rgb de cada pixel asigno ese valor
            let valor = (r + g + b) / 3;

            //Le asigno el mismo valor a rgb para obtener un tono gris
            setPixel(imageData, x, y, valor, valor, valor, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function aplicarFiltroBrillo(){
    //Me base en: https://www.youtube.com/watch?v=txAY16rquOM

    let imageData = ctx.getImageData(0, 0, width, height);
    
    //Valor que el usuario modifica a travez de un slider. Sera el porcentaje de aumento o decremento del nivel
    //de brillo que se le aplicara a la imagen
    let nivelBrillo = document.getElementById("brillo").value;

    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            //Aumento el brillo de los valores de rgb, multiplicando por el valor que el usuario desee(nivelBrillo)
            let r = parseInt(nivelBrillo * getRed(imageData, x, y));
            let g = parseInt(nivelBrillo * getGreen(imageData, x, y));
            let b = parseInt(nivelBrillo * getBlue(imageData, x, y));

            //Controlo que los valores de r, g, b no sean menores de 0 o mayores de 255
            //Si es menor a 0, se queda en 0. Si es mayor a 255, se queda en 255
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

function aplicarFiltroNegativo(){
    //Me base en: https://www.youtube.com/watch?v=7jNEvl8KIr0&list=PLr5HJLJH1e4c8HbsyOBXK_J5bwgqebT0a&index=3

    let imageData = ctx.getImageData(0, 0, width, height);
    
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            //A cada valor del rgb le asigno su opuesto, que es el valor lo que le falta al valor actual para llegar a 255
            let r = 255 - getRed(imageData, x, y);
            let g = 255 - getGreen(imageData, x, y);
            let b = 255 - getBlue(imageData, x, y);
            
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function aplicarFiltroBinarizacion(){
    //Me base en: https://www.youtube.com/watch?v=7jNEvl8KIr0&list=PLr5HJLJH1e4c8HbsyOBXK_J5bwgqebT0a&index=3
    
    let imageData = ctx.getImageData(0, 0, width, height);
    
    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            //Obtengo los valores de r, g, b de cada pixel
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            //Si la suma de los valores de rgb dividido 3 es menor a 255/3 les asigno 0 y si es mayor les asigno 255
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

function aplicarFiltroSepia(){
    //Me base en: https://www.etnassoft.com/2016/11/03/manipulacion-de-imagenes-con-javascript-parte-1/

    let imageData = ctx.getImageData(0, 0, width, height);

    for(let x=0; x<width; x++){
        for(let y=0; y<height; y++){
            //Obtengo los valores de r, g, b de cada pixel
            let r = getRed(imageData, x, y);
            let g = getGreen(imageData, x, y);
            let b = getBlue(imageData, x, y);

            //Aplico la siguiente formula, que modifica el valor de r, g, b aplicandole el filtro sepia
            let red = (r * .393) + (g * .769) + (b * .189);
            let green = (r * .349) + (g * .686) + (b * .168);
            let blue = (r * .272) + (g * .534) + (b * .131);

            setPixel(imageData, x, y, red, green, blue, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function aplicarFiltroBlur() {
    //Me base en: https://www.youtube.com/watch?v=7jNEvl8KIr0&list=PLr5HJLJH1e4c8HbsyOBXK_J5bwgqebT0a&index=3
    let imageData = ctx.getImageData(0, 0, width, height);

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            //Controlo que este sea un pixel dentro de la matriz y no este en un extremo de la misma
            if (!(x < 1 || y < 1 || x + 1 == width || y + 1 == height)) {
                //Guardo los valores nuevos de r, g, b. Se calculan sacando el promedio de la suma de los 
                //vecinos del pixel
                let r = vecinosRed(imageData, x, y);
                let g = vecinosGreen(imageData, x, y);
                let b = vecinosBlue(imageData, x, y);
                setPixel(imageData, x, y, r, g, b, a);
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
}

function aplicarFiltroSaturacion(){
    //Me base en: https://www.etnassoft.com/2016/11/03/manipulacion-de-imagenes-con-javascript-parte-1/

    let imageData = ctx.getImageData(0, 0, width, height);

    let contraste = 30; //La intensidad con la que se va a aplicar el filtro
    
    //Calculo el factor aplicando la siguiente formula, teniendo en cuenta el contraste creado anteriormente
    let factor = (259 * (contraste + 255)) / (255 * (259 - contraste))
    
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            //Cálculo del valor de cada píxel tras aplicar el factor anterior.
            let r = factor * (getRed(imageData, x, y) - 128) + 128;
            let g = factor * (getGreen(imageData, x, y) - 128) + 128;
            let b = factor * (getBlue(imageData, x, y) - 128) + 128;
            setPixel(imageData, x, y, r, g, b, a);
        }
    }
    ctx.putImageData(imageData, 0, 0);
}


function descargarImagen(){
    //Me base en: https://stackoverflow.com/questions/10673122/how-to-save-canvas-as-an-image-with-canvas-todataurl
    
    let link = document.createElement("a");
    document.body.appendChild(link);

    //Guarda el archivo con un nombre especifico y la carpeta
    link.setAttribute('download', 'imagen.png');
    link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    link.click();
}

function restaurarImagen(){
    //Dibujo la copia de la imagen creada cuando se inserto por primera vez en la funcion insertarImagen()
    
    //Si la imagen es menos alta o ancha que el canvas...
    if((copiaImagen.width < width) || (copiaImagen.height < height)){
        //El canvas toma el valor de la imagen
        width = copiaImagen.width;
        height = copiaImagen.height;
    }
    dibujarImagen(copiaImagen, width, height);
}

function setPixel(imageData, x, y, r, g, b, a){ 
    //Primero obtengo el indice y luego modifico los valores de rgba que vienen por parametro
    let index = (x + y * imageData.width) * 4;
    imageData.data[index + 0] = r;
    imageData.data[index + 1] = g;
    imageData.data[index + 2] = b;
    imageData.data[index + 3] = a;
}

//Obtengo los los valores de rgba de un pixel
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

function getAlpha(imageData, x, y) {
    let index = (x + y * imageData.width) * 4;
    return imageData.data[index + 3];
}

//Sumo los vecinos de un pixel para cada valor de rgb y retorno el promedio. Hago lo mismo para r, g, b
function vecinosRed(imageData, x, y) {
    let v1 = getRed(imageData, x - 1, y - 1);
    let v2 = getRed(imageData, x, y - 1);
    let v3 = getRed(imageData, x + 1, y - 1);
    let v4 = getRed(imageData, x - 1, y);
    let v5 = getRed(imageData, x, y);
    let v6 = getRed(imageData, x + 1, y);
    let v7 = getRed(imageData, x - 1, y + 1);
    let v8 = getRed(imageData, x, y + 1);
    let v9 = getRed(imageData, x + 1, y + 1);
    
    let suma = v1+v2+v3+v4+v5+v6+v7+v8+v9;
    return suma / 9;
}
function vecinosGreen(imageData, x, y) {
    let v1 = getGreen(imageData, x - 1, y - 1);
    let v2 = getGreen(imageData, x, y - 1);
    let v3 = getGreen(imageData, x + 1, y - 1);
    let v4 = getGreen(imageData, x - 1, y);
    let v5 = getGreen(imageData, x, y);
    let v6 = getGreen(imageData, x + 1, y);
    let v7 = getGreen(imageData, x - 1, y + 1);
    let v8 = getGreen(imageData, x, y + 1);
    let v9 = getGreen(imageData, x + 1, y + 1);
    
    let suma = v1+v2+v3+v4+v5+v6+v7+v8+v9;
    return suma / 9;
}
function vecinosBlue(imageData, x, y) {
    let v1 = getBlue(imageData, x - 1, y - 1);
    let v2 = getBlue(imageData, x, y - 1);
    let v3 = getBlue(imageData, x + 1, y - 1);
    let v4 = getBlue(imageData, x - 1, y);
    let v5 = getBlue(imageData, x, y);
    let v6 = getBlue(imageData, x + 1, y);
    let v7 = getBlue(imageData, x - 1, y + 1);
    let v8 = getBlue(imageData, x, y + 1);
    let v9 = getBlue(imageData, x + 1, y + 1);
    
    let suma = v1+v2+v3+v4+v5+v6+v7+v8+v9;
    return suma / 9;
}