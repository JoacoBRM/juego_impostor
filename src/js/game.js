let numJugadores = 5;
let nombresJugadores = [];
let categorias = [];
let tematicasSeleccionadas = [];
let palabraSeleccionada = '';
let pistaSeleccionada = '';
let impostoresIndices = [];
let jugadorActualIndex = 0;
let palabraVisible = false;
let incluirPistas = true;
let numImpostores = 1;

// Variables para la ruleta y orden de participación
let ordenParticipacion = [];
let jugadoresRestantes = [];
let turnoActual = 0;
let rondaActual = 1;
const TOTAL_RONDAS = 2;
let ruletaGirando = false;

// Variables para el sistema de votación
let jugadoresVivos = [];
let jugadoresEliminados = [];
let juegoTerminado = false;

// Variables para el temporizador
let intervaloTemporizador = null;
let tiempoRestante = 5;

// Cargar categorías desde el JSON local
async function cargarCategorias() {
    try {
        const response = await fetch('src/data/game_data.json');
        categorias = await response.json();
    } catch (error) {
        console.error('Error al cargar las categorías:', error);
        categorias = [];
    }
}

// Actualizar el valor mostrado del slider
function actualizarValor(valor) {
    document.getElementById('sliderValue').textContent = valor;
    actualizarInfoImpostores(parseInt(valor));
}

// Actualizar información de impostores según número de jugadores
function actualizarInfoImpostores(numJug) {
    const infoElement = document.getElementById('infoImpostores');
    let mensaje = '';

    if (numJug >= 3 && numJug <= 5) {
        mensaje = `Con ${numJug} jugadores puedes usar hasta 1 impostor`;
    } else if (numJug >= 6 && numJug <= 8) {
        mensaje = `Con ${numJug} jugadores puedes usar hasta 2 impostores`;
    } else if (numJug >= 9) {
        mensaje = `Con ${numJug} jugadores puedes usar hasta 3 impostores`;
    }

    infoElement.textContent = mensaje;
}

// Seleccionar número de impostores
function seleccionarNumImpostores(valor) {
    const maxImpostores = Math.max(1, Math.floor(numJugadores / 2) - 1);

    if (valor > maxImpostores) {
        alert(`El número máximo de impostores para ${numJugadores} jugadores es ${maxImpostores}`);
        return;
    }

    numImpostores = valor;

    // Actualizar botones activos
    document.querySelectorAll('.btn-impostor').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.getAttribute('data-value')) === valor) {
            btn.classList.add('active');
        }
    });
}

// Mostrar un paso específico
function mostrarPaso(numPaso) {
    document.querySelectorAll('.paso-config').forEach(paso => {
        paso.classList.remove('active');
    });
    document.getElementById(`paso${numPaso}`).classList.add('active');
}

// Paso 1 a Paso 2
function irAPaso2() {
    numJugadores = parseInt(document.getElementById('numJugadores').value);

    // Generar campos de entrada para los nombres
    const container = document.getElementById('nombresContainer');
    container.innerHTML = '';

    for (let i = 1; i <= numJugadores; i++) {
        const div = document.createElement('div');
        div.className = 'nombre-input-group';
        div.innerHTML = `
            <label for="jugador${i}">Jugador ${i}:</label>
            <input type="text" id="jugador${i}" placeholder="Nombre del jugador ${i}" value="${nombresJugadores[i - 1] || ''}">
        `;
        container.appendChild(div);
    }

    mostrarPaso(2);
}

// Volver al Paso 1
function volverAPaso1() {
    mostrarPaso(1);
}

// Paso 2 a Paso 3
async function irAPaso3() {
    nombresJugadores = [];

    for (let i = 1; i <= numJugadores; i++) {
        const nombre = document.getElementById(`jugador${i}`).value.trim();
        // Si el nombre está vacío, usar nombre predeterminado
        if (nombre === '') {
            nombresJugadores.push(`Jugador ${i}`);
        } else {
            nombresJugadores.push(nombre);
        }
    }

    // Cargar categorías si no se han cargado
    if (categorias.length === 0) {
        await cargarCategorias();
    }

    // Actualizar botones de impostores disponibles según número de jugadores
    actualizarBotonesImpostores();

    // Crear las tarjetas de temáticas
    crearTarjetasTematicas();

    mostrarPaso(3);
}

