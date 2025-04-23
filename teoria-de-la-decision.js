generarMatriz()

function generarMatriz() {
    const rows = parseInt(document.getElementById("rows").value);
    const cols = parseInt(document.getElementById("cols").value);
    const matrizContainer = document.getElementById("matrizContainer");
  
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
    for (let i = 0; i < cols; i++) {
      const th = document.createElement("th");
      th.textContent = `N${i + 1}`;
      headerRow.appendChild(th);
    }
    table.appendChild(headerRow);
  
    // Fila probabilidades
    const probRow = document.createElement("tr");
    probRow.id = "fila-probabilidades";
    const th = document.createElement("th");
    th.textContent = `%`;
    probRow.appendChild(th);
    for (let i = 0; i < cols; i++) {
        const td = document.createElement("td");
        const input = document.createElement("input");
        input.type = "number";
        input.id = `prob-${i}`;
        input.value = 1 / cols;
        input.step = 0.01;
        input.max = 1;
        input.min = 0;
        td.appendChild(input);
        probRow.appendChild(td);
    }
    if (document.getElementById("criterio").value != "valorEsperado") { 
        probRow.style = "display: none;";
    }
    table.appendChild(probRow);

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

function esMatrizBeneficios() {
    const tipo = document.querySelector('input[name="tipoMatriz"]:checked').value;
    return tipo === 'beneficio';
}

function leerProbabilidades() {
    const cols = parseInt(document.getElementById("cols").value);
    const probs = [];

    for (let i = 0; i < cols; i++) {
        const val = parseFloat(document.getElementById(`prob-${i}`).value);
        probs.push(val);
    }
    return probs;
}

function leerHurwicz() {
    return parseFloat(document.getElementById("hw").value)
}
  
function criterioWald(matriz) {
    const esBeneficios = esMatrizBeneficios(matriz);
    // Si es beneficios, usamos el mínimo de cada fila; si es costos, el máximo
    const valores = esBeneficios
        ? matriz.map(fila => Math.min(...fila))
        : matriz.map(fila => Math.max(...fila));
    const mejor = esBeneficios
        ? Math.max(...valores)
        : Math.min(...valores);
    const index = valores.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: valores };
}

function criterioMaximax(matriz) {
    const esBeneficios = esMatrizBeneficios(matriz);
    const valores = esBeneficios
        ? matriz.map(fila => Math.max(...fila)) // Beneficios: el mejor de cada fila
        : matriz.map(fila => Math.min(...fila)); // Costos: el menor costo posible
    const mejor = esBeneficios
        ? Math.max(...valores)
        : Math.min(...valores);
    const index = valores.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: valores };
}

function criterioHurwicz(matriz, w) {
    const esBeneficios = esMatrizBeneficios(matriz);
    const hw = matriz.map(fila => {
        const max = Math.max(...fila);
        const min = Math.min(...fila);
        return esBeneficios
            ? w * max + (1 - w) * min
            : w * min + (1 - w) * max;
    });
    const mejor = esBeneficios
        ? Math.max(...hw)
        : Math.min(...hw);
    const index = hw.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: hw };
}

function criterioSavage(matriz) {
    const esBeneficios = esMatrizBeneficios(matriz);
    const extremos_col = [...matriz[0]];
    for (let col = 0; col < matriz[0].length; col++) {
        for (let fila = 0; fila < matriz.length; fila++) {
            if (esBeneficios) {
                if (matriz[fila][col] > extremos_col[col]) {
                    extremos_col[col] = matriz[fila][col];
                }
            } else {
                if (matriz[fila][col] < extremos_col[col]) {
                    extremos_col[col] = matriz[fila][col];
                }
            }
        }
    }
    // Construcción de la matriz de arrepentimientos
    const arrepentimientos = matriz.map((fila, i) =>
        fila.map((valor, j) =>
            esBeneficios
                ? extremos_col[j] - valor
                : valor - extremos_col[j]
        )
    );
    const maximos = arrepentimientos.map(fila => Math.max(...fila));
    const mejor = Math.min(...maximos);
    const index = maximos.indexOf(mejor);
    return { mejor, accion: index + 1, detalle: arrepentimientos };
}

