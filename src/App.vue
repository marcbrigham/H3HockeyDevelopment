<template>
  <canvas ref="canvas" class="particles-canvas" aria-hidden="true" />
  <Navbar />
  <RouterView />
  <footer class="footer">
    <div class="container">
      <div class="footer-inner">
        <RouterLink to="/" class="footer-brand">
          <img
            src="./assets/logo.png"
            alt="H3 Hockey Development"
            class="footer-logo"
          />
        </RouterLink>
        <div class="footer-links">
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/lessons">Private Lessons</RouterLink>
          <RouterLink to="/clinics">Clinics</RouterLink>
          <RouterLink to="/player-family">Consulting</RouterLink>
          <RouterLink to="/bio">Bio</RouterLink>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          © {{ new Date().getFullYear() }} H3 Hockey Development. Est. 2010.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { ref } from "vue";
import { RouterView, RouterLink } from "vue-router";
import Navbar from "./components/Navbar.vue";
import { useAuthStore } from "./stores/auth";
import { useParticles } from "./composables/useParticles";

const auth = useAuthStore();
auth.init();

const canvas = ref(null);
useParticles(canvas);
</script>

<style scoped>
.particles-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.footer {
  position: relative;
  z-index: 1;
  background: rgba(19, 26, 43, 0.97);
  border-top: 1px solid rgba(156, 255, 0, 0.15);
  padding: 2.5rem 0 1.5rem;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}
.footer-brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}
.footer-logo {
  height: 48px;
  width: auto;
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  display: block;
}
.footer-links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.footer-links a {
  color: var(--gray-500);
  font-size: 0.875rem;
}
.footer-links a:hover {
  color: var(--lime);
}
.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 1rem;
}
.footer-bottom p {
  color: var(--gray-500);
  font-size: 0.8rem;
}
</style>
