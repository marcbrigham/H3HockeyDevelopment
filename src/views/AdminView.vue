<template>
  <main>
    <div class="admin-header">
      <div class="container">
        <div class="admin-title-row">
          <div>
            <p class="section-label">Admin</p>
            <h1 style="font-size:2.5rem;">Dashboard</h1>
          </div>
          <div class="header-stats">
            <div class="stat-chip"><strong>{{ store.lessonSignups.length }}</strong><span>Lesson Requests</span></div>
            <div class="stat-chip"><strong>{{ store.clinicSignups.length }}</strong><span>Clinic Signups</span></div>
          </div>
        </div>

        <div class="tabs">
          <button class="tab" :class="{ active: tab === 'lessons' }" @click="tab = 'lessons'">
            🏒 Lesson Requests ({{ store.lessonSignups.length }})
          </button>
          <button class="tab" :class="{ active: tab === 'clinics' }" @click="tab = 'clinics'">
            🥅 Clinic Signups ({{ store.clinicSignups.length }})
          </button>
          <button class="tab" :class="{ active: tab === 'manage-clinics' }" @click="tab = 'manage-clinics'">
            ⚙️ Manage Clinics
          </button>
        </div>
      </div>
    </div>

    <section class="section" style="padding-top:2rem;">
      <div class="container">

        <!-- Loading -->
        <div v-if="store.loading" class="empty-state">Loading…</div>

        <!-- Lesson Signups Tab -->
        <div v-else-if="tab === 'lessons'">
          <div v-if="!store.lessonSignups.length" class="empty-state">
            <div class="empty-icon">📋</div>
            <h3>No Lesson Requests Yet</h3>
            <p>Lesson signups will appear here.</p>
          </div>
          <div v-else class="roster-table-wrap">
            <table class="roster-table">
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Age</th>
                  <th>Position</th>
                  <th>Parent</th>
                  <th>Contact</th>
                  <th>Notes</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="s in store.lessonSignups" :key="s.id">
                  <td><strong>{{ s.player.playerName }}</strong></td>
                  <td>{{ s.player.age }}</td>
                  <td class="pos-cell">{{ capitalize(s.player.position) }}</td>
                  <td>{{ s.player.parentName }}</td>
                  <td>
                    <a :href="`mailto:${s.player.email}`">{{ s.player.email }}</a><br>
                    <small class="text-muted">{{ s.player.phone }}</small>
                  </td>
                  <td class="notes-cell">{{ s.player.notes || '—' }}</td>
                  <td>
                    <span :class="`badge badge-${s.status}`">{{ s.status }}</span>
                  </td>
                  <td>
                    <div class="action-row">
                      <select class="status-select" :value="s.status" @change="updateLessonStatus(s.id, $event.target.value)">
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      <button class="btn btn-danger btn-sm" @click="deleteLessonSignup(s.id)">×</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Clinic Signups Tab -->
        <div v-else-if="tab === 'clinics'">
          <div v-if="!store.clinicSignups.length" class="empty-state">
            <div class="empty-icon">🥅</div>
            <h3>No Clinic Signups Yet</h3>
            <p>Clinic registrations will appear here.</p>
          </div>
          <div v-else>
            <!-- Group by clinic -->
            <div v-for="clinic in clinicsWithSignups" :key="clinic.id" class="clinic-group">
              <div class="clinic-group-header">
                <h3>{{ clinic.name }}</h3>
                <div class="clinic-meta">
                  <span>{{ formatDate(clinic.date) }}</span>
                  <span>{{ clinic.signups.length }} / {{ clinic.maxPlayers }} registered</span>
                </div>
              </div>
              <div class="roster-table-wrap">
                <table class="roster-table">
                  <thead>
                    <tr>
                      <th>Player</th>
                      <th>Age</th>
                      <th>Position</th>
                      <th>Parent</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="s in clinic.signups" :key="s.id">
                      <td><strong>{{ s.player.playerName }}</strong></td>
                      <td>{{ s.player.age }}</td>
                      <td>{{ capitalize(s.player.position) }}</td>
                      <td>{{ s.player.parentName }}</td>
                      <td>
                        <a :href="`mailto:${s.player.email}`">{{ s.player.email }}</a><br>
                        <small class="text-muted">{{ s.player.phone }}</small>
                      </td>
                      <td><span :class="`badge badge-${s.status}`">{{ s.status }}</span></td>
                      <td>
                        <div class="action-row">
                          <select class="status-select" :value="s.status" @change="updateClinicStatus(s.id, $event.target.value)">
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                          <button class="btn btn-danger btn-sm" @click="deleteClinicSignup(s.id)">×</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <!-- Manage Clinics Tab -->
        <div v-else-if="tab === 'manage-clinics'">
          <div class="manage-clinics-layout">
            <!-- Create clinic form -->
            <div class="card">
              <h3 style="font-size:1.5rem; margin-bottom:1.25rem;">Add New Clinic</h3>
              <div v-if="clinicSuccess" class="alert alert-success">Clinic created!</div>
              <div v-if="clinicError" class="alert alert-error">{{ clinicError }}</div>
              <form @submit.prevent="createClinic">
                <div class="form-group">
                  <label>Clinic Name *</label>
                  <input v-model="clinicForm.name" required placeholder="e.g. Spring Skills Clinic" />
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Date *</label>
                    <input v-model="clinicForm.date" type="date" required />
                  </div>
                  <div class="form-group">
                    <label>Time *</label>
                    <input v-model="clinicForm.time" required placeholder="e.g. 10:00 AM – 12:00 PM" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Location *</label>
                  <input v-model="clinicForm.location" required placeholder="Rink name and address" />
                </div>
                <div class="grid-2">
                  <div class="form-group">
                    <label>Age Group *</label>
                    <input v-model="clinicForm.ageGroup" required placeholder="e.g. Mites (8U)" />
                  </div>
                  <div class="form-group">
                    <label>Max Players</label>
                    <input v-model="clinicForm.maxPlayers" type="number" min="1" max="100" placeholder="20" />
                  </div>
                </div>
                <div class="form-group">
                  <label>Description</label>
                  <textarea v-model="clinicForm.description" rows="2" placeholder="Brief description of the clinic focus"></textarea>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="creatingClinic" style="width:100%;justify-content:center;">
                  {{ creatingClinic ? 'Creating…' : '+ Add Clinic' }}
                </button>
              </form>
            </div>

            <!-- Existing clinics -->
            <div>
              <h3 style="font-size:1.4rem; margin-bottom:1rem;">Existing Clinics</h3>
              <div v-if="!store.clinics.length" class="empty-state" style="padding:2rem 0;">
                <p>No clinics created yet.</p>
              </div>
              <div v-else class="clinic-list">
                <div v-for="c in store.clinics" :key="c.id" class="card clinic-list-item">
                  <div class="clinic-list-info">
                    <strong>{{ c.name }}</strong>
                    <div class="clinic-list-meta">
                      <span>{{ formatDate(c.date) }}</span>
                      <span>{{ c.time }}</span>
                      <span>{{ c.location }}</span>
                      <span class="text-lime">{{ c.ageGroup }}</span>
                      <span class="text-muted">{{ c._count?.signups ?? 0 }}/{{ c.maxPlayers }} spots filled</span>
                    </div>
                  </div>
                  <button class="btn btn-danger btn-sm" @click="deleteClinic(c.id)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useSignupsStore } from '../stores/signups'