// Actualizar disponibilidad de botones de impostores
function actualizarBotonesImpostores() {
    const maxImpostores = Math.max(1, Math.floor(numJugadores / 2) - 1);
    const botones = document.querySelectorAll('.btn-impostor');

    botones.forEach(btn => {
        const valor = parseInt(btn.getAttribute('data-value'));
        if (valor > maxImpostores) {
            btn.disabled = true;
            btn.style.opacity = '0.3';
            btn.style.cursor = 'not-allowed';
        } else {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.style.cursor = 'pointer';
        }

        // Resetear selección si es inválida
        if (btn.classList.contains('active') && valor > maxImpostores) {
            btn.classList.remove('active');
            numImpostores = 1;
            document.querySelector('.btn-impostor[data-value="1"]').classList.add('active');
        }
    });
}

// Volver al Paso 2
function volverAPaso2() {
    mostrarPaso(2);
}

// Crear las tarjetas de temáticas
function crearTarjetasTematicas() {
    const container = document.getElementById('tematicasContainer');
    container.innerHTML = '';

    // --- INICIO DEL CAMBIO: Agregar tarjeta Aleatorio ---
    const cardRandom = document.createElement('div');
    cardRandom.className = 'tematica-card';
    cardRandom.setAttribute('data-category', 'Aleatorio');

    cardRandom.innerHTML = `
        <div class="tematica-emoji">🎲</div>
        <div class="tematica-nombre">Aleatorio</div>
        <div class="tematica-check">✓</div>
    `;

    // Usamos la misma función toggleTematica
    cardRandom.onclick = () => toggleTematica('Aleatorio', cardRandom);
    container.appendChild(cardRandom);

    categorias.forEach((categoria, index) => {
        const card = document.createElement('div');
        card.className = 'tematica-card';
        card.setAttribute('data-category', categoria.category);

        // Seleccionar un emoji representativo según la categoría
        const emojis = {
            'Frutas': '🍎',
            'Profesiones': '👨‍⚕️',
            'Lugares': '🏖️',
            'Animales': '🐶',
            'Deportes': '⚽',
            'Colores': '🎨',
            'Países': '🌍',
            'Paises': '🌎',
            'Cosas': '💡',
            'Comida Rápida': '🍕',
            'Comida rapida': '🍔',
            'Ecuatorianos': '🇪🇨',
            'Superhéroes': '🦸',
            'Videojuegos': '🎮',
            'Películas': '🎬',
            'Música': '🎵',
            'Medios de Transporte': '🚗'
        };
        const emoji = emojis[categoria.category] || '📋';

        card.innerHTML = `
            <div class="tematica-emoji">${emoji}</div>
            <div class="tematica-nombre">${categoria.category}</div>
            <div class="tematica-check">✓</div>
        `;

        card.onclick = () => toggleTematica(categoria.category, card);
        container.appendChild(card);
    });
}

// Alternar selección de temática
function toggleTematica(category, card) {
    const index = tematicasSeleccionadas.indexOf(category);

    if (index > -1) {
        // Deseleccionar
        tematicasSeleccionadas.splice(index, 1);
        card.classList.remove('selected');
    } else {
        // Seleccionar
        tematicasSeleccionadas.push(category);
        card.classList.add('selected');
    }
}

