import { atividadeGenerica, atividadesGithub } from '@/mocks/github'
import { desempenhos, ID_USUARIO_LOGADO, usuarios as usuariosMock } from '@/mocks/usuarios'
import { respostaMock } from '@/utils/respostaMock'
import type { AtividadeGithub, DadosPerfil, DesempenhoMembro, Usuario } from '@/utils/tipos'

const usuarios: Usuario[] = structuredClone(usuariosMock)

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
    return respostaMock(usuario)
  },
}
