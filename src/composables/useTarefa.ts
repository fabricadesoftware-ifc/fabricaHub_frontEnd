import { computed, ref, watch, type Ref } from 'vue'
import { discussaoApi } from '@/api/discussao'
import { tarefasApi } from '@/api/tarefas'
import { useMoverTarefa } from '@/composables/useMoverTarefa'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { ComentarioTarefa, HistoricoTarefa, StatusTarefa, Tarefa } from '@/utils/tipos'

/** Ficha da tarefa: dados, discussão e histórico de status. */
export function useTarefa(id: Ref<number>) {
  const auth = useAuthStore()
  const projetosStore = useProjetosStore()
  const { usuario, carregar: carregarUsuarios } = useUsuarios()
  const { movendo, erroMover, destinos, mover: moverTarefa } = useMoverTarefa()

  const tarefa = ref<Tarefa | null>(null)
  const comentarios = ref<ComentarioTarefa[]>([])
  const historico = ref<HistoricoTarefa[]>([])
  const carregando = ref(true)
  const erro = ref<string | null>(null)
  const naoEncontrada = ref(false)

  const comentando = ref(false)
  const erroComentario = ref<string | null>(null)

  const projeto = computed(() => projetosStore.lista.find((p) => p.id === tarefa.value?.idProjeto) ?? null)
  const destinosPossiveis = computed(() => (tarefa.value ? destinos(tarefa.value) : []))

  async function carregar() {
    carregando.value = true
    erro.value = null
    naoEncontrada.value = false
    try {
      const [encontrada, lista, eventos] = await Promise.all([
        tarefasApi.obter(id.value),
        discussaoApi.listarComentarios(id.value),
        discussaoApi.listarHistorico(id.value),
        carregarUsuarios(),
      ])
      tarefa.value = encontrada
      naoEncontrada.value = encontrada === null
      comentarios.value = lista
      historico.value = eventos
    } catch {
      erro.value = 'Não foi possível carregar a tarefa.'
    } finally {
      carregando.value = false
    }
  }

  async function comentar(texto: string): Promise<boolean> {
    const limpo = texto.trim()
    if (!limpo || !auth.usuario || comentando.value) return false
    comentando.value = true
    erroComentario.value = null
    try {
      comentarios.value.push(await discussaoApi.comentar(id.value, auth.usuario.id, limpo))
      return true
    } catch {
      erroComentario.value = 'Não foi possível enviar o comentário.'
      return false
    } finally {
      comentando.value = false
    }
  }

  async function mover(para: StatusTarefa) {
    if (!tarefa.value) return
    const atualizada = await moverTarefa(tarefa.value, para)
    if (atualizada) {
      tarefa.value = atualizada
      historico.value = await discussaoApi.listarHistorico(id.value)
    }
  }

  watch(id, carregar, { immediate: true })

  return {
    tarefa,
    projeto,
    comentarios,
    historico,
    carregando,
    erro,
    naoEncontrada,
    carregar,
    usuario,
    comentando,
    erroComentario,
    comentar,
    movendo,
    erroMover,
    destinosPossiveis,
    mover,
  }
}
