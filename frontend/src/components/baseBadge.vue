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
    sucess: 'bg-secundary-green text-primary-green',
    warning: 'bg-secundary-yellow text-primary-yellow',
    danger: 'bg-secundary-red text-primary-red',
    info: 'bg-blue-300 text-blue-600',
    neutral: 'bg-gray-300 text-gray-600',
}

const sizeClasses: Record<Size, string> = {
    sm: 'text-sm px-5 py-0.5',
    md: 'text-base px-5',
    lg: 'text-lg px-6'
}

</script>
<template>
    <span :class="[
        'rounded-full w-fit h-fit font-bold',
        'flex justify-center items-center',
        variantClasses[variant],
        sizeClasses[size]
    ]">{{ props.title }}</span>
</template>