// Iniciar el juego
function iniciarJuego() {
    if (tematicasSeleccionadas.length === 0) {
        alert('Por favor selecciona al menos una temática');
        return;
    }

    // Obtener configuración
    incluirPistas = document.getElementById('incluirPistas').checked;

    // Validar número de impostores
    const maxImpostores = Math.max(1, Math.floor(numJugadores / 2) - 1);
    if (numImpostores > maxImpostores) {
        alert(`El número máximo de impostores para ${numJugadores} jugadores es ${maxImpostores}`);
        return;
    }

    // Seleccionar una palabra aleatoria de las categorías seleccionadas
    seleccionarPalabraAleatoria();

    // Seleccionar impostores aleatorios
    seleccionarImpostores();

    // Reiniciar el índice del jugador actual
    jugadorActualIndex = 0;
    palabraVisible = false;

    console.log('Palabra seleccionada:', palabraSeleccionada);
    console.log('Pista seleccionada:', pistaSeleccionada);
    console.log('Impostores:', impostoresIndices.map(i => nombresJugadores[i]));
    console.log('Incluir pistas:', incluirPistas);

    // Mostrar el primer jugador
    mostrarTurnoJugador();
    mostrarPaso(4);
}

// Seleccionar impostores aleatorios
function seleccionarImpostores() {
    impostoresIndices = [];
    const indicesDisponibles = Array.from({ length: numJugadores }, (_, i) => i);

    for (let i = 0; i < numImpostores; i++) {
        const randomIndex = Math.floor(Math.random() * indicesDisponibles.length);
        impostoresIndices.push(indicesDisponibles[randomIndex]);
        indicesDisponibles.splice(randomIndex, 1);
    }
}

// Seleccionar una palabra aleatoria de las categorías seleccionadas
function seleccionarPalabraAleatoria() {
    let categoriasDisponibles;

    // --- INICIO DEL CAMBIO ---
    // Si se seleccionó "Aleatorio", usamos TODAS las categorías
    if (tematicasSeleccionadas.includes('Aleatorio')) {
        categoriasDisponibles = categorias;
    } else {
        // Si no, usamos solo las seleccionadas (comportamiento original)
        categoriasDisponibles = categorias.filter(cat =>
            tematicasSeleccionadas.includes(cat.category)
        );
    }
    // --- FIN DEL CAMBIO ---

    // Validación de seguridad (por si acaso)
    if (categoriasDisponibles.length === 0) {
        console.error("No hay categorías disponibles");
        return;
    }

    // Seleccionar una categoría aleatoria
    const categoriaAleatoria = categoriasDisponibles[
        Math.floor(Math.random() * categoriasDisponibles.length)
    ];

    // Seleccionar una palabra aleatoria de esa categoría
    const palabraObj = categoriaAleatoria.words[
        Math.floor(Math.random() * categoriaAleatoria.words.length)
    ];

    // Verificar si es el formato nuevo (objeto) o antiguo (string)
    if (typeof palabraObj === 'object') {
        palabraSeleccionada = palabraObj.name;
        // Seleccionar una pista aleatoria
        if (palabraObj.clues && palabraObj.clues.length > 0) {
            pistaSeleccionada = palabraObj.clues[
                Math.floor(Math.random() * palabraObj.clues.length)
            ];
        } else {
            pistaSeleccionada = 'Sin pista disponible';
        }
    } else {
        palabraSeleccionada = palabraObj;
        pistaSeleccionada = 'Sin pista disponible';
    }
}

// Mostrar el turno del jugador actual
function mostrarTurnoJugador() {
    const nombreJugador = nombresJugadores[jugadorActualIndex];
    document.getElementById('turnoJugador').textContent = `Turno de ${nombreJugador}`;

    // Ocultar la palabra y resetear el botón
    palabraVisible = false;
    document.getElementById('palabraContenido').textContent = '?';
    document.getElementById('palabraContenido').className = 'palabra-oculta';
    document.getElementById('btnMostrar').innerHTML = '<span id="iconoOjo">👁️</span> Mostrar Palabra';
}

