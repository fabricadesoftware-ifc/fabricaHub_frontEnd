import { ref } from 'vue'
import { tarefasApi } from '@/api/tarefas'
import { useTarefas } from '@/composables/useTarefas'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { destinosDaTarefa, podeMoverTarefa } from '@/utils/permissoes'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

/** Mover tarefa entre colunas, respeitando a regra do membro e do líder (ver utils/permissoes.ts). */
export function useMoverTarefa() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const { substituir } = useTarefas()

  /** Id da tarefa que está sendo movida (para desabilitar os botões dela). */
  const movendo = ref<number | null>(null)
  const erroMover = ref<string | null>(null)

  function destinos(tarefa: Tarefa): StatusTarefa[] {
    return destinosDaTarefa(auth.usuario, tarefa, projetos.lista)
  }

  async function mover(tarefa: Tarefa, para: StatusTarefa): Promise<Tarefa | null> {
    if (movendo.value !== null || !auth.usuario) return null
    if (!podeMoverTarefa(auth.usuario, tarefa, para, projetos.lista)) {
      erroMover.value = 'Você não pode mover esta tarefa para esse status.'
      return null
    }
    movendo.value = tarefa.id
    erroMover.value = null
    try {
      const atualizada = await tarefasApi.atualizarStatus(tarefa.id, para, auth.usuario.id)
      substituir(atualizada)
      return atualizada
    } catch {
      erroMover.value = 'Não foi possível mover a tarefa. Tente de novo.'
      return null
    } finally {
      movendo.value = null
    }
  }

  return { movendo, erroMover, destinos, mover }
}
