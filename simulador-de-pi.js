function simularPi(iterations, ctx, canvasSize) {
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
            ctx.fillStyle = 'green';
        }
        else {
            ctx.fillStyle = 'red';
        }

        // dibujar el punto
        let drawX = (px + 1) * canvasSize / 2;
        let drawY = (py + 1) * canvasSize / 2;
        ctx.fillRect(drawX, drawY, 2, 2);
    }
    return 4*(pIn/iterations);
}

function buttonClick() {
    let iterations = parseInt(document.getElementById("iterations").value);
    
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    inicializarCanvas();
    
    let pi = simularPi(iterations, ctx, canvas.width);
    document.getElementById("resultado").innerHTML = `
    <p><strong>El valor estimado de PI es: </strong> ${pi}</p>
    <p><strong>Numero de iteraciones realizadas: </strong> ${iterations}</p>`;
}

function inicializarCanvas() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar círculo
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.stroke();
}


window.onload = inicializarCanvas;