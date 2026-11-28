import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { acessoApi } from '@/api/acesso'
import { comunidadeApi } from '@/api/comunidade'
import { gestaoApi } from '@/api/gestao'
import { noticiasApi } from '@/api/noticias'
import { projetosApi } from '@/api/projetos'
import { tarefasApi } from '@/api/tarefas'
import { usuariosApi } from '@/api/usuarios'
import { useDado } from './useLista'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { CadastroMembro, CadastroEquipe, CadastroNoticia, CadastroProjeto } from '@/utils/gestao'

export const fontesGestao = {
  membros: usuariosApi.listar,
  equipes: comunidadeApi.listarEquipes,
  projetos: projetosApi.listar,
  noticias: noticiasApi.listar,
  tarefas: tarefasApi.listar,
  acessos: acessoApi.listarSolicitacoes,
  logs: gestaoApi.listarLogs,
  tags: gestaoApi.listarTags,
  vinculos: comunidadeApi.listarTimeMembros,
}

export function useCargaGestao<T>(buscar: () => Promise<T | null>) {
  const fonte = useDado(buscar, 'Não foi possível carregar esta seção.')
  onMounted(fonte.carregar)
  return fonte
}

export function useEdicaoGestao() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const router = useRouter()
  const ocupado = ref(false)
  const aviso = ref('')

  async function executar(acao: () => Promise<unknown>, registro: string, destino: string) {
    if (ocupado.value || !auth.usuario?.isSuper) return
    ocupado.value = true
    aviso.value = ''
    const autor = auth.usuario.nome
    const origem = router.currentRoute.value
    try {
      await acao()
      gestaoApi.registrar(autor, registro, destino === 'admin-projetos' ? 'Projeto' : 'Sistema')
      if (router.currentRoute.value === origem) await router.push({ name: auth.usuario?.isSuper ? destino : 'dashboard' })
    } catch (e) {
      aviso.value = e instanceof Error ? e.message : 'Não foi possível concluir a operação.'
    } finally {
      ocupado.value = false
    }
  }

  function salvarMembro(id: number, dados: CadastroMembro) {
    return executar(
      async () => {
        const membro = await usuariosApi.atualizarCadastro(id, dados)
        if (id === auth.idUsuario) auth.definirUsuario(membro)
      },
      'Atualizou o cadastro de ' + dados.nome + '.',
      'admin-membros',
    )
  }

  function salvarProjeto(id: number | null, dados: CadastroProjeto) {
    return executar(
      async () => {
        const projeto = await projetosApi.salvarCadastro(id, dados)
        projetos.substituir([...projetos.lista.filter((p) => p.id !== projeto.id), projeto].sort((a, b) => a.id - b.id))
      },
      'Salvou o projeto ' + dados.nome + '.',
      'admin-projetos',
    )
  }

  function salvarEquipe(id: number | null, dados: CadastroEquipe) {
    return executar(() => comunidadeApi.salvarEquipe(id, dados), 'Salvou a equipe ' + dados.nome + '.', 'admin-equipes')
  }

  function salvarNoticia(id: number | null, dados: CadastroNoticia) {
    return executar(() => noticiasApi.salvar(id, dados), 'Salvou a notícia “' + dados.titulo + '”.', 'admin-noticias')
  }

  function excluir(area: 'equipes' | 'noticias' | 'projetos', id: number, nome: string) {
    if (!window.confirm('Excluir “' + nome + '”? Esta ação é definitiva.')) return
    return executar(
      async () => {
        if (area === 'equipes') await comunidadeApi.excluirEquipe(id)
        if (area === 'noticias') await noticiasApi.excluir(id)
        if (area === 'projetos') {
          await projetosApi.excluirCadastro(id)
          projetos.substituir(projetos.lista.filter((p) => p.id !== id))
        }
      },
      'Excluiu “' + nome + '”.',
      'admin-' + area,
    )
  }
  return { ocupado, aviso, salvarMembro, salvarProjeto, salvarEquipe, salvarNoticia, excluir }
}