const store = useSignupsStore()
const tab = ref('lessons')

const clinicForm = reactive({ name: '', date: '', time: '', location: '', ageGroup: '', maxPlayers: 20, description: '' })
const creatingClinic = ref(false)
const clinicSuccess = ref(false)
const clinicError = ref('')

onMounted(async () => {
  await Promise.all([store.fetchLessonSignups(), store.fetchClinicSignups(), store.fetchClinics()])
})

const clinicsWithSignups = computed(() => {
  const map = {}
  store.clinicSignups.forEach(s => {
    const id = s.clinic.id
    if (!map[id]) map[id] = { ...s.clinic, signups: [] }
    map[id].signups.push(s)
  })
  return Object.values(map)
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
}

function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : '' }

async function updateLessonStatus(id, status) { await store.updateLessonStatus(id, status) }
async function updateClinicStatus(id, status) { await store.updateClinicStatus(id, status) }
async function deleteLessonSignup(id) { if (confirm('Remove this signup?')) await store.deleteLessonSignup(id) }
async function deleteClinicSignup(id) { if (confirm('Remove this signup?')) await store.deleteClinicSignup(id) }
async function deleteClinic(id) { if (confirm('Delete this clinic and all its signups?')) await store.deleteClinic(id) }

async function createClinic() {
  creatingClinic.value = true
  clinicSuccess.value = false
  clinicError.value = ''
  try {
    await store.createClinic({ ...clinicForm, maxPlayers: parseInt(clinicForm.maxPlayers) || 20 })
    clinicSuccess.value = true
    Object.assign(clinicForm, { name: '', date: '', time: '', location: '', ageGroup: '', maxPlayers: 20, description: '' })
  } catch (err) {
    clinicError.value = err.response?.data?.error || 'Failed to create clinic.'
  } finally {
    creatingClinic.value = false
  }
}
</script>

