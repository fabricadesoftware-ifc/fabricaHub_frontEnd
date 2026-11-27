import { githubApi } from '@/api/github'
import { projetosApi } from '@/api/projetos'
import { usuariosApi } from '@/api/usuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Papel } from '@/utils/tipos'

// Carga do usuário + projetos feita uma vez por sessão (o guard depende dela).
let carregamento: Promise<void> | null = null

/**
 * Sessão: login com GitHub (simulado), carga do usuário e simulação de papel em dev.
 * Não depende do router, então também funciona dentro do guard.
 */
export function useAuth() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()

  async function entrar() {
    const conta = await githubApi.autenticar(auth.naoAutorizadoSimulado)
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
      if (auth.papelSimulado) await aplicarPapel(auth.papelSimulado)
    })().catch((erro: unknown) => {
      carregamento = null // permite tentar de novo
      throw erro
    })
    return carregamento
  }

  /**
   * Só em desenvolvimento: muda o usuário mockado para simular um papel.
   * admin = isSuper; líder = Jota como idLead; membro = Jota sem liderar nada.
   */
  async function aplicarPapel(papel: Papel) {
    if (!auth.usuario) return
    const id = auth.usuario.id
    const usuario = await usuariosApi.definirSuper(id, papel === 'admin')
    const lista = await projetosApi.definirLideranca(id, papel === 'lider')
    auth.definirUsuario(usuario)
    projetos.substituir(lista)
  }

  /** Só em desenvolvimento (seletor de papel). */
  async function simularPapel(papel: Papel) {
    auth.definirPapelSimulado(papel)
    await aplicarPapel(papel)
  }

  /** Só em desenvolvimento: o próximo login usa a conta sem acesso (ou a autorizada). */
  function simularNaoAutorizado(ativo: boolean) {
    auth.definirNaoAutorizadoSimulado(ativo)
  }

  /**
   * Só em desenvolvimento: abrir com ?papel=membro|lider|admin|nao-autorizado
   * já entra com essa conta/papel (útil para testar rotas por link).
   */
  async function aplicarAtalhoDev() {
    if (!import.meta.env.DEV) return
    const valor = new URLSearchParams(window.location.search).get('papel')
    if (valor === 'nao-autorizado') {
      simularNaoAutorizado(true)
      await entrar()
    } else if (valor === 'membro' || valor === 'lider' || valor === 'admin') {
      simularNaoAutorizado(false)
      auth.definirPapelSimulado(valor)
      if (!auth.logado || !auth.autorizado) await entrar()
      else if (auth.usuario) await aplicarPapel(valor)
    }
  }

  return { entrar, sair, garantirCarregado, simularPapel, simularNaoAutorizado, aplicarAtalhoDev }
}
