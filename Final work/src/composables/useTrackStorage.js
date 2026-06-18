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

  // 在保存新曲目之前清除旧曲目
  await new Promise((resolve) => {
    const clearReq = store.clear()
    clearReq.onsuccess = resolve
    clearReq.onerror = resolve // 即使清除失败也继续执行
  })

  // 将每个文件读取为 ArrayBuffer 并存储
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
 * 从 IndexedDB 加载所有已保存的音频曲目。
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
 * 清除 IndexedDB 中的所有曲目。
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
