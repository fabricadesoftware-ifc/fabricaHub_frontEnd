<script setup lang="ts">
type Variant = 'sucess' | 'warning' | 'danger' | 'info' | 'neutral'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{
    variant?: Variant,
    size?: Size,
    title?: string,
}>(), {
    variant: 'neutral',
    size: 'md'
})

const variantClasses: Record<Variant, string> = {
    sucess: 'border-1 border-green-400 bg-green-300 text-green-600',
    warning: 'border-1 border-yellow-400 bg-yellow-200 text-yellow-600',
    danger: 'border-1 border-red-400 bg-red-300 text-red-600',
    info: 'border-1 border-blue-400 bg-blue-300 text-blue-600',
    neutral: 'border-1 border-gray-400 bg-gray-300 text-gray-600',
}

const sizeClasses: Record<Size, string> = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-3 py-1'
}

</script>
<template>
    <span :class="[
        'rounded-full w-fit h-fit',
        'flex justify-center items-center',
        variantClasses[variant],
        sizeClasses[size]
    ]">{{ props.title }}</span>
</template>