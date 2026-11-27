import { ref } from 'vue'
import { tarefasApi } from '@/api/tarefas'
import type { Tarefa } from '@/utils/tipos'

// Estado compartilhado no módulo: sidebar, dashboard e quadro veem a mesma lista,
// então mover uma tarefa atualiza os contadores em todo lugar.
const tarefas = ref<Tarefa[]>([])
const carregando = ref(false)
const erro = ref<string | null>(null)
let carregada = false
let pendente: Promise<void> | null = null

export function useTarefas() {
  /** Carrega uma vez; `forcar` busca de novo (ex.: "Tentar de novo"). */
  function carregar(forcar = false): Promise<void> {
    if (carregada && !forcar) return Promise.resolve()
    pendente ??= (async () => {
      carregando.value = true
      erro.value = null
      try {
        tarefas.value = await tarefasApi.listar()
        carregada = true
      } catch {
        erro.value = 'Não foi possível carregar as tarefas.'
      } finally {
        carregando.value = false
        pendente = null
      }
    })()
    return pendente
  }

  /** Troca uma tarefa da lista pela versão atualizada (depois de mover, por exemplo). */
  function substituir(tarefa: Tarefa) {
    const i = tarefas.value.findIndex((t) => t.id === tarefa.id)
    if (i >= 0) tarefas.value.splice(i, 1, tarefa)
    else tarefas.value.push(tarefa)
  }

  return { tarefas, carregando, erro, carregar, substituir }
}
