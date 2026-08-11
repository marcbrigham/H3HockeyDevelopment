<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="section-label">Group Training</p>
        <h1>Skill Development Clinics</h1>
        <p>
          High-energy group sessions for players and goalies of all ages. Select
          a clinic below to register.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <!-- Loading -->
        <div v-if="loading" class="empty-state">Loading clinics…</div>

        <!-- No clinics yet -->
        <div v-else-if="!store.clinics.length" class="empty-state">
          <div class="empty-icon">📅</div>
          <h3>No Clinics Scheduled Yet</h3>
          <p>Check back soon — clinics are added throughout the season.</p>
          <RouterLink
            to="/mailing-list"
            class="btn btn-outline"
            style="margin-top: 1rem"
            >Join the Mailing List</RouterLink
          >
        </div>

        <!-- Clinic cards -->
        <div v-else class="clinics-grid">
          <div
            v-for="clinic in store.clinics"
            :key="clinic.id"
            class="clinic-card"
            :class="{ selected: selectedClinic?.id === clinic.id }"
            @click="selectClinic(clinic)"
          >
            <div class="clinic-header">
              <div>
                <div class="clinic-age-badge">{{ clinic.ageGroup }}</div>
                <h3>{{ clinic.name }}</h3>
              </div>
              <div class="clinic-spots" :class="spotsClass(clinic)">
                {{ spotsLeft(clinic) }} spots left
              </div>
            </div>
            <div class="clinic-details">
              <span>📅 {{ formatDate(clinic.date) }}</span>
              <span>🕐 {{ clinic.time }}</span>
              <span>📍 {{ clinic.location }}</span>
            </div>
            <p v-if="clinic.description" class="clinic-desc">
              {{ clinic.description }}
            </p>
            <button
              class="btn btn-primary"
              style="width: 100%; justify-content: center; margin-top: 0.75rem"
              :disabled="spotsLeft(clinic) === 0"
              @click.stop="selectClinic(clinic)"
            >
              {{
                selectedClinic?.id === clinic.id
                  ? "✓ Selected"
                  : spotsLeft(clinic) === 0
                    ? "Clinic Full"
                    : "Register for This Clinic"
              }}
            </button>
          </div>
        </div>

        <div v-if="store.clinics.length" class="mailing-cta card">
          <h2>Want updates about future clinics?</h2>
          <p>
            Join the H3 mailing list for clinic announcements and player
            development news.
          </p>
          <RouterLink to="/mailing-list" class="btn btn-outline"
            >Join the Mailing List</RouterLink
          >
        </div>

        <!-- Signup form (appears when clinic selected) -->
        <div v-if="selectedClinic" class="signup-section">
          <div class="signup-header">
            <h2>
              Register for:
              <span class="text-lime">{{ selectedClinic.name }}</span>
            </h2>
            <p class="text-muted">
              {{ formatDate(selectedClinic.date) }} ·
              {{ selectedClinic.time }} · {{ selectedClinic.location }}
            </p>
          </div>

          <div class="card">
            <div v-if="success" class="alert alert-success">
              ✅ Registered!
              <span v-if="confirmationSent">
                A confirmation was sent to <strong>{{ submittedEmail }}</strong
                >.
              </span>
              <span v-else>
                Your registration was saved. We'll contact you at
                <strong>{{ submittedEmail }}</strong> with confirmation details.
              </span>
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
                  rows="2"
                  placeholder="Any notes or questions"
                ></textarea>
              </div>

              <div class="form-actions">
                <button
                  type="button"
                  class="btn btn-ghost"
                  @click="
                    selectedClinic = null;
                    success = false;
                  "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  class="btn btn-primary"
                  :disabled="submitting"
                >
                  {{ submitting ? "Registering…" : "Complete Registration" }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useSignupsStore } from "../stores/signups";
import { RouterLink } from "vue-router";

const store = useSignupsStore();
const loading = ref(true);
const selectedClinic = ref(null);
const submitting = ref(false);
const success = ref(false);
const error = ref("");
const submittedEmail = ref("");
const confirmationSent = ref(false);

const form = reactive({
  playerName: "",
  age: "",
  position: "",
  parentName: "",
  email: "",
  phone: "",
  notes: "",
});

onMounted(async () => {
  await store.fetchClinics();
  loading.value = false;
});

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function spotsLeft(clinic) {
  return clinic.maxPlayers - (clinic._count?.signups ?? 0);
}

function spotsClass(clinic) {
  const left = spotsLeft(clinic);
  if (left === 0) return "spots-full";
  if (left <= 3) return "spots-low";
  return "spots-ok";
}

function selectClinic(clinic) {
  if (spotsLeft(clinic) === 0) return;
  selectedClinic.value = clinic;
  success.value = false;
  error.value = "";
  Object.assign(form, {
    playerName: "",
    age: "",
    position: "",
    parentName: "",
    email: "",
    phone: "",
    notes: "",
  });
  setTimeout(
    () =>
      document
        .querySelector(".signup-section")
        ?.scrollIntoView({ behavior: "smooth", block: "start" }),
    50,
  );
}

async function submit() {
  submitting.value = true;
  error.value = "";
  try {
    const result = await store.submitClinicSignup({
      ...form,
      clinicId: selectedClinic.value.id,
    });
    submittedEmail.value = form.email;
    confirmationSent.value = result.emailSent;
    success.value = true;
    // Update local count
    const clinic = store.clinics.find((c) => c.id === selectedClinic.value.id);
    if (clinic?._count) clinic._count.signups++;
  } catch (err) {
    error.value =
      err.response?.data?.error || "Something went wrong. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.clinics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.clinic-card {
  background: var(--navy-light);
  border: 1px solid rgba(156, 255, 0, 0.12);
  border-radius: 8px;
  padding: 1.5rem;
  cursor: pointer;
  transition:
    border-color 0.2s,
    transform 0.15s;
}
.clinic-card:hover {
  border-color: rgba(156, 255, 0, 0.4);
  transform: translateY(-2px);
}
.clinic-card.selected {
  border-color: var(--lime);
}

.clinic-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 0.75rem;
}
.clinic-age-badge {
  display: inline-block;
  background: rgba(156, 255, 0, 0.15);
  color: var(--lime);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 3px;
  margin-bottom: 0.35rem;
}
.clinic-card h3 {
  font-size: 1.25rem;
}

.clinic-spots {
  font-size: 0.8rem;
  font-weight: 700;
  white-space: nowrap;
  padding: 0.2rem 0.6rem;
  border-radius: 100px;
}
.spots-ok {
  background: rgba(34, 197, 94, 0.15);
  color: var(--success);
}
.spots-low {
  background: rgba(245, 158, 11, 0.15);
  color: var(--warning);
}
.spots-full {
  background: rgba(239, 68, 68, 0.15);
  color: var(--danger);
}

.clinic-details {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  font-size: 0.875rem;
  color: var(--gray-300);
  margin-bottom: 0.5rem;
}
.clinic-desc {
  color: var(--gray-500);
  font-size: 0.85rem;
}

.empty-state {
  text-align: center;
  padding: 5rem 1rem;
  color: var(--gray-500);
}
.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}
.empty-state h3 {
  font-size: 1.5rem;
  color: var(--white);
  margin-bottom: 0.5rem;
}

.signup-section {
  margin-top: 3rem;
}
.mailing-cta {
  margin-top: 2.5rem;
  text-align: center;
}
.mailing-cta h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}
.mailing-cta p {
  color: var(--gray-300);
  margin-bottom: 1rem;
}
.signup-header {
  margin-bottom: 1.5rem;
}
.signup-header h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
}
</style>
