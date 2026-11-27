import { githubApi } from '@/api/github'
import { projetosApi } from '@/api/projetos'
import { usuariosApi } from '@/api/usuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { PerfilDev } from '@/utils/tipos'

const PERFIS: PerfilDev[] = ['membro', 'lider', 'admin', 'nao-autorizado']

// Carga do usuário + projetos feita uma vez por sessão (o guard depende dela).
let carregamento: Promise<void> | null = null

/**
 * Sessão: login com GitHub (simulado) e carga do usuário e dos projetos.
 * Não depende do router, então também funciona dentro do guard.
 */
export function useAuth() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()

  /** Em dev, o perfil escolhido no seletor define qual conta entra (padrão: membro). */
  async function entrar() {
    const conta = await githubApi.autenticar(auth.perfilSimulado ?? 'membro')
    carregamento = null
    auth.iniciarSessao(conta)
  }

  function sair() {
    carregamento = null
    auth.encerrarSessao()
  }

  /** Carrega usuário do sistema e projetos uma única vez. */
  function garantirCarregado(): Promise<void> {
    const id = auth.idUsuario
    if (!auth.autorizado || id === null) return Promise.resolve()
    carregamento ??= (async () => {
      const [usuario, lista] = await Promise.all([usuariosApi.obterPorId(id), projetosApi.listar()])
      auth.definirUsuario(usuario)
      projetos.substituir(lista)
    })().catch((erro: unknown) => {
      carregamento = null // permite tentar de novo
      throw erro
    })
    return carregamento
  }

  /**
   * Só em desenvolvimento (seletor de papel): troca de perfil = entra com outra conta.
   * Membro = Jota · Líder = Daniel · Admin = Peraza · Não autorizado = @igor.dev.
   * Fora do login, só guarda a escolha para o próximo "Entrar com GitHub".
   */
  async function trocarPerfil(perfil: PerfilDev) {
    auth.definirPerfilSimulado(perfil)
    if (!auth.logado) return
    await entrar()
    await garantirCarregado()
  }

  /** Só em desenvolvimento: abrir com ?papel=membro|lider|admin|nao-autorizado já entra com esse perfil. */
  async function aplicarAtalhoDev() {
    if (!import.meta.env.DEV) return
    const valor = new URLSearchParams(window.location.search).get('papel') as PerfilDev | null
    if (!valor || !PERFIS.includes(valor)) return
    auth.definirPerfilSimulado(valor)
    await entrar()
  }

  return { entrar, sair, garantirCarregado, trocarPerfil, aplicarAtalhoDev }
}
