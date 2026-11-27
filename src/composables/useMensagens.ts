import { ref } from 'vue'
import { mensagensApi } from '@/api/mensagens'
import type { Mensagem } from '@/utils/tipos'

// Estado compartilhado no módulo: sidebar, dashboard e caixa de entrada veem a mesma lista,
// então abrir uma conversa zera o contador de não lidas em todo lugar.
const mensagens = ref<Mensagem[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)
let carregada = false
let pendente: Promise<void> | null = null

export function useMensagens() {
  /** Carrega uma vez; `forcar` busca de novo (ex.: "Tentar de novo"). */
  function carregar(forcar = false): Promise<void> {
    if (carregada && !forcar) return Promise.resolve()
    pendente ??= (async () => {
      carregando.value = true
      erro.value = null
      try {
        mensagens.value = await mensagensApi.listar()
        carregada = true
      } catch {
        erro.value = 'Não foi possível carregar as mensagens.'
      } finally {
        carregando.value = false
        pendente = null
      }
    })()
    return pendente
  }

  function adicionar(mensagem: Mensagem) {
    mensagens.value.push(mensagem)
  }

  /** Reflete na lista o que `mensagensApi.marcarLidas` fez no servidor. */
  function marcarLidasLocal(idConversa: number, idUsuario: number) {
    for (const m of mensagens.value) if (m.idConversa === idConversa && m.idRemetente !== idUsuario) m.lida = true
  }

  return { mensagens, carregando, erro, carregar, adicionar, marcarLidasLocal }
}