// Alternar visibilidad de la palabra
function togglePalabra() {
    const contenido = document.getElementById('palabraContenido');
    const btn = document.getElementById('btnMostrar');

    if (palabraVisible) {
        // Ocultar palabra y mostrar popup con temporizador
        contenido.textContent = '?';
        contenido.className = 'palabra-oculta';
        btn.innerHTML = '<span id="iconoOjo">👁️</span> Mostrar Palabra';
        palabraVisible = false;
        
        // Mostrar popup y comenzar temporizador
        mostrarPopupTemporizador();
    } else {
        // Mostrar
        const esImpostor = impostoresIndices.includes(jugadorActualIndex);

        if (esImpostor) {
            if (incluirPistas) {
                contenido.innerHTML = `<div class="impostor-header">IMPOSTOR</div><div class="pista-texto">Pista: ${pistaSeleccionada}</div>`;
                contenido.className = 'palabra-impostor-con-pista';
            } else {
                contenido.textContent = 'IMPOSTOR';
                contenido.className = 'palabra-impostor';
            }
        } else {
            contenido.textContent = palabraSeleccionada;
            contenido.className = 'palabra-visible';
        }
        btn.innerHTML = '<span id="iconoOjo">🙈</span> Ocultar Palabra';
        palabraVisible = true;
    }
}

// Mostrar popup con temporizador
function mostrarPopupTemporizador() {
    const popup = document.getElementById('popupTemporizador');
    popup.classList.add('active');
    
    // Reiniciar tiempo
    tiempoRestante = 5;
    document.getElementById('contadorTemporizador').textContent = tiempoRestante;
    
    // Limpiar intervalo anterior si existe
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
    }
    
    // Iniciar cuenta regresiva
    intervaloTemporizador = setInterval(() => {
        tiempoRestante--;
        document.getElementById('contadorTemporizador').textContent = tiempoRestante;
        
        if (tiempoRestante <= 0) {
            clearInterval(intervaloTemporizador);
            cerrarPopupYSiguiente();
        }
    }, 1000);
}

// Cerrar popup y pasar al siguiente jugador
function cerrarPopupYSiguiente() {
    const popup = document.getElementById('popupTemporizador');
    popup.classList.remove('active');
    
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
    
    siguienteJugador();
}

// Volver a ver la palabra desde el popup
function volverAVerPalabra() {
    // Cerrar popup
    const popup = document.getElementById('popupTemporizador');
    popup.classList.remove('active');
    
    // Detener temporizador
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }
    
    // Mostrar la palabra automáticamente
    palabraVisible = false; // Resetear estado
    togglePalabra(); // Llamar para mostrar
}

// Saltar temporizador y pasar al siguiente
function saltarTemporizador() {
    cerrarPopupYSiguiente();
}

// Pasar al siguiente jugador
function siguienteJugador() {
    // Agregar animación de salida
    const header = document.getElementById('turnoJugador');
    const contenedor = document.getElementById('contenedorReveal');
    
    header.classList.add('slide-out');
    contenedor.classList.add('slide-out');
    
    // Esperar a que termine la animación antes de cambiar
    setTimeout(() => {
        jugadorActualIndex++;

        if (jugadorActualIndex >= numJugadores) {
            empezarJuego();
        } else {
            // Remover clases de animación de salida
            header.classList.remove('slide-out');
            contenedor.classList.remove('slide-out');
            
            // Mostrar nuevo jugador (las animaciones de entrada están en el CSS)
            mostrarTurnoJugador();
        }
    }, 400); // Duración de la animación de salida
}

// Empezar el juego - ir a la ruleta
function empezarJuego() {
    console.log('¡El juego ha comenzado!');
    // Inicializar ruleta
    inicializarRuleta();
    mostrarPaso(5);
}

// Volver al inicio
function volverAlInicio() {
    window.location.href = 'index.html';
}

// ===== FUNCIONES DE RULETA Y ORDEN =====

