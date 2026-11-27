import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

/** Ações de tela do login: entrar com GitHub e trocar de conta (também usado pelo botão Sair). */
export function useLogin() {
  const router = useRouter()
  const { sair } = useAuth()

  const entrando = ref(false)

  /** Futuro: redireciona para o OAuth do GitHub. Por enquanto vai direto para /redirecionando. */
  async function entrarComGitHub() {
    if (entrando.value) return
    entrando.value = true
    await new Promise((resolver) => setTimeout(resolver, 500))
    await router.push({ name: 'redirecionando' })
  }

  async function trocarConta() {
    sair()
    await router.push({ name: 'login' })
  }

  return { entrando, entrarComGitHub, trocarConta }
}
