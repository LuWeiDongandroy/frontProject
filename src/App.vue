<script setup>
import { ref } from 'vue'

const loading = ref(false)
const result = ref(null)
const error = ref('')

async function callApi() {
  loading.value = true
  error.value = ''
  result.value = null
  try {
    const res = await fetch('/api/hello')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    result.value = await res.json()
  } catch (e) {
    error.value = e.message || '请求失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="page">
    <h1>前后端部署 Demo</h1>
    <p class="desc">Vue 前端调用 Python FastAPI 接口</p>
    <button :disabled="loading" @click="callApi">
      {{ loading ? '请求中…' : '调用 /api/hello' }}
    </button>

    <pre v-if="result" class="ok">{{ JSON.stringify(result, null, 2) }}</pre>
    <p v-if="error" class="err">{{ error }}</p>
  </main>
</template>