// Inicializar la ruleta
function inicializarRuleta() {
    ordenParticipacion = [];
    jugadoresRestantes = [...Array(numJugadores).keys()]; // [0, 1, 2, ...]
    ruletaGirando = false; // Resetear estado de la ruleta
    document.getElementById('listaOrden').innerHTML = '';
    document.getElementById('ruletaNombre').textContent = '?';
    document.getElementById('btnGirarRuleta').style.display = 'inline-block';
    document.getElementById('btnGirarRuleta').disabled = false; // Habilitar el botón
    document.getElementById('btnContinuarJuego').style.display = 'none';
}

// Girar la ruleta (Modificado: Un solo tiro define todo)
function girarRuleta() {
    // Si ya está girando o ya tenemos el orden, no hacer nada
    if (ruletaGirando || ordenParticipacion.length > 0) return;

    ruletaGirando = true;
    document.getElementById('btnGirarRuleta').disabled = true;

    const display = document.getElementById('ruletaNombre');
    let contadorGiros = 0;
    const maxGiros = 15; // Duración de la animación
    const intervalo = 80; // Velocidad

    // Animación visual antes de mostrar el resultado final
    const intervaloRuleta = setInterval(() => {
        // Muestra nombres al azar solo para el efecto visual
        const nombreAleatorio = nombresJugadores[Math.floor(Math.random() * nombresJugadores.length)];
        display.textContent = nombreAleatorio;

        // Efecto de "latido" visual
        display.style.transform = 'scale(1.1)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 40);

        contadorGiros++;

        if (contadorGiros >= maxGiros) {
            clearInterval(intervaloRuleta);
            generarOrdenCompleto(); // Llamamos a la nueva función
        }
    }, intervalo);
}

// Nueva función: Genera el orden de TODOS los jugadores de una vez
function generarOrdenCompleto() {
    const display = document.getElementById('ruletaNombre');

    // 1. Crear lista de índices [0, 1, 2...]
    let indices = Array.from({ length: numJugadores }, (_, i) => i);

    // 2. Mezclar aleatoriamente (Algoritmo Fisher-Yates)
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Asignamos el orden mezclado directamente
    ordenParticipacion = indices;

    // 3. Mostrar mensaje de éxito en la ruleta
    display.textContent = "¡Orden Listo!";
    display.classList.add('seleccionado'); // Color verde/cian (según tu CSS)

    // 4. Mostrar la lista completa en la pantalla
    actualizarListaOrden();

    // 5. Cambiar botones inmediatamente
    ruletaGirando = false;
    document.getElementById('btnGirarRuleta').style.display = 'none';
    document.getElementById('btnContinuarJuego').style.display = 'inline-block';

    // Quitar el efecto de resaltado después de un momento
    setTimeout(() => {
        display.classList.remove('seleccionado');
    }, 1500);
}// En src/js/game.js

// Actualizar la lista visual del orden
function actualizarListaOrden() {
    const lista = document.getElementById('listaOrden');
    lista.innerHTML = '<h4>Orden establecido:</h4>';

    ordenParticipacion.forEach((jugadorIndex, posicion) => {
        const item = document.createElement('div');
        item.className = 'orden-item';
        item.innerHTML = `<span class="orden-numero">${posicion + 1}.</span> <span class="orden-nombre">${nombresJugadores[jugadorIndex]}</span>`;
        lista.appendChild(item);
    });
}

// Continuar al juego después de la ruleta
function continuarAlJuego() {
    turnoActual = 0;
    rondaActual = 1;

    // Inicializar jugadores vivos (todos al inicio)
    jugadoresVivos = Array.from({ length: numJugadores }, (_, i) => i);
    jugadoresEliminados = [];
    juegoTerminado = false;

    mostrarTurnoActual();
    mostrarPaso(6);
}

