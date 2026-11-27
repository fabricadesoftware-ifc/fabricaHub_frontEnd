import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { lerJson, remover, salvarJson } from '@/utils/armazenamento'
import type { ContaGitHub, GithubUser, Papel, Usuario } from '@/utils/tipos'

const CHAVE_SESSAO = 'fabricahub:sessao'
const CHAVE_DEV = 'fabricahub:dev'

interface Sessao {
  githubUser: GithubUser
  autorizado: boolean
  idUsuario: number | null
}

/** Preferências do seletor de papel (só em desenvolvimento). */
interface PreferenciasDev {
  papel: Papel | null
  naoAutorizado: boolean
}

/**
 * Estado compartilhado da sessão: conta GitHub, usuário logado e papel simulado.
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

  const papelSimulado = ref<Papel | null>(devSalvo?.papel ?? null)
  const naoAutorizadoSimulado = ref(devSalvo?.naoAutorizado ?? false)

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
    salvarJson(CHAVE_DEV, { papel: papelSimulado.value, naoAutorizado: naoAutorizadoSimulado.value } satisfies PreferenciasDev)
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

  function definirPapelSimulado(papel: Papel | null) {
    papelSimulado.value = papel
    salvarDev()
  }

  function definirNaoAutorizadoSimulado(ativo: boolean) {
    naoAutorizadoSimulado.value = ativo
    salvarDev()
  }

  return {
    githubUser,
    autorizado,
    idUsuario,
    usuario,
    logado,
    papelSimulado,
    naoAutorizadoSimulado,
    iniciarSessao,
    encerrarSessao,
    definirUsuario,
    definirPapelSimulado,
    definirNaoAutorizadoSimulado,
  }
})
