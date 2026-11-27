import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router'
import type { NomeIcone } from '@/components/global/IconeSvg.vue'
import { useAcessos } from '@/composables/useAcessos'
import { useMensagens } from '@/composables/useMensagens'
import { useNoticias } from '@/composables/useNoticias'
import { useRole } from '@/composables/useRole'
import { useTarefas } from '@/composables/useTarefas'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { isoDia } from '@/utils/datas'

export interface ItemMenu {
  rotulo: string
  icone: NomeIcone
  para: RouteLocationRaw
  contador?: number
  /** Contador laranja (pede atenção). */
  atencao?: boolean
  /** Bolinha de novidade, sem número. */
  novidade?: boolean
  ativo?: boolean
}

export interface SecaoMenu {
  etiqueta: string
  itens: ItemMenu[]
}

export interface PastaMenu {
  id: number
  nome: string
  cor: string
  aba: string
  progresso?: number
}

export function useMenuLateral() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const { tarefas, carregar: carregarTarefas } = useTarefas()
  const { mensagens, carregar: carregarMensagens } = useMensagens()
  const { noticias, carregar: carregarNoticias } = useNoticias()
  const { solicitacoes, carregar: carregarSolicitacoes } = useAcessos()

  // Contadores da sidebar: carrega tudo junto ao montar.
  // Até tudo chegar, a sidebar mostra o skeleton (evita contadores zerados piscando).
  const carregando = ref(true)
  onMounted(async () => {
    await Promise.all([carregarTarefas(), carregarMensagens(), carregarNoticias(), carregarSolicitacoes()])
    carregando.value = false
  })
  const { papel, leadsProject } = useRole()

  const idUsuario = computed(() => auth.usuario?.id)

  const minhasTarefasAbertas = computed(() =>
    tarefas.value.filter((t) => t.idResponsavel === idUsuario.value && t.status !== 'Concluída'),
  )
  const naoLidas = computed(() => mensagens.value.filter((m) => !m.lida && m.idRemetente !== idUsuario.value).length)
  const temNoticiaNova = computed(() => noticias.value.some((n) => n.nova))
  const revisoesPendentes = computed(
    () => tarefas.value.filter((t) => t.status === 'Em revisão' && leadsProject(t.idProjeto)).length,
  )
  const acessosPendentes = computed(() => solicitacoes.value.filter((s) => s.pendente).length)

  /** Projetos em que o usuário é membro ou líder; os que ele lidera vêm primeiro. */
  const meusProjetos = computed(() => {
    const id = idUsuario.value
    return projetos.lista
      .filter((p) => p.idLead === id || p.membros.some((m) => m.idUsuario === id))
      .sort((a, b) => Number(b.idLead === id) - Number(a.idLead === id))
  })

  const primeiroProjetoLiderado = computed(() => meusProjetos.value.find((p) => p.idLead === idUsuario.value))

  const secoes = computed<SecaoMenu[]>(() => {
    const mensagens: ItemMenu = {
      rotulo: 'Mensagens',
      icone: 'mensagens',
      para: { name: 'mensagens' },
      contador: naoLidas.value,
      atencao: papel.value === 'membro',
    }

    if (papel.value === 'admin') {
      return [
        {
          etiqueta: '01 · GESTÃO',
          itens: [
            { rotulo: 'Dashboard', icone: 'dashboard', para: { name: 'dashboard' } },
            { rotulo: 'Acessos', icone: 'acessos', para: { name: 'admin-acessos' }, contador: acessosPendentes.value, atencao: true },
            { rotulo: 'Membros', icone: 'membros', para: { name: 'admin-membros' } },
            { rotulo: 'Projetos', icone: 'projetos', para: { name: 'admin-projetos' } },
            { rotulo: 'Equipes', icone: 'equipes', para: { name: 'admin-equipes' } },
            { rotulo: 'Todas as tarefas', icone: 'tarefas', para: { name: 'admin-tarefas' } },
            { rotulo: 'Notícias', icone: 'noticias', para: { name: 'admin-noticias' } },
          ],
        },
        {
          etiqueta: '02 · SISTEMA',
          itens: [
            { rotulo: 'Cadastros', icone: 'cadastros', para: { name: 'admin-cadastros' } },
            { rotulo: 'Tags de acesso', icone: 'tags', para: { name: 'admin-tags' } },
            { rotulo: 'Logs e auditoria', icone: 'logs', para: { name: 'admin-logs' } },
            { rotulo: 'Arquivos', icone: 'arquivos', para: { name: 'admin-arquivos' } },
            { rotulo: 'Permissões', icone: 'permissoes', para: { name: 'admin-permissoes' } },
          ],
        },
      ]
    }

    const trabalho: ItemMenu[] =
      papel.value === 'lider'
        ? [
            { rotulo: 'Dashboard', icone: 'dashboard', para: { name: 'dashboard' } },
            {
              rotulo: 'Tarefas do projeto',
              icone: 'tarefas',
              para: primeiroProjetoLiderado.value
                ? { name: 'projeto-tarefas', params: { id: primeiroProjetoLiderado.value.id } }
                : { name: 'tarefas' },
            },
            { rotulo: 'Revisões', icone: 'revisoes', para: { name: 'revisoes' }, contador: revisoesPendentes.value, atencao: true },
            { rotulo: 'Projetos', icone: 'projetos', para: { name: 'projetos' } },
            mensagens,
          ]
        : [
            { rotulo: 'Dashboard', icone: 'dashboard', para: { name: 'dashboard' } },
            { rotulo: 'Minhas tarefas', icone: 'tarefas', para: { name: 'tarefas' }, contador: minhasTarefasAbertas.value.length },
            { rotulo: 'Projetos', icone: 'projetos', para: { name: 'projetos' } },
            mensagens,
          ]

    return [
      { etiqueta: '01 · TRABALHO', itens: trabalho },
      {
        etiqueta: '02 · COMUNIDADE',
        itens: [
          { rotulo: 'Equipes', icone: 'equipes', para: { name: 'equipes' } },
          { rotulo: 'Membros', icone: 'membros', para: { name: 'membros' } },
          { rotulo: 'Notícias', icone: 'noticias', para: { name: 'noticias' }, novidade: temNoticiaNova.value },
        ],
      },
    ]
  })

  const pastas = computed<PastaMenu[]>(() => {
    if (papel.value === 'admin') return []
    const ehLider = papel.value === 'lider'
    return meusProjetos.value.map((p) => {
      if (ehLider) {
        return { id: p.id, nome: p.nome, cor: p.cor, aba: `${p.sigla} · ${p.idLead === idUsuario.value ? 'LÍDER' : 'MEMBRO'}` }
      }
      const qtd = minhasTarefasAbertas.value.filter((t) => t.idProjeto === p.id).length
      return {
        id: p.id,
        nome: p.nome,
        cor: p.cor,
        aba: `${p.sigla} · ${qtd} ${qtd === 1 ? 'TAREFA' : 'TAREFAS'}`,
        progresso: p.progresso,
      }
    })
  })

  const router = useRouter()
  const rota = useRoute()

  /**
   * Marca um único item ativo: o de caminho mais específico que bate com a rota atual
   * (exato, mesma rota com outro parâmetro, ou sub-rota). Ex.: em /projetos/3/tarefas ganha
   * "Tarefas do projeto" (mesmo que o link aponte para /projetos/1/tarefas), não "Projetos".
   */
  const secoesComAtivo = computed<SecaoMenu[]>(() => {
    const atual = rota.path
    let melhor: ItemMenu | null = null
    let tamanho = -1
    for (const secao of secoes.value) {
      for (const item of secao.itens) {
        const destino = router.resolve(item.para)
        const caminho = destino.path
        const mesmaRota = atual === caminho || (destino.name !== undefined && destino.name === rota.name)
        const subRota = caminho !== '/' && atual.startsWith(`${caminho}/`)
        // Rota exata/mesma rota sempre vence uma sub-rota; entre sub-rotas, vence a mais longa.
        const peso = mesmaRota ? Number.MAX_SAFE_INTEGER : subRota ? caminho.length : -1
        if (peso > tamanho) {
          melhor = item
          tamanho = peso
        }
      }
    }
    return secoes.value.map((secao) => ({
      ...secao,
      itens: secao.itens.map((item) => ({ ...item, ativo: item === melhor })),
    }))
  })

  /** Tarefa aberta com o prazo mais próximo (de hoje em diante). */
  const proximaEntrega = computed(() => {
    const hoje = isoDia(new Date())
    const tarefa = minhasTarefasAbertas.value
      .filter((t) => t.prazo && t.prazo >= hoje)
      .sort((a, b) => a.prazo!.localeCompare(b.prazo!))[0]
    if (!tarefa) return null
    const projeto = projetos.lista.find((p) => p.id === tarefa.idProjeto)
    return {
      idTarefa: tarefa.id,
      titulo: tarefa.titulo,
      projeto: projeto?.nome.split(' ')[0] ?? '',
      prazo: tarefa.prazo!,
    }
  })

  return { carregando, secoes: secoesComAtivo, pastas, proximaEntrega, minhasTarefasAbertas, naoLidas, revisoesPendentes, acessosPendentes }
}
