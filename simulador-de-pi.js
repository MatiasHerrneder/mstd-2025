function simularPi(iterations) {
    let pIn = 0;

    // paso 4: itero
    for (let _ = 0; _ < iterations; _++) { 

        // paso 1: genero un numero aleatorio
        let px = Math.random();
        let py = Math.random();

        // paso 2: lo convierto en entrada valida del sistema
        px = px * 2 - 1;
        py = py * 2 - 1;

        // paso 3: lo opero
            distCenter = px*px + py*py;
            if (distCenter <= 1) {
                pIn++;
            }
    }
    
    return 4*(pIn/iterations);
}

function buttonClick() {
    let iterations = parseInt(document.getElementById("iterations").value);
    let pi = simularPi(iterations);
    document.getElementById("resultado").innerHTML = `
    <p><strong>El valor estimado de PI es: </strong> ${pi}</p>
    <p><strong>Numero de iteraciones realizadas: </strong> ${iterations}</p>`;
}