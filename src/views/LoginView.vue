<template>
  <main class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <img src="../assets/logo.png" alt="H3 Hockey Development" class="login-logo-img" />
        <p>Admin Portal</p>
      </div>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="submit">
        <div class="form-group">
          <label>Username</label>
          <input v-model="username" required autocomplete="username" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" required autocomplete="current-password" />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading" style="width:100%; justify-content:center; margin-top:0.5rem;">
          {{ loading ? 'Signing in…' : 'Sign In' }}
        </button>
      </form>

      <RouterLink to="/" class="back-link">← Back to site</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function submit() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(username.value, password.value)
    router.push('/admin')
  } catch {
    error.value = 'Invalid username or password.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.login-box {
  width: 100%;
  max-width: 380px;
  background: rgba(28, 38, 61, 0.82);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(156,255,0,0.2);
  border-radius: 10px;
  padding: 2.5rem;
}
.login-logo {
  text-align: center;
  margin-bottom: 2rem;
}
.login-logo-img {
  height: 80px;
  width: auto;
  background: #fff;
  border-radius: 8px;
  padding: 6px 12px;
  display: inline-block;
}
.login-logo p {
  font-family: 'Tomorrow', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
}
.back-link {
  display: block;
  text-align: center;
  margin-top: 1.5rem;
  color: var(--gray-500);
  font-size: 0.875rem;
}
.back-link:hover { color: var(--lime); }
</style>
