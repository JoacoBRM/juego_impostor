// Módulo para manejar operaciones con Firebase Firestore

/**
 * Carga todas las categorías desde Firestore
 * @returns {Promise<Array>} Array con las categorías del juego
 */
async function cargarCategoriasDesdeFirebase() {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    const categoriasSnapshot = await window.firebaseDB
      .collection('categorias')
      .get();

    const categorias = [];
    categoriasSnapshot.forEach((doc) => {
      categorias.push({
        id: doc.id,
        ...doc.data()
      });
    });

    console.log(`${categorias.length} categorías cargadas desde Firebase`);
    return categorias;
  } catch (error) {
    console.error('Error al cargar categorías desde Firebase:', error);
    throw error;
  }
}

/**
 * Guarda una nueva categoría en Firestore
 * @param {Object} categoria - Objeto con la categoría a guardar
 * @returns {Promise<string>} ID del documento creado
 */
async function guardarCategoria(categoria) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    const docRef = await window.firebaseDB
      .collection('categorias')
      .add(categoria);

    console.log('Categoría guardada con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar categoría:', error);
    throw error;
  }
}

/**
 * Actualiza una categoría existente
 * @param {string} categoriaId - ID de la categoría a actualizar
 * @param {Object} datos - Datos a actualizar
 * @returns {Promise<void>}
 */
async function actualizarCategoria(categoriaId, datos) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    await window.firebaseDB
      .collection('categorias')
      .doc(categoriaId)
      .update(datos);

    console.log('Categoría actualizada:', categoriaId);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    throw error;
  }
}

/**
 * Elimina una categoría
 * @param {string} categoriaId - ID de la categoría a eliminar
 * @returns {Promise<void>}
 */
async function eliminarCategoria(categoriaId) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    await window.firebaseDB
      .collection('categorias')
      .doc(categoriaId)
      .delete();

    console.log('Categoría eliminada:', categoriaId);
  } catch (error) {
    console.error('Error al eliminar categoría:', error);
    throw error;
  }
}

/**
 * Guarda las estadísticas de una partida
 * @param {Object} estadisticas - Datos de la partida
 * @returns {Promise<string>} ID del documento creado
 */
async function guardarEstadisticasPartida(estadisticas) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    const docRef = await window.firebaseDB
      .collection('partidas')
      .add({
        ...estadisticas,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

    console.log('Estadísticas guardadas con ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error al guardar estadísticas:', error);
    throw error;
  }
}

/**
 * Obtiene las últimas partidas jugadas
 * @param {number} limite - Número máximo de partidas a obtener
 * @returns {Promise<Array>} Array con las partidas
 */
async function obtenerUltimasPartidas(limite = 10) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    const partidasSnapshot = await window.firebaseDB
      .collection('partidas')
      .orderBy('timestamp', 'desc')
      .limit(limite)
      .get();

    const partidas = [];
    partidasSnapshot.forEach((doc) => {
      partidas.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return partidas;
  } catch (error) {
    console.error('Error al obtener partidas:', error);
    throw error;
  }
}

/**
 * Migra datos desde el JSON local a Firebase
 * Esta función es útil para la primera carga de datos
 * @param {Array} categoriasJSON - Array con las categorías del JSON
 * @returns {Promise<void>}
 */
async function migrarDatosAFirebase(categoriasJSON) {
  try {
    if (!window.firebaseDB) {
      throw new Error('Firebase no está inicializado');
    }

    console.log('Iniciando migración de datos...');
    
    const batch = window.firebaseDB.batch();
    const categoriasRef = window.firebaseDB.collection('categorias');

    for (const categoria of categoriasJSON) {
      const docRef = categoriasRef.doc();
      batch.set(docRef, categoria);
    }

    await batch.commit();
    console.log(`${categoriasJSON.length} categorías migradas exitosamente`);
  } catch (error) {
    console.error('Error al migrar datos:', error);
    throw error;
  }
}

// Exportar funciones para usar en otros archivos
window.FirebaseDB = {
  cargarCategoriasDesdeFirebase,
  guardarCategoria,
  actualizarCategoria,
  eliminarCategoria,
  guardarEstadisticasPartida,
  obtenerUltimasPartidas,
  migrarDatosAFirebase
};
