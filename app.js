generarMatriz()

function generarMatriz() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matrizContainer = document.getElementById("matrizContainer");
    const probContainer = document.getElementById("probContainer");
  
    // Guardar los valores anteriores
    const valoresAnteriores = {};
    document.querySelectorAll("input[id^='cell-']").forEach(input => {
      valoresAnteriores[input.id] = input.value;
    });
  
    // Crear nueva tabla
    const table = document.createElement("table");
  
    // Fila encabezado
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th"));
    for (let j = 0; j < cols; j++) {
      const th = document.createElement("th");
      th.textContent = `E${j + 1}`;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
  
    // Cuerpo de la tabla
    for (let i = 0; i < rows; i++) {
      const tr = document.createElement("tr");
  
      const th = document.createElement("th");
      th.textContent = `A${i + 1}`;
      tr.appendChild(th);
  
      for (let j = 0; j < cols; j++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.id = `cell-${i}-${j}`;
        input.value = valoresAnteriores[`cell-${i}-${j}`] ?? "0";
        td.appendChild(input);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  
    matrizContainer.innerHTML = "";
    matrizContainer.appendChild(table);
  
    // --- Probabilidades ---
    // Guardar valores anteriores
    const probAnt = {};
    document.querySelectorAll("input[id^='prob-']").forEach(input => {
      probAnt[input.id] = input.value;
    });
  
    probContainer.innerHTML = "";
    const probLabelRow = document.createElement("div");
    probLabelRow.innerHTML = "Estados: ";
    for (let j = 0; j < cols; j++) {
      const label = document.createElement("label");
      label.textContent = `E${j + 1}: `;
      const input = document.createElement("input");
      input.type = "number";
      input.step = "0.01";
      input.value = probAnt[`prob-${j}`] ?? (1 / cols).toFixed(2);
      input.id = `prob-${j}`;
      label.appendChild(input);
      probLabelRow.appendChild(label);
    }
    probContainer.appendChild(probLabelRow);
  }
  
  
  
function leerMatriz() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matriz = [];

    for (let i = 0; i < rows; i++) {
        const fila = [];
        for (let j = 0; j < cols; j++) {
        const val = parseFloat(document.getElementById(`cell-${i}-${j}`).value);
        fila.push(val);
        }
        matriz.push(fila);
    }
    return matriz;
}
  
function leerProbabilidades() {
    const cols = parseInt(document.getElementById("cols").value);
    const probs = [];

    for (let j = 0; j < cols; j++) {
        const val = parseFloat(document.getElementById(`prob-${j}`).value);
        probs.push(val);
    }
    return probs;
}

function leerHurwicz() {
    return parseFloat(document.getElementById("hw").value)
}
  
function criterioWald(matriz) {
    const minimos = matriz.map(fila => Math.min(...fila));
    const mejor = Math.max(...minimos);
    const index = minimos.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: minimos };
}

function criterioMaximax(matriz) {
    const maximos = matriz.map(fila => Math.max(...fila));
    const mejor = Math.max(...maximos);
    const index = maximos.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: maximos };
}

// function criterioLaplace(matriz) {
//     const promedios = matriz.map(fila => {
//         const suma = fila.reduce((a, b) => a + b, 0);
//         return suma / fila.length;
//     });
//     const mejor = Math.max(...promedios);
//     const index = promedios.indexOf(mejor);
//     return { mejor, accion: index + 1, detalle: promedios };
// }

function criterioHurwicz(matriz, w) {
    console.log(w)
    const hw = matriz.map(fila => w * Math.max(...fila) + (1 - w) * Math.min(...fila));
    console.log(hw)
    const mejor = Math.max(...hw);
    const index = hw.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: hw };
}

function criterioSavage() {
    
}

function criterioValorEsperado(matriz, probs) {
    const esperados = matriz.map(fila =>
        fila.reduce((acc, val, i) => acc + val * probs[i], 0)
    );
    const mejor = Math.max(...esperados);
    const index = esperados.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: esperados };
}

function resolver() {
    const matriz = leerMatriz();
    const probs = leerProbabilidades();
    const w = leerHurwicz();
    const criterio = document.getElementById("criterio").value;
    let resultado = {};

    switch (criterio) {
        case "wald":
            resultado = criterioWald(matriz);
            break;
        case "maximax":
            resultado = criterioMaximax(matriz);
            break;
        // case "laplace":
        //     resultado = criterioLaplace(matriz);
        //     break;
        case "hurwicz":
            resultado = criterioHurwicz(matriz, w);
            break;
        case "valorEsperado":
            resultado = criterioValorEsperado(matriz, probs);
            break;
    }

    document.getElementById("resultado").innerHTML = `
        <p><strong>Mejor acción:</strong> A${resultado.accion}</p>
        <p><strong>Valor:</strong> ${resultado.mejor.toFixed(2)}</p>
        <p><strong>Valores por acción:</strong> ${resultado.detalle.map((v, i) => `A${i + 1}: ${v.toFixed(2)}`).join(" | ")}</p>`
    ;
}

function cambiarCriterio(criterio) {
    if (criterio.value == "hurwicz") {
        document.getElementById("hw-value").style = ""
    }
    else {
        document.getElementById("hw-value").style = "display: none;"
    }
}
  