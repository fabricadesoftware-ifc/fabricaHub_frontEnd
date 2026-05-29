<script setup lang="ts">

type ToastType = 'success' | 'error'

const props = defineProps<{
    message: string
    type?: ToastType
}>()

const typeClasses: Record<ToastType, string> = {
    success: 'bg-[var(--color-primary-green)] text-white',
    error: 'bg-[var(--color-primary-red)] text-white'
}

</script>

<template>
    <div
        :class="[
            'min-w-[300px] max-w-[400px]',
            'px-4 py-3 rounded-md shadow-lg',
            'text-sm font-medium',
            'animate-fade-in',
            typeClasses[props.type || 'success']
        ]"
    >
        {{ props.message }}
    </div>
</template>

<style scoped>
@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in {
    animation: fade-in 0.2s ease-out;
}
</style>
