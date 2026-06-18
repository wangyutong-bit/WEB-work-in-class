const DB_NAME = 'musicPlayerDB'
const DB_VERSION = 1
const STORE_NAME = 'audioFiles'

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = (event) => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    request.onsuccess = (event) => resolve(event.target.result)
    request.onerror = (event) => reject(event.target.error)
  })
}

/**
 * Save audio tracks to IndexedDB.
 * Clears all existing tracks first, then stores the new ones.
 * @param {Array<{id: string, name: string, file: File}>} tracksWithFiles
 */
export async function saveTracksToDB(tracksWithFiles) {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)

  // Clear old tracks before saving new ones
  await new Promise((resolve) => {
    const clearReq = store.clear()
    clearReq.onsuccess = resolve
    clearReq.onerror = resolve // Continue even if clear fails
  })

  // Read each file as ArrayBuffer and store
  for (const t of tracksWithFiles) {
    const buffer = await t.file.arrayBuffer()
    store.put({
      id: t.id,
      name: t.name,
      data: buffer,
      mime: t.file.type || 'audio/mpeg'
    })
  }

  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

/**
 * Load all saved audio tracks from IndexedDB.
 * @returns {Promise<Array<{id: string, name: string, data: ArrayBuffer, mime: string}>>}
 */
export async function loadTracksFromDB() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readonly')
  const store = tx.objectStore(STORE_NAME)

  return new Promise((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result || [])
    req.onerror = () => reject(req.error)
  })
}

/**
 * Clear all tracks from IndexedDB.
 */
export async function clearTracksFromDB() {
  const db = await openDB()
  const tx = db.transaction(STORE_NAME, 'readwrite')
  const store = tx.objectStore(STORE_NAME)
  store.clear()
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}
