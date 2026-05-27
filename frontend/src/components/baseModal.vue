<script setup lang="ts">

const props = defineProps < {
    modelValue?: boolean,
    title?: string
} > ()

const emit = defineEmits < {
    'update:modelValue': [value: boolean]
} > ()

const fechar = () => emit('update:modelValue', false)

</script>
<template>
    <Teleport to="body">
        <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="fechar">

            <div class="bg-gray-50 rounded-sm shadow-lg w-full max-w-md mx-4">

                <div class="flex items-center justify-between px-5 py-4 ">
                    <h2 class="text-base font-semibold text-gray-800">{{ props.title }}</h2>
                    <button class="text-gray-400 hover:text-gray-600 transition cursor-pointer" @click="fechar">✕</button>
                </div>

                <div class="px-5 py-4">
                    <slot />
                </div>

                <div v-if="$slots.footer" class="px-5 py-4 flex justify-end gap-2">
                    <slot name="footer" />
                </div>

            </div>
        </div>
    </Teleport>
</template>