import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSignupsStore = defineStore('signups', () => {
  const lessonSignups = ref([])
  const clinicSignups = ref([])
  const clinics = ref([])
  const loading = ref(false)

  async function fetchClinics() {
    const res = await axios.get('/api/clinics')
    clinics.value = res.data
  }

  async function submitLessonSignup(data) {
    const res = await axios.post('/api/signups/lessons', data)
    return res.data
  }

  async function submitClinicSignup(data) {
    const res = await axios.post('/api/signups/clinics', data)
    return res.data
  }

  async function fetchLessonSignups() {
    loading.value = true
    try {
      const res = await axios.get('/api/signups/lessons')
      lessonSignups.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchClinicSignups() {
    loading.value = true
    try {
      const res = await axios.get('/api/signups/clinics')
      clinicSignups.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function updateLessonStatus(id, status) {
    await axios.patch(`/api/signups/lessons/${id}/status`, { status })
    const item = lessonSignups.value.find(s => s.id === id)
    if (item) item.status = status
  }

  async function updateClinicStatus(id, status) {
    await axios.patch(`/api/signups/clinics/${id}/status`, { status })
    const item = clinicSignups.value.find(s => s.id === id)
    if (item) item.status = status
  }

  async function deleteLessonSignup(id) {
    await axios.delete(`/api/signups/lessons/${id}`)
    lessonSignups.value = lessonSignups.value.filter(s => s.id !== id)
  }

  async function deleteClinicSignup(id) {
    await axios.delete(`/api/signups/clinics/${id}`)
    clinicSignups.value = clinicSignups.value.filter(s => s.id !== id)
  }

  async function createClinic(data) {
    const res = await axios.post('/api/clinics', data)
    clinics.value.push(res.data)
    return res.data
  }

  async function deleteClinic(id) {
    await axios.delete(`/api/clinics/${id}`)
    clinics.value = clinics.value.filter(c => c.id !== id)
  }

  return {
    lessonSignups, clinicSignups, clinics, loading,
    fetchClinics, submitLessonSignup, submitClinicSignup,
    fetchLessonSignups, fetchClinicSignups,
    updateLessonStatus, updateClinicStatus,
    deleteLessonSignup, deleteClinicSignup,
    createClinic, deleteClinic
  }
})