// Mostrar el turno actual
function mostrarTurnoActual() {
    const jugadorIndex = ordenParticipacion[turnoActual];
    document.getElementById('nombreTurnoActual').textContent = nombresJugadores[jugadorIndex];
    document.getElementById('numeroTurno').textContent = turnoActual + 1;
    // Usar el número de jugadores vivos en lugar del total
    const totalJugadoresActivos = ordenParticipacion.length;
    document.getElementById('totalTurnos').textContent = totalJugadoresActivos;
    document.getElementById('rondaActual').textContent = rondaActual;

    // Actualizar lista de participación con el turno actual resaltado
    actualizarListaParticipacion();

    // Mostrar/ocultar botones según el estado
    if (rondaActual >= TOTAL_RONDAS && turnoActual >= totalJugadoresActivos - 1) {
        document.getElementById('btnSiguienteTurno').style.display = 'none';
        document.getElementById('btnEmpezarVotacion').style.display = 'inline-block';
    } else {
        document.getElementById('btnSiguienteTurno').style.display = 'inline-block';
        document.getElementById('btnEmpezarVotacion').style.display = 'none';
    }
}

// Actualizar la lista de participación con indicador del turno actual
function actualizarListaParticipacion() {
    const lista = document.getElementById('ordenParticipacion');
    lista.innerHTML = '';

    ordenParticipacion.forEach((jugadorIndex, posicion) => {
        const item = document.createElement('div');
        item.className = 'participacion-item';
        if (posicion === turnoActual) {
            item.classList.add('activo');
        }
        item.innerHTML = `<span class="participacion-numero">${posicion + 1}.</span> <span class="participacion-nombre">${nombresJugadores[jugadorIndex]}</span>`;
        lista.appendChild(item);
    });
}

// Siguiente turno
function siguienteTurno() {
    turnoActual++;

    const totalJugadoresActivos = ordenParticipacion.length;

    if (turnoActual >= totalJugadoresActivos) {
        // Termina la ronda
        turnoActual = 0;
        rondaActual++;

        if (rondaActual <= TOTAL_RONDAS) {
            // Mostrar que comienza nueva ronda
            mostrarTurnoActual();
        }
    } else {
        mostrarTurnoActual();
    }
}

// Finalizar el juego
function finalizarJuego() {
    if (confirm('¿Deseas volver al inicio?')) {
        volverAlInicio();
    }
}

// Volver a jugar manteniendo jugadores y nombres
function volverAJugar() {
    // Resetear selecciones de temáticas
    tematicasSeleccionadas = [];
    document.querySelectorAll('.tematica-card').forEach(card => {
        card.classList.remove('selected');
    });

    // Resetear configuración de pistas
    document.getElementById('incluirPistas').checked = true;
    incluirPistas = true;

    // Resetear variables de juego
    jugadorActualIndex = 0;
    palabraVisible = false;
    palabraSeleccionada = '';
    pistaSeleccionada = '';
    impostoresIndices = [];

    // Resetear variables de votación
    jugadoresVivos = [];
    jugadoresEliminados = [];
    juegoTerminado = false;
    turnoActual = 0;
    rondaActual = 1;
    
    // Resetear variables de ruleta
    ordenParticipacion = [];
    jugadoresRestantes = [];
    ruletaGirando = false;

    // Cerrar popup si está abierto
    const popup = document.getElementById('popupTemporizador');
    if (popup) {
        popup.classList.remove('active');
    }
    
    // Detener temporizador si está corriendo
    if (intervaloTemporizador) {
        clearInterval(intervaloTemporizador);
        intervaloTemporizador = null;
    }

    // Limpiar clases de animación del paso 4
    const header = document.getElementById('turnoJugador');
    const contenedor = document.getElementById('contenedorReveal');
    const palabraContenido = document.getElementById('palabraContenido');
    const btnMostrar = document.getElementById('btnMostrar');
    
    if (header) {
        header.classList.remove('slide-out', 'slide-in');
    }
    if (contenedor) {
        contenedor.classList.remove('slide-out', 'slide-in');
    }
    if (palabraContenido) {
        palabraContenido.textContent = '?';
        palabraContenido.className = 'palabra-oculta';
    }
    if (btnMostrar) {
        btnMostrar.innerHTML = '<span id="iconoOjo">👁️</span> Mostrar Palabra';
    }

    // Actualizar botones de impostores según el número de jugadores actual
    actualizarBotonesImpostores();

    // Crear nuevamente las tarjetas de temáticas (por si se cargaron nuevas)
    crearTarjetasTematicas();

    // Volver al paso 3 (selección de temáticas)
    mostrarPaso(3);
}

