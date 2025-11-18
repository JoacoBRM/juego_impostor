# 🔥 Configuración de Firebase para el Juego del Impostor

Este documento te guiará paso a paso para configurar Firebase en tu juego.

## 📋 Requisitos Previos

- Una cuenta de Google
- Acceso a [Firebase Console](https://console.firebase.google.com/)

## 🚀 Pasos para Configurar Firebase

### 1. Crear un Proyecto de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Ingresa un nombre para tu proyecto (ej: "juego-impostor")
4. Acepta los términos y condiciones
5. Puedes desactivar Google Analytics si no lo necesitas
6. Haz clic en **"Crear proyecto"**

### 2. Registrar tu Aplicación Web

1. En la página principal de tu proyecto, haz clic en el ícono **"Web" (</>)**
2. Ingresa un nombre para tu app (ej: "Juego Impostor Web")
3. **NO** marques la casilla de Firebase Hosting (a menos que quieras usarlo)
4. Haz clic en **"Registrar app"**

### 3. Obtener las Credenciales de Firebase

Después de registrar la app, verás un código de configuración similar a este:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};
```

### 4. Configurar las Credenciales en tu Proyecto

1. Abre el archivo `src/js/firebase-config.js`
2. Reemplaza el objeto `firebaseConfig` con tus credenciales de Firebase
3. Guarda el archivo

**Ejemplo:**

```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY_AQUI",
  authDomain: "juego-impostor-12345.firebaseapp.com",
  projectId: "juego-impostor-12345",
  storageBucket: "juego-impostor-12345.appspot.com",
  messagingSenderId: "987654321",
  appId: "1:987654321:web:abc123def456"
};
```

### 5. Activar Firestore Database

1. En la consola de Firebase, ve al menú lateral
2. Haz clic en **"Firestore Database"**
3. Haz clic en **"Crear base de datos"** o **"Create database"**
4. Selecciona el modo:
   - **Modo de prueba** (recomendado para desarrollo): Permite lecturas/escrituras durante 30 días
   - **Modo de producción**: Requiere configurar reglas de seguridad
5. Selecciona una ubicación (ej: us-central, southamerica-east1)
6. Haz clic en **"Habilitar"**

### 6. Configurar Reglas de Seguridad (Importante)

Por defecto, el modo de prueba permite acceso total durante 30 días. Para producción, configura reglas más estrictas:

1. Ve a **"Firestore Database" > "Reglas"**
2. Usa estas reglas básicas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura de categorías a todos
    match /categorias/{categoria} {
      allow read: if true;
      allow write: if false; // Solo admin puede escribir
    }
    
    // Permitir guardar partidas
    match /partidas/{partida} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

3. Haz clic en **"Publicar"**

### 7. Migrar los Datos del JSON a Firebase

Una vez configurado Firebase:

1. Abre tu navegador
2. Navega a: `file:///RUTA_A_TU_PROYECTO/migrate.html`
   - O usa Live Server si lo tienes instalado
3. Haz clic en el botón **"Iniciar Migración de Datos"**
4. Espera a que se complete la migración
5. Verifica en la consola de Firebase que los datos se hayan cargado correctamente

### 8. Verificar que Todo Funcione

1. Abre `jugar.html` en tu navegador
2. Abre la consola del navegador (F12)
3. Deberías ver el mensaje: "Firebase inicializado correctamente"
4. Al configurar una partida, las categorías se cargarán desde Firebase

## 🔧 Configuración Adicional

### Cambiar entre Firebase y JSON Local

En el archivo `src/js/game.js`, encontrarás esta variable:

```javascript
let usarFirebase = true; // Cambiar a false para usar el JSON local
```

- `true`: Usa Firebase (requiere conexión a internet)
- `false`: Usa el archivo JSON local (funciona sin internet)

### Estructura de la Base de Datos

Tu Firestore tendrá esta estructura:

```
categorias/
  ├── documento1
  │   ├── category: "Frutas"
  │   └── words: [...]
  ├── documento2
  │   ├── category: "Profesiones"
  │   └── words: [...]
  └── ...

partidas/
  ├── documento1
  │   ├── numJugadores: 5
  │   ├── nombresJugadores: [...]
  │   ├── palabraSeleccionada: "Manzana"
  │   ├── timestamp: ...
  │   └── ...
  └── ...
```

## ❓ Solución de Problemas

### Error: "Firebase no está inicializado"

- Verifica que hayas configurado correctamente las credenciales en `firebase-config.js`
- Asegúrate de que los scripts de Firebase se estén cargando (revisa la consola del navegador)

### Error al cargar categorías

- Verifica que Firestore esté activado en tu proyecto
- Revisa las reglas de seguridad de Firestore
- Asegúrate de haber migrado los datos usando `migrate.html`

### Los datos no aparecen en Firebase

- Verifica que la migración se haya completado exitosamente
- Revisa la consola de Firebase en la sección "Firestore Database"
- Verifica que no haya errores en la consola del navegador

## 📚 Recursos Adicionales

- [Documentación de Firebase](https://firebase.google.com/docs)
- [Guía de Firestore](https://firebase.google.com/docs/firestore)
- [Reglas de Seguridad de Firestore](https://firebase.google.com/docs/firestore/security/get-started)

## 🎮 ¡Listo para Jugar!

Una vez completados estos pasos, tu juego estará conectado a Firebase y podrás:
- ✅ Cargar categorías desde la nube
- ✅ Guardar estadísticas de partidas
- ✅ Acceder a los datos desde cualquier dispositivo
- ✅ Escalar fácilmente agregando más categorías

¡Disfruta tu juego! 🎉
