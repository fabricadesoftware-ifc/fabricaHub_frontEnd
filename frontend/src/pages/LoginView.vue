<script setup lang="ts">
import { ref } from 'vue'

import BaseInput from '@/components/baseInput.vue'
import BaseButton from '@/components/baseButton.vue'

const username = ref('')
const password = ref('')

const usernameError = ref('')
const passwordError = ref('')

const handleLogin = () => {
    usernameError.value = ''
    passwordError.value = ''

    if (!username.value.trim()) {
        usernameError.value = 'Usuário é obrigatório'
    }

    if (!password.value.trim()) {
        passwordError.value = 'Senha é obrigatória'
    }

    if (
        usernameError.value ||
        passwordError.value
    ) {
        return
    }

    console.log({
        username: username.value,
        password: password.value
    })
}
</script>

<template>
    <div class="min-h-screen bg-orange-50 flex items-center justify-center px-4">

        <div class="w-full max-w-md bg-white rounded-lg shadow-md p-8">

            <div class="mb-8 text-center">

                <h1 class="text-3xl font-bold text-[var(--color-primary-text)]">
                    FabricaHub
                </h1>

                <p class="text-sm text-[var(--color-secundary-text)] mt-2">
                    Entre na plataforma
                </p>

            </div>

            <form
                class="flex flex-col gap-5"
                @submit.prevent="handleLogin"
            >

                <BaseInput
                    v-model="username"
                    label="Usuário"
                    placeholder="Digite seu usuário"
                    :error="usernameError"
                />

                <BaseInput
                    v-model="password"
                    type="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    :error="passwordError"
                />

                <BaseButton
                    type="submit"
                    size="lg"
                    class="w-full"
                >
                    Entrar
                </BaseButton>

            </form>

        </div>

    </div>
</template>
