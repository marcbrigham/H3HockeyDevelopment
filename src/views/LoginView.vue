<template>
  <main class="login-page">
    <div class="login-box">
      <div class="login-logo">
        <img
          src="../assets/logo.png"
          alt="H3 Hockey Development"
          class="login-logo-img"
        />
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
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
            />
            <button
              type="button"
              class="password-toggle"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
                <circle cx="12" cy="12" r="2.5" />
              </svg>
              <svg v-else viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="m3 3 18 18M10.6 6.2A10.8 10.8 0 0 1 12 6c6.5 0 10 6 10 6a18.7 18.7 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.5 6 10 6a10.8 10.8 0 0 0 3.4-.5"
                />
              </svg>
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading"
          style="width: 100%; justify-content: center; margin-top: 0.5rem"
        >
          {{ loading ? "Signing in…" : "Sign In" }}
        </button>
      </form>

      <RouterLink to="/" class="back-link">← Back to site</RouterLink>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const username = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const error = ref("");

async function submit() {
  loading.value = true;
  error.value = "";
  try {
    await auth.login(username.value, password.value);
    router.push("/admin");
  } catch {
    error.value = "Invalid username or password.";
  } finally {
    loading.value = false;
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
  border: 1px solid rgba(156, 255, 0, 0.2);
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
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
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
.back-link:hover {
  color: var(--lime);
}
.password-field {
  position: relative;
}
.password-field input {
  padding-right: 3rem;
}
.password-toggle {
  position: absolute;
  top: 50%;
  right: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
}
.password-toggle:hover {
  color: var(--lime);
}
.password-toggle svg {
  width: 1.2rem;
  height: 1.2rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}
</style>
