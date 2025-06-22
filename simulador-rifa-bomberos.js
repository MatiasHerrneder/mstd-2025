const resParametros = document.getElementById("resultado-parametros")
const ronda1 = document.getElementById("ronda-1")
const resBeneficio1 = document.getElementById("resultado-beneficio-1")
const resVisitas1 = document.getElementById("resultado-visitas-1")
const reshead1 = document.getElementById("head-ronda-1")
const resAtendidos1 = document.getElementById("resultado-atendidos-1")
const ronda2 = document.getElementById("ronda-2")
const resBeneficio2 = document.getElementById("resultado-beneficio-2")
const resVisitas2 = document.getElementById("resultado-visitas-2")
const reshead2 = document.getElementById("head-ronda-2")
const resAtendidos2 = document.getElementById("resultado-atendidos-2")
const rondaTotal = document.getElementById("total-rondas")
const resBeneficioTotal = document.getElementById("resultado-beneficio-total")
const resVisitasTotal = document.getElementById("resultado-visitas-total")
const resheadTotal = document.getElementById("head-ronda-total")
const resAtendidosTotal = document.getElementById("resultado-atendidos-total")
const visitas = document.getElementById("visitas")
const ganancia = document.getElementById("ganancia")

const ES_ATENDIDO = 0.4
const ABRE_UN_HOMBRE = 0.8
const VENTA_HOMBRE = 0.25
const VENTA_MUJER = 0.15
const CANT_RIFAS_HOMBRE = [0.1, 0.4, 0.3, 0.2]
const CANT_RIFAS_MUJER = [0.6, 0.3, 0.1, 0]

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

    [...ronda1.children].forEach(hijo => hijo.innerText = "");
    [...ronda2.children].forEach(hijo => hijo.innerText = "");
    [...rondaTotal.children].forEach(hijo => hijo.innerText = "");

    simulacionEncurso = true

    mostrarParametros(visitas, ganancia)

    resultado_ronda_1 = await ejecutarRonda(visitas, ganancia, 1)
    resultado_ronda_2 = await ejecutarRonda(visitas - resultado_ronda_1.visitados, ganancia, 2)

    mostrarResultados(
        resultado_ronda_1.beneficio + resultado_ronda_2.beneficio, 
        resultado_ronda_1.visitas + resultado_ronda_2.visitas,
        resultado_ronda_1.visitados + resultado_ronda_2.visitados, 
    )

    simulacionEncurso = false
}

async function ejecutarRonda(visitas, ganancia, ronda) {
    const duracionRonda = 3000
    const tiempoInicio = performance.now()
    let visitados = 0
    let beneficio = 0
    
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
            visitados++
            if (randAbreUnHombre < ABRE_UN_HOMBRE) { // atiende un hombre
                if (randVenta < VENTA_HOMBRE) { // el hombre compra
                    beneficio += ((obtenerIndicePorProbabilidad(CANT_RIFAS_HOMBRE, randCantRifas) + 1) * ganancia)
                }
            }
            else { // atiende una mujer
                if (randVenta < VENTA_MUJER) { // la mujer compra
                    beneficio += ((obtenerIndicePorProbabilidad(CANT_RIFAS_MUJER, randCantRifas) + 1) * ganancia)
                }
            }
        }
        
        mostrarProgreso(i, beneficio, visitados, ronda)
        
        let tiempoEsperado = tiempoInicio + ((i + 1) * duracionRonda / visitas)
        let tiempoActual = performance.now()
        let tiempoRestante = tiempoEsperado - tiempoActual
        if (tiempoRestante > 0) {
            await sleep(tiempoRestante)
        }
    }
    return { visitados, beneficio, visitas }
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

function mostrarProgreso(iteraciones, beneficio, atendidos, ronda) {
    if (ronda === 1) {
        reshead1.innerText = `Ronda de visitas 1:`;
        resBeneficio1.innerText = `Beneficio: $${beneficio.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
        resVisitas1.innerText = `Visitas: ${iteraciones + 1}`
        resAtendidos1.innerText = `Veces atendidos: ${atendidos}`
    }
    else if (ronda === 2) {
        reshead2.innerText = `Ronda de visitas 2:`;
        resBeneficio2.innerText = `Beneficio: $${beneficio.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
        resVisitas2.innerText = `Visitas: ${iteraciones + 1}`
        resAtendidos2.innerText = `Veces atendidos: ${atendidos}`
    }
}

function mostrarResultados(beneficio, iteraciones, atendidos) {
    resheadTotal.innerText = `Resultados finales:`;
    resBeneficioTotal.innerText = `Beneficio: $${beneficio.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
    resVisitasTotal.innerText = `Visitas: ${iteraciones}`
    resAtendidosTotal.innerText = `Veces atendidos: ${atendidos}`
}