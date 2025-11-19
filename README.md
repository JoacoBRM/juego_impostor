## 🎭 Características y Contenido del Juego "¿Quién es el impostor?"

### ✨ Concepto General

Es un juego de deducción social diseñado para la web (PWA) donde la mayoría de los jugadores conocen una palabra secreta y un impostor debe fingir conocerla.

### 🎮 Funcionalidad del Juego

* **Asignación de Roles Secretos:** El juego asigna automáticamente los roles de **Impostor** o  **Jugador Normal** .
* **Gestión de Palabras:**
  * Se selecciona una palabra secreta de una temática elegida.
  * Todos los jugadores la ven, excepto el impostor.
* **Pista para el Impostor:** Se puede incluir una pista sobre la palabra secreta para el impostor, permitiéndole "subir la dificultad".
* **Ruleta de Orden:** Utiliza una ruleta virtual en el "Paso 6" para establecer de forma aleatoria el orden de participación de los jugadores.
* **Rondas de Turnos:** El juego está estructurado para un total de **3 rondas** de participación por jugador (Turnos).
* **Votaciones:** La meta es que los jugadores discutan y voten para descubrir quién es el impostor (la votación final se realiza fuera de la aplicación).

### ⚙️ Configuración del Juego

* **Número de Jugadores:** Se puede configurar el número de jugadores desde **3 hasta 10** (a través de un  *slider* ).
* **Número de Impostores:** Permite seleccionar el número de impostores (1, 2 o 3), con un límite máximo basado en el número total de jugadores.
* **Selección de Temáticas:** Los jugadores eligen las categorías que desean incluir en el juego antes de iniciar.
* **Personalización:** Permite ingresar los nombres de cada jugador.

### 💻 Tecnologías y Estructura

* **Tecnologías Base:** Construido con HTML, CSS, y JavaScript.
* **Almacenamiento de Datos:** Las categorías de palabras se cargan desde **Firebase Firestore** por defecto.
* **Licencia:** El código está liberado bajo la  **Licencia MIT** .
