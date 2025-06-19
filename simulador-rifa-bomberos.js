const resParametros = document.getElementById("resultado-parametros")
const resResultados = document.getElementById("resultado-resultados")
const visitas = document.getElementById("visitas")
const ganancia = document.getElementById("ganancia")

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
    const ES_ATENDIDO = 0.6
    const ABRE_UN_HOMBRE = 0.8
    const VENTA_HOMBRE = 0.25
    const VENTA_MUJER = 0.15
    const CANT_RIFAS_HOMBRE = [0.1, 0.4, 0.3, 0.2]
    const CANT_RIFAS_MUJER = [0.6, 0.3, 0.1, 0]

    let beneficio = 0
    mostrarResultados()

    // PASO 4: iterar
    for (i = 0; i < visitas; i++) {
        // PASO 1: genero numeros aleatorios
        let randEsAtendido = Math.random()
        let randAbreUnHombre = Math.random()
        let randVenta = Math.random()
        let randCantRifas = Math.random()

        // PASO 2: lo convierto en entrada valida para el sistema
        indexCantRifas = Math.floor(randCantRifas * 4)
            // los demas ya son entradas validas, Math.random() devuelve un numero del intervalo [0, 1),
            // al tratarse de probabilidades los calculos que haremos, es justamente lo que necesitamos

        // PASO 3: lo opero
        if (randEsAtendido < ES_ATENDIDO) { // es atendido
            if (randAbreUnHombre < ABRE_UN_HOMBRE) { // atiende un hombre
                if (randVenta < VENTA_HOMBRE) { // el hombre compra
                    beneficio += CANT_RIFAS_HOMBRE[indexCantRifas]
                }
            }
            else { // atiende una mujer
                if (randVenta < VENTA_MUJER) { // la mujer compra
                    beneficio += CANT_RIFAS_MUJER[indexCantRifas]
                }
            }
        }
        mostrarProgreso(i, beneficio)
        await sleep(5)
    }
}

function mostrarResultados() {
    resParametros.innerText = `Visitas: ${parseInt(visitas.value)}, ganancia por venta: ${parseInt(ganancia.value)}`
}

function mostrarProgreso(iteraciones, beneficio) {
    resResultados.innerText = `Beneficio: ${beneficio.toFixed(2)}, con ${iteraciones + 1} iteraciones`
}