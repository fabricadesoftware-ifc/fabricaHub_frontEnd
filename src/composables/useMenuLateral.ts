import { computed } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import type { NomeIcone } from '@/components/global/IconeSvg.vue'
import { useRole } from '@/composables/useRole'
import { useAtividadeStore } from '@/stores/atividade'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'

export interface ItemMenu {
  rotulo: string
  icone: NomeIcone
  para: RouteLocationRaw
  contador?: number
  /** Contador laranja (pede atenção). */
  atencao?: boolean
  /** Bolinha de novidade, sem número. */
  novidade?: boolean
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
  const atividade = useAtividadeStore()
  const { papel, leadsProject } = useRole()

  const idUsuario = computed(() => auth.usuario?.id)

  const minhasTarefasAbertas = computed(() =>
    atividade.tarefas.filter((t) => t.idResponsavel === idUsuario.value && t.status !== 'Concluída'),
  )
  const naoLidas = computed(() => atividade.mensagens.filter((m) => !m.lida).length)
  const temNoticiaNova = computed(() => atividade.noticias.some((n) => n.nova))
  const revisoesPendentes = computed(
    () => atividade.tarefas.filter((t) => t.status === 'Em revisão' && leadsProject(t.idProjeto)).length,
  )
  const acessosPendentes = computed(() => atividade.solicitacoes.filter((s) => s.pendente).length)

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

  return { secoes, pastas, minhasTarefasAbertas, naoLidas, revisoesPendentes, acessosPendentes }
}
