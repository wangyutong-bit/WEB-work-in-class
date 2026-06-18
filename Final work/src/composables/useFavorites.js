import { ref, computed } from 'vue'
import { getSession } from './useAuth'

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
    return user ? user.favorites.map(f => ({ ...f, name: f.name.replace(/\.[^.]*$/, '') })) : []
}

export function useFavorites(tracks) {
  const session = getSession()
  const username = session ? session.username : ''

  const favMap = ref(new Map())

  function loadFavMap() {
    if (!username) { favMap.value = new Map(); return }
    const users = getUsers()
    const user = users.find(u => u.username === username)
    favMap.value = new Map((user ? user.favorites : []).map(f => [f.id, f.name]))
  }

  function saveFavMap() {
    if (!username) return
    const users = getUsers()
    const idx = users.findIndex(u => u.username === username)
    if (idx !== -1) {
      users[idx].favorites = [...favMap.value].map(([id, name]) => ({ id, name }))
      saveUsers(users)
    }
  }

  loadFavMap()

  const toggleFavorite = (track) => {
    const next = new Map(favMap.value)
    if (next.has(track.id)) {
      next.delete(track.id)
    } else {
      next.set(track.id, track.name)
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

  return { favMap, favoriteTracks, toggleFavorite, isFavorited }
}
