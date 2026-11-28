import { computed, reactive, ref, watch, type Ref } from 'vue'
import { tarefasApi } from '@/api/tarefas'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Prioridade, TamanhoTarefa, Tarefa } from '@/utils/tipos'

import { catalogo } from '@/api/cadastros'
export const FUNCOES = catalogo.Funções
export const PRIORIDADES = catalogo.Prioridades
export const TAMANHOS: TamanhoTarefa[] = ['P', 'M', 'G']

const PALAVRAS_VAZIAS = ['tela', 'para', 'com', 'dos', 'das', 'nos', 'nas', 'uma', 'por']

/** "Tela de turmas no celular" → "turmas-celular" (sem acento e sem palavras curtas). */
function slug(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((p) => p.length > 2 && !PALAVRAS_VAZIAS.includes(p))
    .slice(0, 3)
    .join('-')
}

interface FormTarefa {
  titulo: string
  descricao: string
  branch: string
  idResponsavel: number | null
  funcao: string
  prioridade: Prioridade
  tamanho: TamanhoTarefa
  /** 'YYYY-MM-DD' ou vazio. */
  prazo: string
}

/** Formulário "Nova tarefa" do líder, com a branch sugerida a partir do título. */
export function useNovaTarefa(idProjeto: Ref<number | null>) {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const tarefasFonte = useTarefas()
  const usuariosFonte = useUsuarios()

  const projeto = computed(() => {
    const liderados = projetos.lista.filter((p) => p.idLead === auth.usuario?.id)
    return liderados.find((p) => p.id === idProjeto.value) ?? liderados[0] ?? null
  })

  const form = reactive<FormTarefa>({
    titulo: '',
    descricao: '',
    branch: 'feat/',
    idResponsavel: null,
    funcao: 'Front-end',
    prioridade: PRIORIDADES.includes('Média') ? 'Média' : PRIORIDADES[0] ?? '',
    tamanho: 'M',
    prazo: '',
  })
  const branchEditada = ref(false)
  const enviando = ref(false)
  const erro = ref('')
  const tentouEnviar = ref(false)

  // Enquanto o líder não mexer na branch, ela acompanha o título.
  watch(
    () => form.titulo,
    (titulo) => {
      if (!branchEditada.value) form.branch = `feat/${slug(titulo)}`
    },
  )

  // Escolher o responsável já puxa a função dele no projeto.
  watch(
    () => form.idResponsavel,
    (id) => {
      const funcao = projeto.value?.membros.find((m) => m.idUsuario === id)?.funcao
      if (funcao) form.funcao = funcao
    },
  )

  /** Membros do projeto (líder incluído). */
  const membros = computed(() => {
    const p = projeto.value
    if (!p) return []
    const ids = [...new Set([p.idLead, ...p.membros.map((m) => m.idUsuario)])]
    return ids.flatMap((id) => {
      const u = usuariosFonte.usuario(id)
      return u ? [{ valor: String(u.id), rotulo: u.nome }] : []
    })
  })

  const responsavel = computed(() => usuariosFonte.usuario(form.idResponsavel ?? -1))
  const erros = computed(() => ({
    titulo: form.titulo.trim() ? '' : 'Dê um título para a tarefa.',
    responsavel: form.idResponsavel === null ? 'Escolha quem vai fazer.' : '',
  }))
  const valido = computed(() => !erros.value.titulo && !erros.value.responsavel)
  /** Número que a tarefa vai receber (recalcula quando a lista muda). */
  const numero = computed(() => (tarefasFonte.tarefas.value.length >= 0 ? tarefasApi.proximoId() : 0))

  async function carregar() {
    await Promise.all([usuariosFonte.carregar(), tarefasFonte.carregar()])
  }

  function marcarBranchEditada() {
    branchEditada.value = true
  }

  /** Devolve a tarefa criada, ou null se faltou algo ou deu erro. */
  async function criar(): Promise<Tarefa | null> {
    tentouEnviar.value = true
    if (!valido.value || !projeto.value || !auth.usuario || enviando.value) return null
    enviando.value = true
    erro.value = ''
    try {
      const nova = await tarefasApi.criar(
        {
          titulo: form.titulo.trim(),
          descricao: form.descricao.trim(),
          branch: form.branch.trim(),
          idProjeto: projeto.value.id,
          idResponsavel: form.idResponsavel!,
          funcao: form.funcao,
          prioridade: form.prioridade,
          tamanho: form.tamanho,
          prazo: form.prazo || undefined,
        },
        auth.usuario.id,
      )
      tarefasFonte.substituir(nova)
      return nova
    } catch {
      erro.value = 'Não foi possível criar a tarefa. O que você preencheu continua aqui; tente de novo.'
      return null
    } finally {
      enviando.value = false
    }
  }

  return {
    carregar,
    carregando: usuariosFonte.carregando,
    projeto,
    form,
    membros,
    responsavel,
    numero,
    erros,
    tentouEnviar,
    enviando,
    erro,
    criar,
    marcarBranchEditada,
  }
}
