<template>
  <nav class="navbar" :class="{ scrolled }">
    <div class="nav-inner">
      <RouterLink to="/" class="logo">
        <img src="../assets/logo.png" alt="H3 Hockey Development" class="logo-img" />
      </RouterLink>

      <button class="menu-toggle" @click="open = !open" :aria-expanded="open">
        <span></span><span></span><span></span>
      </button>

      <ul class="nav-links" :class="{ active: open }">
        <li><RouterLink to="/" @click="open = false">Home</RouterLink></li>
        <li><RouterLink to="/lessons" @click="open = false">Private Lessons</RouterLink></li>
        <li><RouterLink to="/clinics" @click="open = false">Clinics</RouterLink></li>
        <li v-if="auth.token">
          <RouterLink to="/admin" @click="open = false">Admin</RouterLink>
        </li>
        <li v-if="auth.token">
          <button class="btn btn-ghost btn-sm" @click="logout">Logout</button>
        </li>
        <li v-else>
          <RouterLink to="/lessons" class="btn btn-primary btn-sm" @click="open = false">Sign Up</RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))

function logout() {
  auth.logout()
  router.push('/')
  open.value = false
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease;
}
.navbar.scrolled {
  background: rgba(19, 26, 43, 0.92);
  border-bottom-color: rgba(156,255,0,0.18);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.logo-img {
  height: 50px;
  width: auto;
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  display: block;
  transition: opacity 0.2s;
}
.logo-img:hover { opacity: 0.9; }

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
}
.nav-links a.btn,
.nav-links a.btn.router-link-active,
.nav-links a.btn:hover,
.nav-links a.btn.router-link-active:hover { color: #000; }
.nav-links a {
  color: rgba(255,255,255,0.8);
  font-family: 'Tomorrow', system-ui, -apple-system, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.2s;
}
.nav-links a:hover,
.nav-links a.router-link-active { color: var(--lime); }

.menu-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.menu-toggle span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--white);
  border-radius: 2px;
  transition: background 0.2s;
}

@media (max-width: 700px) {
  .menu-toggle { display: flex; }
  .nav-links {
    display: none;
    position: fixed;
    top: 72px;
    left: 0;
    right: 0;
    background: rgba(19, 26, 43, 0.97);
    backdrop-filter: blur(12px);
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.5rem 1.5rem;
    border-bottom: 1px solid rgba(156,255,0,0.15);
    gap: 1rem;
  }
  .nav-links.active { display: flex; }
}
</style>
