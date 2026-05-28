<script setup lang="ts">

defineOptions({
    inheritAttrs: false
})

type Variant = 'primario' | 'secundario' | 'perigo'
type Size = 'sm' | 'md' | 'lg'

withDefaults(defineProps<{
    variant?: Variant,
    size?: Size,
    disabled?: boolean
}>(), {
    variant: 'primario',
    size: 'md',
    disabled: false
})

const variantClasses: Record<Variant, string> = {
    primario: 'bg-blue-600 hover:bg-blue-800 text-white',
    secundario: 'bg-red-600 hover:bg-red-800 text-white',
    perigo: 'bg-yellow-600 hover:bg-yellow-800 text-white',
}

const sizeClasses: Record<Size, string> = {
    sm: 'py-2 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-5 text-base',
}

</script>

<template>
    <button
        v-bind="$attrs"
        :class="[
            'cursor-pointer rounded-sm transition duration-300 ease',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            variantClasses[variant],
            sizeClasses[size]
        ]"
        :disabled="disabled"
    >
        <slot></slot>
    </button>
</template>
