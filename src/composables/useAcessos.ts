import { ref } from 'vue'
import { useLista } from '@/composables/useLista'
import { acessoApi } from '@/api/acesso'
import { useAuthStore } from '@/stores/auth'

/** Pedidos de acesso: lista (admin) e "Pedir acesso" (tela 403). */
export function useAcessos() {
  const auth = useAuthStore()
  const { dados: solicitacoes, carregando, erro, carregar } = useLista(
    () => acessoApi.listarSolicitacoes(),
    'Não foi possível carregar os pedidos de acesso.',
  )

  const pedindo = ref(false)
  const pedidoEnviado = ref(false)
  const erroPedido = ref<string | null>(null)

  async function pedirAcesso() {
    if (!auth.githubUser || pedindo.value || pedidoEnviado.value) return
    pedindo.value = true
    erroPedido.value = null
    try {
      await acessoApi.criarPedido(auth.githubUser)
      pedidoEnviado.value = true
    } catch {
      erroPedido.value = 'Não foi possível enviar o pedido. Tente de novo.'
    } finally {
      pedindo.value = false
    }
  }

  return { solicitacoes, carregando, erro, carregar, pedindo, pedidoEnviado, erroPedido, pedirAcesso }
}