// ===== SISTEMA DE VOTACIÓN =====

// Empezar la votación
function empezarVotacion() {
    // Asegurarse de que el grid esté visible
    document.getElementById('jugadoresVotacion').style.display = 'grid';
    mostrarJugadoresParaVotar();
    mostrarPaso(7);
}

// Mostrar jugadores disponibles para votar
function mostrarJugadoresParaVotar() {
    const container = document.getElementById('jugadoresVotacion');
    container.innerHTML = '';
    container.style.display = 'grid';

    // Ocultar resultado anterior
    document.getElementById('resultadoVotacion').style.display = 'none';
    document.getElementById('botonesVotacion').style.display = 'none';
    document.getElementById('botonesFinales').style.display = 'none';

    // Mostrar solo jugadores vivos
    jugadoresVivos.forEach(jugadorIndex => {
        const card = document.createElement('div');
        card.className = 'jugador-votacion-card';

        // Todos los jugadores tienen el mismo icono de interrogación
        const emoji = '❓';

        card.innerHTML = `
            <div class="jugador-emoji">${emoji}</div>
            <div class="jugador-nombre-votacion">${nombresJugadores[jugadorIndex]}</div>
        `;

        card.onclick = () => votarJugador(jugadorIndex);
        container.appendChild(card);
    });
}

// Votar para eliminar a un jugador
function votarJugador(jugadorIndex) {
    // Eliminar al jugador de los vivos
    jugadoresVivos = jugadoresVivos.filter(i => i !== jugadorIndex);
    jugadoresEliminados.push(jugadorIndex);

    // Verificar si es impostor
    const esImpostor = impostoresIndices.includes(jugadorIndex);

    // Mostrar resultado
    mostrarResultadoVotacion(jugadorIndex, esImpostor);

    // Verificar condiciones de victoria/derrota
    verificarEstadoJuego();
}

// Mostrar resultado de la votación
function mostrarResultadoVotacion(jugadorIndex, esImpostor) {
    const resultadoDiv = document.getElementById('resultadoVotacion');
    const jugadorEliminadoH3 = document.getElementById('jugadorEliminado');
    const rolDiv = document.getElementById('rolJugador');

    jugadorEliminadoH3.textContent = `${nombresJugadores[jugadorIndex]} ha sido eliminado`;

    if (esImpostor) {
        rolDiv.innerHTML = `
            <div class="rol-impostor">
                <span style="font-size: 3rem;">🎭</span>
                <p style="font-size: 1.5rem; color: #e94560; font-weight: bold;">¡ERA UN IMPOSTOR!</p>
            </div>
        `;
    } else {
        rolDiv.innerHTML = `
            <div class="rol-inocente">
                <span style="font-size: 3rem;">👤</span>
                <p style="font-size: 1.5rem; color: #4ecdc4; font-weight: bold;">Era un jugador inocente</p>
            </div>
        `;
    }

    resultadoDiv.style.display = 'block';

    // Ocultar las tarjetas de votación
    document.getElementById('jugadoresVotacion').style.display = 'none';
}

