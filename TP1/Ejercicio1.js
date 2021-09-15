console.log("Nico");
let matriz = new Array()

function llenarMatriz(){
    for(let x=0; x<5; x++){
        matriz[x] = new Array()
        for(let y=0; y<5; y++){
            let num = Math.floor((Math.random() * 100) + 1)
            matriz[x][y] = num;
        }
    }
}

function imprimirMatriz(){
    for(let x=0; x<5; x++){
        let fila = "";
        for(let y=0; y<5; y++){
            fila += matriz[x][y] + " | ";
        }
        console.log(fila);
    }
}

llenarMatriz();
imprimirMatriz();

function valorMaximoMatriz(){
    let valorMaximo = 0;
    for(let x=0; x<5; x++){
        for(let y=0; y<5; y++){
            if(matriz[x][y] > valorMaximo){
                valorMaximo = matriz[x][y];
            }
        }
    }
    return valorMaximo;
}

console.log("El numero mas grande de la matriz es: "+ valorMaximoMatriz());

function maximoFilasPares(){
    let valorMaximo = 0;
    for(let x=0; x<5; x++){
        for(let y=0; y<5; y++){
            if((x%2==0)&&(matriz[x][y] > valorMaximo)){
                valorMaximo = matriz[x][y];
            }
        }
    }
    return valorMaximo;
}

console.log("El numero mas grande entre las filas pares es: "+maximoFilasPares());

function minimoFilasImpares(){
    let valorMinimo = 100;
    for(let x=0; x<5; x++){
        for(let y=0; y<5; y++){
            if((x%2!=0)&&(matriz[x][y] < valorMinimo)){
                valorMinimo = matriz[x][y];
            }
        }
    }
    return valorMinimo;
}

console.log("El numero mas chico entre las filas impares es: "+minimoFilasImpares());

function promediosPorFila(){
    let promedios = [];
    let suma = 0;
    let promedio = 0;
    for(let x=0; x<5; x++){
        for(let y=0; y<5; y++){
            suma += matriz[x][y];
        }
        promedio = suma / 5;
        promedios.push(promedio);
        suma = 0;
    }
    console.log("Los promedios son: ");
    for(let i=0; i<promedios.length; i++){
        console.log("Fila "+ i + " : " + promedios[i]);
    }
}

promediosPorFila();













