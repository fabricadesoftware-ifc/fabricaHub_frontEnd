<script setup lang="ts">
import { RouterView } from 'vue-router'

import BaseToast from '@/components/baseToast.vue'

import { useUiStore } from '@/stores/ui'

const uiStore = useUiStore()
</script>

<template>

    <RouterView />

    <div
        v-if="uiStore.show"
        class="fixed top-5 right-5 z-50"
    >
        <BaseToast
            :message="uiStore.message"
            :type="uiStore.type"
        />
    </div>

</template>

<style scoped></style>
