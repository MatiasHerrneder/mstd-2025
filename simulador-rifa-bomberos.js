function simular1(){
    simular(1000, 2000)
}

function simular2() {
    simular(2000, 1900)
}

function simularN() {
    const visitas = parseInt(document.getElementById("visitas").value)
    const ganancia = parseInt(document.getElementById("ganancia").value)
    simular(visitas, ganancia)
}

function simular(visitas, ganancia) {
    const boxResultado = document.getElementById("resultado")
    const p = document.createElement("p")
    p.innerText = `visitas: ${visitas}, ganancia por venta: ${ganancia}`
    boxResultado.innerHTML = "";
    boxResultado.appendChild(p)
}