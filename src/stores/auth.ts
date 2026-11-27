import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { lerJson, remover, salvarJson } from '@/utils/armazenamento'
import type { ContaGitHub, GithubUser, PerfilDev, Usuario } from '@/utils/tipos'

const CHAVE_SESSAO = 'fabricahub:sessao'
const CHAVE_DEV = 'fabricahub:dev'

interface Sessao {
  githubUser: GithubUser
  autorizado: boolean
  idUsuario: number | null
}

/** Preferências do seletor de papel (só em desenvolvimento). */
interface PreferenciasDev {
  perfil: PerfilDev | null
}

/**
 * Estado compartilhado da sessão: conta GitHub, usuário logado e perfil simulado (dev).
 * Só guarda e persiste estado; as chamadas à camada `api` ficam em `useAuth`.
 */
export const useAuthStore = defineStore('auth', () => {
  const sessaoSalva = lerJson<Sessao>(CHAVE_SESSAO)
  const devSalvo = import.meta.env.DEV ? lerJson<PreferenciasDev>(CHAVE_DEV) : null

  const githubUser = ref<GithubUser | null>(sessaoSalva?.githubUser ?? null)
  const autorizado = ref(sessaoSalva?.autorizado ?? false)
  const idUsuario = ref<number | null>(sessaoSalva?.idUsuario ?? null)
  /** Usuário do sistema (só existe quando a conta GitHub é autorizada). */
  const usuario = ref<Usuario | null>(null)

  /** Perfil escolhido no seletor de papel; cada perfil entra com uma conta diferente. */
  const perfilSimulado = ref<PerfilDev | null>(devSalvo?.perfil ?? null)

  const logado = computed(() => githubUser.value !== null)

  function salvarSessao() {
    if (!githubUser.value) return remover(CHAVE_SESSAO)
    salvarJson(CHAVE_SESSAO, {
      githubUser: githubUser.value,
      autorizado: autorizado.value,
      idUsuario: idUsuario.value,
    } satisfies Sessao)
  }

  function salvarDev() {
    salvarJson(CHAVE_DEV, { perfil: perfilSimulado.value } satisfies PreferenciasDev)
  }

  function iniciarSessao(conta: ContaGitHub) {
    githubUser.value = { login: conta.login, nome: conta.nome, iniciais: conta.iniciais }
    idUsuario.value = conta.idUsuario
    autorizado.value = conta.idUsuario !== null
    usuario.value = null
    salvarSessao()
  }

  function encerrarSessao() {
    githubUser.value = null
    autorizado.value = false
    idUsuario.value = null
    usuario.value = null
    salvarSessao()
  }

  function definirUsuario(novo: Usuario | null) {
    usuario.value = novo
  }

  function definirPerfilSimulado(perfil: PerfilDev) {
    perfilSimulado.value = perfil
    salvarDev()
  }

  return {
    githubUser,
    autorizado,
    idUsuario,
    usuario,
    logado,
    perfilSimulado,
    iniciarSessao,
    encerrarSessao,
    definirUsuario,
    definirPerfilSimulado,
  }
})
