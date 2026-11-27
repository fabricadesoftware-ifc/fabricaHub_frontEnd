import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

export type EstadoEtapa = 'concluida' | 'atual' | 'pendente'

const ROTULOS = ['Autorizado no GitHub', 'Verificando acesso à Fábrica', 'Preparando seu painel']

/**
 * Faz o login (simulado) e avança as 3 etapas a cada `intervalo` ms.
 * No fim vai para `/carregando` (e de lá ao dashboard) se a conta for autorizada, senão para `/403`.
 */
export function useRedirecionamento(intervalo = 700) {
  const auth = useAuthStore()
  const { entrar } = useAuth()
  const router = useRouter()

  const atual = ref(0)
  let timer: ReturnType<typeof setInterval> | undefined
  let login: Promise<void> = Promise.resolve()
  let concluido = false

  const etapas = computed(() =>
    ROTULOS.map((rotulo, i) => ({
      rotulo,
      estado: (i < atual.value ? 'concluida' : i === atual.value ? 'atual' : 'pendente') as EstadoEtapa,
    })),
  )
  const progresso = computed(() => Math.round((atual.value / ROTULOS.length) * 100))
  const mensagemStatus = computed(() => {
    const etapa = ROTULOS[Math.min(atual.value, ROTULOS.length - 1)]
    return atual.value >= ROTULOS.length ? 'Pronto. Abrindo o FabricaHUB.' : `${etapa}…`
  })

  function parar() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  /** Também usado pelo "Clique aqui": pula a animação. */
  async function concluir() {
    if (concluido) return
    concluido = true
    parar()
    atual.value = ROTULOS.length
    await login
    await router.replace(auth.autorizado ? { name: 'carregando' } : { name: 'acesso-negado' })
  }

  onMounted(() => {
    login = entrar()
    timer = setInterval(() => {
      atual.value += 1
      if (atual.value >= ROTULOS.length) concluir()
    }, intervalo)
  })

  onBeforeUnmount(parar)

  return { etapas, progresso, mensagemStatus, concluir }
}