<style scoped>
.admin-header {
  position: relative;
  z-index: 1;
  background: rgba(19, 26, 43, 0.88);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 2px solid rgba(156,255,0,0.2);
  padding: 6rem 0 0;
}
.admin-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}
.header-stats { display: flex; gap: 1rem; }
.stat-chip {
  background: var(--navy-light);
  border: 1px solid rgba(156,255,0,0.15);
  border-radius: 8px;
  padding: 0.75rem 1.25rem;
  text-align: center;
  min-width: 100px;
}
.stat-chip strong { display: block; font-family: 'Tomorrow', system-ui, -apple-system, sans-serif; font-size: 1.75rem; font-weight: 700; color: var(--lime); }
.stat-chip span { font-size: 0.7rem; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.08em; }

.tabs { display: flex; gap: 0; border-top: 1px solid rgba(255,255,255,0.08); }
.tab {
  background: none;
  border: none;
  color: var(--gray-500);
  cursor: pointer;
  font-family: 'Tomorrow', system-ui, -apple-system, sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 0.9rem 1.5rem;
  text-transform: uppercase;
  transition: color 0.2s;
  border-bottom: 3px solid transparent;
  margin-bottom: -2px;
}
.tab:hover { color: var(--white); }
.tab.active { color: var(--lime); border-bottom-color: var(--lime); }

.roster-table-wrap { overflow-x: auto; }
.roster-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}
.roster-table th {
  background: var(--navy);
  color: var(--gray-500);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 0.6rem 0.9rem;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
.roster-table td {
  background: var(--navy-light);
  border-bottom: 1px solid rgba(255,255,255,0.06);
  padding: 0.75rem 0.9rem;
  vertical-align: middle;
}
.roster-table tr:hover td { background: rgba(255,255,255,0.03); }
.roster-table a { color: var(--lime); font-size: 0.85rem; }
.notes-cell { max-width: 200px; color: var(--gray-500); font-size: 0.8rem; }

.action-row { display: flex; gap: 0.5rem; align-items: center; }
.status-select {
  background: var(--navy);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 4px;
  color: var(--white);
  font-size: 0.8rem;
  padding: 0.3rem 0.5rem;
  cursor: pointer;
}

.clinic-group { margin-bottom: 2.5rem; }
.clinic-group-header { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 0.75rem; flex-wrap: wrap; gap: 0.5rem; }
.clinic-group-header h3 { font-size: 1.4rem; }
.clinic-meta { display: flex; gap: 1rem; font-size: 0.85rem; color: var(--gray-500); }

.manage-clinics-layout { display: grid; grid-template-columns: 400px 1fr; gap: 2rem; align-items: start; }
@media (max-width: 900px) { .manage-clinics-layout { grid-template-columns: 1fr; } }

.clinic-list { display: flex; flex-direction: column; gap: 0.75rem; }
.clinic-list-item { display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 1rem 1.25rem; }
.clinic-list-info strong { display: block; font-family: 'Tomorrow', system-ui, -apple-system, sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.3rem; }
.clinic-list-meta { display: flex; gap: 1rem; font-size: 0.8rem; color: var(--gray-500); flex-wrap: wrap; }

.empty-state { text-align: center; padding: 4rem 1rem; color: var(--gray-500); }
.empty-icon { font-size: 2.5rem; margin-bottom: 0.75rem; }
.empty-state h3 { font-size: 1.4rem; color: var(--white); margin-bottom: 0.4rem; }
.pos-cell { text-transform: capitalize; }
</style>