function criterioValorEsperado(matriz, probs) {
    const esBeneficios = esMatrizBeneficios(matriz);
    const probTotal = probs.reduce((acc, val) => acc + val, 0);
    // Valor esperado por fila
    const esperados = matriz.map(fila =>
        fila.reduce((acc, val, i) => acc + val * probs[i], 0)
    );
    // BEIP
    const extremos_col = [...matriz[0]];
    for (let col = 0; col < matriz[0].length; col++) {
        for (let fila = 0; fila < matriz.length; fila++) {
            if (esBeneficios) {
                if (matriz[fila][col] > extremos_col[col]) {
                    extremos_col[col] = matriz[fila][col];
                }
            } else {
                if (matriz[fila][col] < extremos_col[col]) {
                    extremos_col[col] = matriz[fila][col];
                }
            }
        }
    }
    const beip = extremos_col.reduce((acc, col, i) => acc + col * probs[i], 0);
    const mejor = esBeneficios
        ? Math.max(...esperados)
        : Math.min(...esperados);
    const index = esperados.indexOf(mejor);
    // VEIP
    const veip = beip - mejor;
    return {
        mejor,
        accion: index + 1,
        detalle: esperados,
        beip,
        veip,
        error: probTotal !== 1 ? `Las probabilidades suman ${probTotal}` : null
    };
}


function resolver() {
    const matriz = leerMatriz();
    const probs = leerProbabilidades();
    const w = leerHurwicz();
    const criterio = document.getElementById("criterio").value;
    let resultado = {};
    let output = new Map();

    switch (criterio) {
        case "wald":
            resultado = criterioWald(matriz);
            output.set("Mejor acción", resultado.accion);
            output.set("Valor de la accion", resultado.mejor.toFixed(2));
            output.set("Valor por cada acción", resultado.detalle.map((v, i) => `A${i + 1}: ${v.toFixed(2)}`).join(" | "));
            break;
        case "maximax":
            resultado = criterioMaximax(matriz);
            output.set("Mejor acción", resultado.accion);
            output.set("Valor de la accion", resultado.mejor.toFixed(2));
            output.set("Valor por cada acción", resultado.detalle.map((v, i) => `A${i + 1}: ${v.toFixed(2)}`).join(" | "));
            break;
        case "hurwicz":
            resultado = criterioHurwicz(matriz, w);
            output.set("Mejor acción", resultado.accion);
            output.set("Valor de la accion", resultado.mejor.toFixed(2));
            output.set("Valor por cada acción", resultado.detalle.map((v, i) => `A${i + 1}: ${v.toFixed(2)}`).join(" | "));
            output.set("Con w", w);
            break;
        case "savage":
            resultado = criterioSavage(matriz);
            output.set("Mejor acción", resultado.accion);
            output.set("Valor de la accion", resultado.mejor.toFixed(2));
            let tabla = '<div class="no-overflow"><table class="tabla-arrepentimientos"><tr><th></th>\n';
            for (let i = 0; i < resultado.detalle[0].length; i++) {
                tabla += `<th>N${i + 1}</th>\n`;
            }
            tabla += '</tr>\n';
            resultado.detalle.forEach((fila, i) => {
                tabla += `<tr><th>A${i+1}</th>`;
                fila.forEach(celda => {
                  tabla += `<td>${celda}</td>`;
                });
                tabla += '</tr>';
              });
            tabla += '</table></div>';
            output.set("Matriz de arrepentimientos", tabla);
            break;
        case "valorEsperado":
            resultado = criterioValorEsperado(matriz, probs);
            if (resultado.error) {
                output.set("----- ERROR", resultado.error);
                output.set("----- Mostrando igualmente los resultados de esta matriz", "");
            }
            output.set("Mejor acción", resultado.accion);
            output.set("Valor de la accion", resultado.mejor.toFixed(2));
            output.set("Valor por cada acción", resultado.detalle.map((v, i) => `A${i + 1}: ${v.toFixed(2)}`).join(" | "));
            output.set("BEIP", resultado.beip.toFixed(2));
            output.set("VEIP", resultado.veip.toFixed(2));
            break;
    }

    let html = ``;
    for (const [key, value] of output) {
        html += `<p><strong>${key}:</strong> ${value}</p>`;
    }
    document.getElementById("resultado").innerHTML = html;
}

function cambiarCriterio(criterio) {
    if (criterio.value == "hurwicz") {
        document.getElementById("hw-value").style = "";
    }
    else {
        document.getElementById("hw-value").style = "display: none;";
    }
    if (criterio.value == "valorEsperado") {
        document.getElementById("fila-probabilidades").style = "";
    }
    else {
        document.getElementById("fila-probabilidades").style = "display: none;";
    }
}
  
function cambiarTipoMatriz() {
    document.getElementById("matrizName").innerHTML = esMatrizBeneficios() ? "Matriz de beneficios:" : "Matriz de costos:"
}