import { ref, computed } from 'vue'
import { getSession } from './useAuth'

/** Remove file extension from a filename string */
const stripExt = (name) => (name || '').replace(/\.[^.]*$/, '')

function getUsers() {
  try { const raw = localStorage.getItem('musicApp_users'); return raw ? JSON.parse(raw) : [] }
  catch { return [] }
}

function saveUsers(users) {
  localStorage.setItem('musicApp_users', JSON.stringify(users))
}

export function getFavoriteTracks() {
  const session = getSession()
  if (!session) return []
  const users = getUsers()
  const user = users.find(u => u.username === session.username)
  return user ? user.favorites.map(f => ({ id: f.id, name: stripExt(f.name) })) : []
}

export function useFavorites(tracks) {
  const session = getSession()
  const username = session ? session.username : ''

  const favMap = ref(new Map())

  function loadFavMap() {
    if (!username) { favMap.value = new Map(); return }
    const users = getUsers()
    const user = users.find(u => u.username === username)
    favMap.value = new Map((user ? user.favorites : []).map(f => [f.id, stripExt(f.name)]))
  }

  function saveFavMap() {
    if (!username) return
    const users = getUsers()
    const idx = users.findIndex(u => u.username === username)
    if (idx !== -1) {
      users[idx].favorites = [...favMap.value].map(([id, name]) => ({ id, name: stripExt(name) }))
      saveUsers(users)
    }
  }

  loadFavMap()

  const toggleFavorite = (track) => {
    const next = new Map(favMap.value)
    if (next.has(track.id)) {
      next.delete(track.id)
    } else {
      next.set(track.id, stripExt(track.name))
    }
    favMap.value = next
    saveFavMap()
  }

  const isFavorited = (track) => {
    return favMap.value.has(track.id)
  }

  const favoriteTracks = computed(() => {
    return tracks.value.filter(t => favMap.value.has(t.id))
  })

  /**
   * Remove favorites that reference tracks no longer in the current playlist.
   */
  const cleanOrphanedFavorites = () => {
    if (!username) return
    const validIds = new Set(tracks.value.map(t => t.id))
    if (validIds.size === 0) return
    const next = new Map(favMap.value)
    let changed = false
    for (const id of next.keys()) {
      if (!validIds.has(id)) {
        next.delete(id)
        changed = true
      }
    }
    if (changed) {
      favMap.value = next
      saveFavMap()
    }
  }

  return { favMap, favoriteTracks, toggleFavorite, isFavorited, cleanOrphanedFavorites }
}
