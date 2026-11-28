import { atividadeGenerica, atividadesGithub } from '@/mocks/github'
import { desempenhos, ID_USUARIO_LOGADO, usuarios as usuariosMock } from '@/mocks/usuarios'
import { respostaMock } from '@/utils/respostaMock'
import type { AtividadeGithub, DadosPerfil, DesempenhoMembro, Usuario } from '@/utils/tipos'

import { lerJson, salvarJson } from '@/utils/armazenamento'
import { isoDia } from '@/utils/datas'
import type { GithubUser } from '@/utils/tipos'

const chave = 'fabricahub:usuarios'
export const usuarios: Usuario[] = lerJson(chave) ?? structuredClone(usuariosMock)
export function salvarUsuarios() { salvarJson(chave, usuarios) }
export function autorizarConta(conta: GithubUser) {
  let usuario = usuarios.find(u => u.usuario === conta.login)
  if (!usuario) {
    const id = Math.max(0, ...usuarios.map(u => u.id)) + 1
    usuario = { id, registro: Math.max(0, ...usuarios.map(u => u.registro)) + 1, nome: conta.nome, nomeCompleto: conta.nome,
      usuario: conta.login, iniciais: conta.iniciais, funcao: 'Membro', isSuper: false, online: false, cor: '#12B0AE',
      foto: null, curso: '', ativo: true, vinculo: 'Membro', desde: isoDia(new Date()), bio: '', links: [] }
    usuarios.push(usuario)
  }
  usuario.ativo = true
  salvarUsuarios()
  return usuario.id
}

/** Limite da biografia (o back-end também valida). */
export const MAX_BIO = 280

export const usuariosApi = {
  async atualizarCadastro(id: number, dados: import('@/utils/gestao').CadastroMembro) {
    if (![dados.nome, dados.nomeCompleto, dados.curso, dados.funcao].every((texto) => texto.trim())) {
      throw new Error('Preencha os dados de identificação do membro.')
    }
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) throw new Error('Membro não encontrado.')
    Object.assign(usuario, structuredClone(dados))
    salvarUsuarios()
    return respostaMock(usuario)
  },

  // Futuro: client.get<Usuario>(`/usuarios/${id}`)
  obterPorId(id: number = ID_USUARIO_LOGADO): Promise<Usuario> {
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) return Promise.reject(new Error(`Usuário ${id} não encontrado`))
    return respostaMock(usuario)
  },

  // Futuro: client.get<Usuario[]>('/usuarios')
  listar(): Promise<Usuario[]> {
    return respostaMock(usuarios)
  },

  // Futuro: client.get<DesempenhoMembro>(`/usuarios/${id}/desempenho`)
  obterDesempenho(id: number): Promise<DesempenhoMembro> {
    return respostaMock(desempenhos[id] ?? { concluidas: 0, fazendo: 0, emRevisao: 0, dePrimeira: 0, devolvidas: 0 })
  },

  // Futuro: client.get<AtividadeGithub>(`/usuarios/${id}/github`)
  obterAtividadeGithub(id: number): Promise<AtividadeGithub> {
    return respostaMock(atividadesGithub[id] ?? atividadeGenerica(id))
  },

  /** Nome e usuário vêm do GitHub e não mudam aqui. */
  // Futuro: client.patch<Usuario>(`/usuarios/${id}`, dados)
  atualizarPerfil(id: number, dados: DadosPerfil): Promise<Usuario> {
    const usuario = usuarios.find((u) => u.id === id)
    if (!usuario) return Promise.reject(new Error(`Usuário ${id} não encontrado`))
    if (dados.bio.length > MAX_BIO) return Promise.reject(new Error('Biografia maior que o permitido'))
    Object.assign(usuario, structuredClone(dados))
    salvarUsuarios()
    return respostaMock(usuario)
  },
}
