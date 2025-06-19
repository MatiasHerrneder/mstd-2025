const resParametros = document.getElementById("resultado-parametros")
const resBeneficio = document.getElementById("resultado-beneficio")
const resVisitas = document.getElementById("resultado-visitas")
const visitas = document.getElementById("visitas")
const ganancia = document.getElementById("ganancia")

let simulacionEncurso = false

function simular1(){
    simular(1000, 2000)
}

function simular2() {
    simular(2000, 1900)
}

function simularN() {
    simular(parseInt(visitas.value), parseInt(ganancia.value))
}

async function simular(visitas, ganancia) {
    if (simulacionEncurso) {
        alert("Hay una simulacion en curso")
        return
    }
    simulacionEncurso = true
    const ES_ATENDIDO = 0.6
    const ABRE_UN_HOMBRE = 0.8
    const VENTA_HOMBRE = 0.25
    const VENTA_MUJER = 0.15
    const CANT_RIFAS_HOMBRE = [0.1, 0.4, 0.3, 0.2]
    const CANT_RIFAS_MUJER = [0.6, 0.3, 0.1, 0]

    let beneficio = 0
    mostrarParametros(visitas, ganancia)

    const duracionTotal = 3000
    const tiempoInicio = performance.now()

    // PASO 4: iterar
    for (i = 0; i < visitas; i++) {
        // PASO 1: genero numeros aleatorios
        let randEsAtendido = Math.random()
        let randAbreUnHombre = Math.random()
        let randVenta = Math.random()
        let randCantRifas = Math.random()

        // PASO 2: lo convierto en entrada valida para el sistema
            // los numeros ya son entradas validas, Math.random() devuelve un numero del intervalo [0, 1),
            // al tratarse de probabilidades los calculos que haremos, es justamente lo que necesitamos

        // PASO 3: lo opero
        if (randEsAtendido < ES_ATENDIDO) { // es atendido
            if (randAbreUnHombre < ABRE_UN_HOMBRE) { // atiende un hombre
                if (randVenta < VENTA_HOMBRE) { // el hombre compra
                    beneficio += CANT_RIFAS_HOMBRE[obtenerIndicePorProbabilidad(CANT_RIFAS_HOMBRE, randCantRifas)] * beneficio
                }
            }
            else { // atiende una mujer
                if (randVenta < VENTA_MUJER) { // la mujer compra
                    beneficio += CANT_RIFAS_MUJER[obtenerIndicePorProbabilidad(CANT_RIFAS_MUJER, randCantRifas)] * beneficio
                }
            }
        }
        mostrarProgreso(i, beneficio)
        let tiempoEsperado = tiempoInicio + ((i + 1) * duracionTotal / visitas)
        let tiempoActual = performance.now()
        let tiempoRestante = tiempoEsperado - tiempoActual
        if (tiempoRestante > 0) {
            await sleep(tiempoRestante)
        }
    }
    simulacionEncurso = false
}

function obtenerIndicePorProbabilidad(probabilidades, numeroAleatorio) {
    let acumulado = 0;
    for (let i = 0; i < probabilidades.length; i++) {
        acumulado += probabilidades[i];
        if (numeroAleatorio < acumulado) {
            return i;
        }
        }
    // Por seguridad, si el númeroAleatorio es muy cercano a 1 y hay redondeo
    return probabilidades.length - 1;
}


function mostrarParametros(visitas, ganancia) {
    resParametros.innerText = `Visitas: ${visitas}, ganancia por venta: $${ganancia}`
}

function mostrarProgreso(iteraciones, beneficio) {
    resBeneficio.innerText = `Beneficio: $${beneficio.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
    resVisitas.innerText = `Visitas: ${iteraciones + 1}`
}