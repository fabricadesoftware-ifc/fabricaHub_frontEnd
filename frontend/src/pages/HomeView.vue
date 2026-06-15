<script setup lang="ts">
import { useRouter } from 'vue-router'

import BaseButton from '@/components/baseButton.vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Home</h1>
  <div class="p-6">
    <BaseButton
      variant="secundario"
      @click="handleLogout"
    >
      Logout
    </BaseButton>
  </div>
</template>
