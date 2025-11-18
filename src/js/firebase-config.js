// Configuración de Firebase
// INSTRUCCIONES:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a "Configuración del proyecto" > "General"
// 4. En "Tus apps", añade una app web (</> icono)
// 5. Copia la configuración que te proporciona Firebase
// 6. Reemplaza el objeto firebaseConfig con tus credenciales

const firebaseConfig = {
  apiKey: "AIzaSyB8MvDds50v1GXuWGbEMHfB25Wm2Pygft4",
  authDomain: "impostorjoacobrm.firebaseapp.com",
  projectId: "impostorjoacobrm",
  storageBucket: "impostorjoacobrm.firebasestorage.app",
  messagingSenderId: "148582902222",
  appId: "1:148582902222:web:79d46960a7225d342e239f",
  measurementId: "G-WSGYLQSB7R"
};
// Inicializar Firebase
let app;
let db;

try {
  app = firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  console.log('Firebase inicializado correctamente');
} catch (error) {
  console.error('Error al inicializar Firebase:', error);
}

// Exportar instancias para usar en otros archivos
window.firebaseApp = app;
window.firebaseDB = db;
