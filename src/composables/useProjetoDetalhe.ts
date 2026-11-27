import { computed, type Ref } from 'vue'
import { projetosApi } from '@/api/projetos'
import { useEquipes } from '@/composables/useEquipes'
import { estadoDasFontes, useDado, useLista } from '@/composables/useLista'
import { useMensagens } from '@/composables/useMensagens'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import type { StatusTarefa, Usuario } from '@/utils/tipos'

export interface GrupoPessoas {
  id: number
  nome: string
  cor: string
  pessoas: { usuario: Usuario; lider: boolean }[]
}

/** Pasta do projeto (só leitura para o membro): visão geral, tarefas e mensagens. */
export function useProjetoDetalhe(id: Ref<number>) {
  const auth = useAuthStore()
  const projetoFonte = useDado(() => projetosApi.obter(id.value), 'Não foi possível carregar o projeto.')
  const galeriaFonte = useLista(() => projetosApi.listarGaleria(id.value), 'Não foi possível carregar a galeria.')
  const usuariosFonte = useUsuarios()
  const equipesFonte = useEquipes()
  const tarefasFonte = useTarefas()
  const mensagensFonte = useMensagens()
  const { carregando, erro } = estadoDasFontes([
    projetoFonte,
    galeriaFonte,
    usuariosFonte,
    equipesFonte,
    tarefasFonte,
    mensagensFonte,
  ])

  async function carregar() {
    await Promise.all([
      projetoFonte.carregar(),
      galeriaFonte.carregar(),
      usuariosFonte.carregar(),
      equipesFonte.carregar(),
      tarefasFonte.carregar(),
      mensagensFonte.carregar(),
    ])
  }

  const projeto = projetoFonte.dado
  const naoEncontrado = computed(() => !carregando.value && !erro.value && !projeto.value)
  const idUsuario = computed(() => auth.usuario?.id ?? -1)

  const lider = computed(() => (projeto.value ? usuariosFonte.usuario(projeto.value.idLead) : undefined))
  const orientador = computed(() => (projeto.value ? usuariosFonte.usuario(projeto.value.idOrientador) : undefined))

  const minhaFuncao = computed(() => {
    const p = projeto.value
    if (!p) return ''
    if (p.idLead === idUsuario.value) return 'Líder'
    return p.membros.find((m) => m.idUsuario === idUsuario.value)?.funcao ?? ''
  })

  /** Equipes que trabalham no projeto agora. */
  const equipes = computed(() =>
    equipesFonte.equipes.value.filter((e) => e.projetos.some((p) => p.idProjeto === id.value && !p.fim)),
  )

  /**
   * Pessoas agrupadas por equipe: membros atuais das equipes do projeto, mais os membros
   * do projeto sem equipe. Cada pessoa aparece uma vez (líder primeiro); o orientador fica à parte.
   */
  const pessoas = computed(() => {
    const p = projeto.value
    if (!p) return { grupos: [] as GrupoPessoas[], total: 0 }
    const vistos = new Set<number>([p.idOrientador])
    const pessoa = (idPessoa: number) => {
      const usuario = usuariosFonte.usuario(idPessoa)
      if (vistos.has(idPessoa) || !usuario) return []
      vistos.add(idPessoa)
      return [{ usuario, lider: idPessoa === p.idLead }]
    }
    const grupos: GrupoPessoas[] = equipes.value.map((e) => ({
      id: e.id,
      nome: e.nome,
      cor: e.cor,
      pessoas: e.idsMembros.flatMap(pessoa),
    }))
    const semEquipe = [p.idLead, ...p.membros.map((m) => m.idUsuario)].flatMap(pessoa)
    if (semEquipe.length) grupos.push({ id: 0, nome: 'Sem equipe', cor: 'var(--text-subtle)', pessoas: semEquipe })
    const comGente = grupos.filter((g) => g.pessoas.length)
    for (const g of comGente) g.pessoas.sort((a, b) => Number(b.lider) - Number(a.lider))
    return { grupos: comGente, total: comGente.reduce((soma, g) => soma + g.pessoas.length, 0) }
  })

  const tarefas = computed(() => tarefasFonte.tarefas.value.filter((t) => t.idProjeto === id.value))

  const porStatus = computed(() => {
    const contagem: Record<StatusTarefa, number> = { 'A fazer': 0, Fazendo: 0, 'Em revisão': 0, Concluída: 0 }
    for (const t of tarefas.value) contagem[t.status]++
    return contagem
  })

  const percentual = computed(() =>
    tarefas.value.length ? Math.round((porStatus.value['Concluída'] / tarefas.value.length) * 100) : 0,
  )

  /** As 4 tarefas mexidas por último (aprovação ou criação mais recente). */
  const recentes = computed(() =>
    tarefas.value
      .map((tarefa) => ({ tarefa, em: tarefa.aprovadaEm ?? tarefa.criadaEm }))
      .sort((a, b) => b.em.localeCompare(a.em))
      .slice(0, 4),
  )

  const mensagens = computed(() => mensagensFonte.mensagens.value.filter((m) => m.idProjeto === id.value))

  return {
    carregar,
    carregando,
    erro,
    naoEncontrado,
    projeto,
    lider,
    orientador,
    minhaFuncao,
    equipes,
    pessoas,
    tarefas,
    porStatus,
    percentual,
    recentes,
    mensagens,
    galeria: galeriaFonte.dados,
    usuario: usuariosFonte.usuario,
  }
}