// Verificar estado del juego
function verificarEstadoJuego() {
    const impostoresVivos = jugadoresVivos.filter(i => impostoresIndices.includes(i)).length;
    const inocentesVivos = jugadoresVivos.filter(i => !impostoresIndices.includes(i)).length;

    const estadoDiv = document.getElementById('estadoJuego');

    // Victoria: todos los impostores eliminados
    if (impostoresVivos === 0) {
        estadoDiv.innerHTML = `
            <div class="victoria">
                <h2 style="color: #4ecdc4; font-size: 2rem;">🎉 ¡VICTORIA!</h2>
                <p style="font-size: 1.3rem;">Los jugadores inocentes han ganado</p>
                <p style="font-size: 1.1rem; margin-top: 1rem;">Todos los impostores han sido eliminados</p>
            </div>
        `;
        juegoTerminado = true;
        document.getElementById('botonesFinales').style.display = 'flex';
        return;
    }

    // Derrota: número de impostores >= número de inocentes
    if (impostoresVivos >= inocentesVivos) {
        estadoDiv.innerHTML = `
            <div class="derrota">
                <h2 style="color: #e94560; font-size: 2rem;">💀 ¡DERROTA!</h2>
                <p style="font-size: 1.3rem;">Los impostores han ganado</p>
                <p style="font-size: 1.1rem; margin-top: 1rem;">Los impostores son iguales o más que los inocentes</p>
            </div>
        `;
        juegoTerminado = true;
        document.getElementById('botonesFinales').style.display = 'flex';
        return;
    }

    // El juego continúa
    estadoDiv.innerHTML = `
        <div class="juego-continua">
            <p style="font-size: 1.2rem; margin-top: 1rem;">
                <strong>Impostores vivos:</strong> ${impostoresVivos} 
                <span style="margin: 0 1rem;">|</span>
                <strong>Inocentes vivos:</strong> ${inocentesVivos}
            </p>
            <p style="font-size: 1rem; margin-top: 0.5rem; color: rgba(255, 255, 255, 0.8);">
                El juego continúa. ¿Qué desean hacer?
            </p>
        </div>
    `;

    document.getElementById('botonesVotacion').style.display = 'flex';
}

// Continuar votando
function continuarVotacion() {
    document.getElementById('jugadoresVotacion').style.display = 'grid';
    mostrarJugadoresParaVotar();
}

// Iniciar ronda extra
function iniciarRondaExtra() {
    // Resetear turno actual
    turnoActual = 0;
    rondaActual++;

    // Actualizar el orden de participación solo con jugadores vivos
    ordenParticipacion = ordenParticipacion.filter(i => jugadoresVivos.includes(i));

    // Volver al paso de turnos
    mostrarTurnoActual();
    mostrarPaso(6);
}

// Mostrar resultado final
function mostrarResultadoFinal() {
    const contenido = document.getElementById('contenidoResultado');
    const titulo = document.getElementById('tituloResultado');

    const impostoresVivos = jugadoresVivos.filter(i => impostoresIndices.includes(i)).length;

    if (impostoresVivos === 0) {
        titulo.textContent = '🎉 ¡Victoria de los Inocentes!';
        titulo.style.color = '#4ecdc4';
    } else {
        titulo.textContent = '💀 ¡Victoria de los Impostores!';
        titulo.style.color = '#e94560';
    }

    let html = '<div class="resumen-final">';

    // Mostrar impostores
    html += '<div class="seccion-resumen"><h3 style="color: #e94560;">🎭 Impostores:</h3><ul>';
    impostoresIndices.forEach(i => {
        const estado = jugadoresVivos.includes(i) ? '✅ Sobrevivió' : '❌ Eliminado';
        html += `<li>${nombresJugadores[i]} - ${estado}</li>`;
    });
    html += '</ul></div>';

    // Mostrar inocentes
    html += '<div class="seccion-resumen"><h3 style="color: #4ecdc4;">👤 Jugadores Inocentes:</h3><ul>';
    for (let i = 0; i < numJugadores; i++) {
        if (!impostoresIndices.includes(i)) {
            const estado = jugadoresVivos.includes(i) ? '✅ Sobrevivió' : '❌ Eliminado';
            html += `<li>${nombresJugadores[i]} - ${estado}</li>`;
        }
    }
    html += '</ul></div>';

    html += '</div>';

    contenido.innerHTML = html;
    mostrarPaso(8);
}

// Cargar categorías al iniciar
cargarCategorias();
