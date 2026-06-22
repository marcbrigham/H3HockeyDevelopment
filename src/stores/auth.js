import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('h3_token') || null)
  const isAdmin = computed(() => !!token.value)

  async function login(username, password) {
    const res = await axios.post('/api/admin/login', { username, password })
    token.value = res.data.token
    localStorage.setItem('h3_token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
  }

  function logout() {
    token.value = null
    localStorage.removeItem('h3_token')
    delete axios.defaults.headers.common['Authorization']
  }

  function init() {
    if (token.value) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
    }
  }

  return { token, isAdmin, login, logout, init }
})
