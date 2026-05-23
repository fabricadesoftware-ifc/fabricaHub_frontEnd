<script setup lang="ts">

type inputType = 'text' | 'password'

const props = withDefaults(defineProps<{
    modelValue?: string,
    label?: string,
    placeholder?: string,
    type?: inputType,
    error?: string,
    disabled?: boolean
}>(), {
    type: 'text'
})

defineEmits<{
    'update:modelValue': [value: string]
}>()

</script>
<template>
    <div class="h-fit">

        <label 
        for="baseInput"
        v-if="props.label" 
        class="flex flex-col gap-1">
        {{ props.label }}
        </label>

        <input 
        id="baseInput"
        :value="props.modelValue"
        :type="props.type" 
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :class="[
            'w-full rounded-sm border py-2 px-3 text-sm outline-none transition duration-200',
            'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
            error?.trim()
            ? 'border-red-600 focus:ring-1 focus:ring-red-300'
            : 'border-gray-300 focus:ring-1 focus:ring-blue-300'
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
        
        <span 
        v-if="error"
        class="text-xs text-red-500
        ">{{ props.error }}</span>
    </div>
</template>