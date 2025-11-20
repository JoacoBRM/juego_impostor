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
let usarFirebase = true; // Cambiar a false para usar el JSON local

// Variables para la ruleta y orden de participación
let ordenParticipacion = [];
let jugadoresRestantes = [];
let turnoActual = 0;
let rondaActual = 1;
const TOTAL_RONDAS = 3;
let ruletaGirando = false;

// Cargar categorías desde Firebase o JSON local
async function cargarCategorias() {
    try {
        if (usarFirebase && window.FirebaseDB) {
            // Intentar cargar desde Firebase
            console.log('Cargando categorías desde Firebase...');
            categorias = await window.FirebaseDB.cargarCategoriasDesdeFirebase();
            
            // Si Firebase no tiene datos, cargar desde JSON y migrar
            if (categorias.length === 0) {
                console.log('No hay categorías en Firebase, cargando desde JSON local...');
                await cargarDesdeJSON();
            }
        } else {
            // Cargar desde JSON local
            await cargarDesdeJSON();
        }
    } catch (error) {
        console.error('Error al cargar las categorías desde Firebase:', error);
        console.log('Intentando cargar desde JSON local como respaldo...');
        await cargarDesdeJSON();
    }
}

// Cargar categorías desde el JSON local
async function cargarDesdeJSON() {
    try {
        const response = await fetch('src/data/game_data.json');
        categorias = await response.json();
        console.log(`${categorias.length} categorías cargadas desde JSON local`);
    } catch (error) {
        console.error('Error al cargar las categorías desde JSON:', error);
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
            <input type="text" id="jugador${i}" placeholder="Nombre del jugador ${i}" value="${nombresJugadores[i-1] || ''}">
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
            'Cosas': '💡',
            'Comida Rápida': '🍕'
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
    const indicesDisponibles = Array.from({length: numJugadores}, (_, i) => i);
    
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
        // Ocultar
        contenido.textContent = '?';
        contenido.className = 'palabra-oculta';
        btn.innerHTML = '<span id="iconoOjo">👁️</span> Mostrar Palabra';
        palabraVisible = false;
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

// Pasar al siguiente jugador
function siguienteJugador() {
    jugadorActualIndex++;
    
    if (jugadorActualIndex >= numJugadores) {
        empezarJuego(); 
    } else {
        mostrarTurnoJugador();
    }
}

// Empezar el juego - ir a la ruleta
function empezarJuego() {
    console.log('¡El juego ha comenzado!');
    
    // Guardar estadísticas de la partida en Firebase (opcional)
    if (usarFirebase && window.FirebaseDB) {
        const estadisticas = {
            numJugadores: numJugadores,
            nombresJugadores: nombresJugadores,
            numImpostores: numImpostores,
            tematicasSeleccionadas: tematicasSeleccionadas,
            palabraSeleccionada: palabraSeleccionada,
            pistaSeleccionada: pistaSeleccionada,
            incluirPistas: incluirPistas
        };
        
        window.FirebaseDB.guardarEstadisticasPartida(estadisticas)
            .then((id) => console.log('Partida guardada con ID:', id))
            .catch((error) => console.error('Error al guardar partida:', error));
    }
    
    // Inicializar ruleta
    inicializarRuleta();
    mostrarPaso(6);
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
    document.getElementById('listaOrden').innerHTML = '';
    document.getElementById('ruletaNombre').textContent = '?';
    document.getElementById('btnGirarRuleta').style.display = 'inline-block';
    document.getElementById('btnContinuarJuego').style.display = 'none';
}

// En src/js/game.js

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
    let indices = Array.from({length: numJugadores}, (_, i) => i);
    
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
    let indices = Array.from({length: numJugadores}, (_, i) => i);
    
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
}

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
    mostrarTurnoActual();
    mostrarPaso(7);
}

// Mostrar el turno actual
function mostrarTurnoActual() {
    const jugadorIndex = ordenParticipacion[turnoActual];
    document.getElementById('nombreTurnoActual').textContent = nombresJugadores[jugadorIndex];
    document.getElementById('numeroTurno').textContent = turnoActual + 1;
    document.getElementById('totalTurnos').textContent = numJugadores;
    document.getElementById('rondaActual').textContent = rondaActual;
    
    // Actualizar lista de participación con el turno actual resaltado
    actualizarListaParticipacion();
    
    // Mostrar/ocultar botones según el estado
    if (rondaActual >= TOTAL_RONDAS && turnoActual >= numJugadores - 1) {
        document.getElementById('btnSiguienteTurno').style.display = 'none';
        document.getElementById('btnFinalizarJuego').style.display = 'inline-block';
    } else {
        document.getElementById('btnSiguienteTurno').style.display = 'inline-block';
        document.getElementById('btnFinalizarJuego').style.display = 'none';
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
    
    if (turnoActual >= numJugadores) {
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

// Cargar categorías al iniciar
cargarCategorias();
