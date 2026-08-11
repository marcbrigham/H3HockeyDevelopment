<template>
  <main>
    <div class="page-hero">
      <div class="container">
        <p class="section-label">Stay Connected</p>
        <h1>Join the H3 Mailing List</h1>
        <p>
          Get updates about upcoming clinics, training opportunities, and player
          development.
        </p>
      </div>
    </div>

    <section class="section">
      <div class="container mailing-container">
        <div class="card">
          <div v-if="success" class="alert alert-success">
            Thanks for joining the H3 mailing list! We'll send updates to
            <strong>{{ form.parentGuardianEmail }}</strong
            >.
          </div>
          <div v-if="error" class="alert alert-error">{{ error }}</div>

          <form v-if="!success" @submit.prevent="submit">
            <div class="form-group">
              <label>Player Name (First, Last) *</label>
              <input
                v-model="form.playerName"
                required
                placeholder="First Last"
              />
            </div>
            <div class="grid-2">
              <div class="form-group">
                <label>Player Position *</label>
                <select v-model="form.playerPosition" required>
                  <option value="">Select position</option>
                  <option value="forward">Forward</option>
                  <option value="defense">Defense</option>
                  <option value="goalie">Goalie</option>
                </select>
              </div>
              <div class="form-group">
                <label>Player Birth Year *</label>
                <input
                  v-model="form.playerBirthYear"
                  type="number"
                  required
                  min="1900"
                  :max="currentYear"
                  placeholder="e.g. 2014"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Player's Most Recent Team *</label>
              <input
                v-model="form.mostRecentTeam"
                required
                placeholder="Team name"
              />
            </div>
            <div class="form-group">
              <label>Parent / Guardian Email Address *</label>
              <input
                v-model="form.parentGuardianEmail"
                type="email"
                required
                placeholder="you@email.com"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="submitting"
            >
              {{ submitting ? "Joining…" : "Join the Mailing List" }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useSignupsStore } from "../stores/signups";

const store = useSignupsStore();
const currentYear = new Date().getFullYear();
const submitting = ref(false);
const success = ref(false);
const error = ref("");
const form = reactive({
  playerName: "",
  playerPosition: "",
  playerBirthYear: "",
  mostRecentTeam: "",
  parentGuardianEmail: "",
});

async function submit() {
  submitting.value = true;
  error.value = "";
  try {
    await store.submitMailingSubscriber({ ...form });
    success.value = true;
  } catch (err) {
    error.value =
      err.response?.data?.error || "Something went wrong. Please try again.";
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.mailing-container {
  max-width: 700px;
}
.mailing-container .card {
  padding: 2.25rem;
}
@media (max-width: 600px) {
  .mailing-container .card {
    padding: 1.25rem;
  }
}
</style>
