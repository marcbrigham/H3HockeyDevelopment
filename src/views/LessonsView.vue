<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="section-label">1-on-1 Training</p>
        <h1>Small Group Instruction…</h1>
        <p>
          Personalized instruction for players and goalies. Sign up below and
          we'll reach out to schedule your sessions.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="lessons-layout">
          <!-- Info sidebar -->
          <div class="info-panel">
            <div class="card">
              <h3>What to Expect</h3>
              <ul class="info-list">
                <li>
                  <span class="info-icon">📋</span>
                  <div>
                    <strong>Skill Assessment</strong>
                    <p>
                      Every player starts with an evaluation to identify areas
                      for improvement.
                    </p>
                  </div>
                </li>
                <li>
                  <span class="info-icon">🎯</span>
                  <div>
                    <strong>Custom Plan</strong>
                    <p>
                      Training tailored to your player's age, level, and
                      position.
                    </p>
                  </div>
                </li>
                <li>
                  <span class="info-icon">🏒</span>
                  <div>
                    <strong>Skating &amp; Skills</strong>
                    <p>
                      Edges, stickhandling, shooting, passing, and positioning.
                    </p>
                  </div>
                </li>
                <li>
                  <span class="info-icon">🥅</span>
                  <div>
                    <strong>Goalie Training</strong>
                    <p>Position-specific work for goalies at every level.</p>
                  </div>
                </li>
                <li>
                  <span class="info-icon">📅</span>
                  <div>
                    <strong>Flexible Scheduling</strong>
                    <p>
                      We'll coordinate ice time and a schedule that works for
                      you.
                    </p>
                  </div>
                </li>
              </ul>
              <div class="contact-note">
                <p>Questions? Email us directly:</p>
                <a href="mailto:h3hockeydevelopment@gmail.com"
                  >h3hockeydevelopment@gmail.com</a
                >
              </div>
            </div>
          </div>

          <!-- Signup form -->
          <div class="form-panel">
            <div class="card">
              <h2 style="font-size: 1.75rem; margin-bottom: 1.5rem">
                Register for Lessons
              </h2>

              <div v-if="success" class="alert alert-success">
                ✅ You're signed up! We'll contact you at
                <strong>{{ submittedEmail }}</strong> to schedule your first
                session.
              </div>

              <div v-if="error" class="alert alert-error">{{ error }}</div>

              <form v-if="!success" @submit.prevent="submit">
                <div class="grid-2">
                  <div class="form-group">
                    <label>Player Name *</label>
                    <input
                      v-model="form.playerName"
                      required
                      placeholder="First Last"
                    />
                  </div>
                  <div class="form-group">
                    <label>Player Age *</label>
                    <input
                      v-model="form.age"
                      type="number"
                      required
                      min="3"
                      max="99"
                      placeholder="e.g. 10"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Position *</label>
                  <select v-model="form.position" required>
                    <option value="">Select position</option>
                    <option value="forward">Forward</option>
                    <option value="defense">Defense</option>
                    <option value="goalie">Goalie</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Parent / Guardian Name *</label>
                  <input
                    v-model="form.parentName"
                    required
                    placeholder="First Last"
                  />
                </div>

                <div class="grid-2">
                  <div class="form-group">
                    <label>Email *</label>
                    <input
                      v-model="form.email"
                      type="email"
                      required
                      placeholder="you@email.com"
                    />
                  </div>
                  <div class="form-group">
                    <label>Phone *</label>
                    <input
                      v-model="form.phone"
                      type="tel"
                      required
                      placeholder="(315) 555-0100"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label>Additional Notes</label>
                  <textarea
                    v-model="form.notes"
                    rows="3"
                    placeholder="Experience level, goals, scheduling preferences, etc."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="loading"
                  style="
                    width: 100%;
                    justify-content: center;
                    font-size: 1.2rem;
                    padding: 0.9rem;
                  "
                >
                  {{ loading ? "Submitting…" : "Submit Registration" }}
                </button>

                <p class="form-note">
                  We'll reach out within 1-2 business days to confirm your spot
                  and schedule.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useSignupsStore } from "../stores/signups";

const store = useSignupsStore();
const loading = ref(false);
const success = ref(false);
const error = ref("");
const submittedEmail = ref("");

const form = reactive({
  playerName: "",
  age: "",
  position: "",
  parentName: "",
  email: "",
  phone: "",
  notes: "",
});

async function submit() {
  loading.value = true;
  error.value = "";
  try {
    await store.submitLessonSignup({ ...form });
    submittedEmail.value = form.email;
    success.value = true;
  } catch (err) {
    error.value =
      err.response?.data?.error || "Something went wrong. Please try again.";
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.lessons-layout {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 2rem;
  align-items: start;
}
@media (max-width: 900px) {
  .lessons-layout {
    grid-template-columns: 1fr;
  }
}

.info-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1rem 0 1.5rem;
}
.info-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
}
.info-icon {
  font-size: 1.4rem;
  flex-shrink: 0;
  margin-top: 2px;
}
.info-list strong {
  display: block;
  font-family:
    "Tomorrow",
    system-ui,
    -apple-system,
    sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
}
.info-list p {
  color: var(--gray-300);
  font-size: 0.875rem;
  margin-top: 0.15rem;
}

.contact-note {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1.25rem;
  margin-top: 0.5rem;
}
.contact-note p {
  color: var(--gray-500);
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
}

.form-note {
  text-align: center;
  color: var(--gray-500);
  font-size: 0.82rem;
  margin-top: 0.75rem;
}
</style>
