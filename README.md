## 🎭 Características y Contenido del Juego "¿Quién es el impostor?"

### ✨ Concepto General

Es un juego de deducción social diseñado para la web (PWA) donde la mayoría de los jugadores conocen una palabra secreta y un impostor debe fingir conocerla.

### 🎮 Funcionalidad del Juego

* **Asignación de Roles Secretos:** El juego asigna automáticamente los roles de **Impostor** o  **Jugador Normal** .
* **Gestión de Palabras:**
  * Se selecciona una palabra secreta de una temática elegida.
  * Todos los jugadores la ven, excepto el impostor.
  * Cada jugador debe mostrar y ocultar su palabra para continuar.
* **Pista para el Impostor:** Se puede incluir una pista sobre la palabra secreta para el impostor, permitiéndole "subir la dificultad".
* **Temporizador de Transición:** Después de ocultar la palabra, aparece un popup con cuenta regresiva de 5 segundos antes de pasar al siguiente jugador.
* **Ruleta de Orden:** Utiliza una ruleta virtual para establecer de forma aleatoria el orden de participación de los jugadores.
* **Rondas de Turnos:** El juego está estructurado para un total de **2 rondas** de participación por jugador (Turnos).
* **Sistema de Votación:** Incluye un sistema integrado de votación donde los jugadores pueden eliminar sospechosos y descubrir al impostor.

### ⚙️ Configuración del Juego

* **Número de Jugadores:** Se puede configurar el número de jugadores desde **3 hasta 10** (a través de un  *slider* ).
* **Número de Impostores:** Permite seleccionar el número de impostores (1, 2 o 3), con un límite máximo basado en el número total de jugadores.
* **Selección de Temáticas:** Los jugadores eligen las categorías que desean incluir en el juego antes de iniciar.
* **Personalización:** Permite ingresar los nombres de cada jugador.

### 💻 Tecnologías y Estructura

* **Tecnologías Base:** Construido con HTML, CSS, y JavaScript.
* **Almacenamiento de Datos:** Las categorías de palabras se cargan desde **Firebase Firestore** por defecto.
* **Licencia:** El código está liberado bajo la  **Licencia MIT** .
