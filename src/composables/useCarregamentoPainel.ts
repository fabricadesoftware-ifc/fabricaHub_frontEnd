import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const ETAPAS = [
  { ate: 25, texto: 'Conferindo seu crachá' },
  { ate: 55, texto: 'Separando suas fichas de tarefas' },
  { ate: 85, texto: 'Abrindo seus projetos' },
  { ate: 100, texto: 'Arrumando a mesa' },
]

/** Enquanto os dados não chegam, a barra para aqui e espera. */
const TETO_ESPERANDO = 90

/**
 * Carrega usuário e projetos (`garantirCarregado`) enquanto mostra o progresso.
 * A porcentagem só chega a 100 quando os dados terminam; depois abre o dashboard.
 */
export function useCarregamentoPainel(passoMs = 30) {
  const router = useRouter()
  const { garantirCarregado } = useAuth()

  const progresso = ref(0)
  const pronto = ref(false)
  const erro = ref<string | null>(null)
  let timer: ReturnType<typeof setInterval> | undefined
  let saida: ReturnType<typeof setTimeout> | undefined
  let saindo = false

  const etapa = computed(() => (ETAPAS.find((e) => progresso.value < e.ate) ?? ETAPAS.at(-1)!).texto)

  function parar() {
    if (timer) clearInterval(timer)
    if (saida) clearTimeout(saida)
    timer = undefined
    saida = undefined
  }

  function avancar() {
    const teto = pronto.value ? 100 : TETO_ESPERANDO
    if (progresso.value < teto) progresso.value = Math.min(teto, progresso.value + (pronto.value ? 3 : 1))
    if (progresso.value >= 100 && !saindo) {
      saindo = true
      parar()
      saida = setTimeout(() => router.replace({ name: 'dashboard' }), 250)
    }
  }

  async function iniciar() {
    erro.value = null
    pronto.value = false
    progresso.value = 0
    saindo = false
    parar()
    timer = setInterval(avancar, passoMs)
    try {
      await garantirCarregado()
      pronto.value = true
    } catch {
      parar()
      erro.value = 'Não foi possível carregar seu painel.'
    }
  }

  onMounted(iniciar)
  onBeforeUnmount(parar)

  return { progresso, etapa, erro, tentarDeNovo: iniciar }
}
