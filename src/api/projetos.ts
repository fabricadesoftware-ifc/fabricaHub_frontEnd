import { galeria as galeriaMock, projetos as projetosMock } from '@/mocks/projetos'
import { respostaMock } from '@/utils/respostaMock'
import type { DadosProjeto, ImagemGaleria, NovaImagem, Projeto, TipoArquivoGaleria } from '@/utils/tipos'

const projetos: Projeto[] = structuredClone(projetosMock)
const galeria: ImagemGaleria[] = structuredClone(galeriaMock)

function encontrar(id: number): Projeto {
  const projeto = projetos.find((p) => p.id === id)
  if (!projeto) throw new Error(`Projeto ${id} não encontrado`)
  return projeto
}

/** Erros síncronos viram Promise rejeitada (o composable trata igual a erro de rede). */
function tentar<T>(acao: () => T): Promise<T> {
  try {
    return respostaMock(acao())
  } catch (erro) {
    return Promise.reject(erro)
  }
}

/** O projeto só tem uma logo: a anterior vira "Outro". */
function garantirLogoUnica(idProjeto: number, idNovaLogo: number) {
  for (const imagem of galeria) {
    if (imagem.idProjeto === idProjeto && imagem.tipo === 'LOGO' && imagem.id !== idNovaLogo) imagem.tipo = 'OUTRO'
  }
}

export const projetosApi = {
  // Futuro: client.get<Projeto[]>('/projetos')
  listar(): Promise<Projeto[]> {
    return respostaMock(projetos)
  },

  // Futuro: client.get<Projeto>(`/projetos/${id}`)
  obter(id: number): Promise<Projeto | null> {
    return respostaMock(projetos.find((p) => p.id === id) ?? null)
  },

  /** Líder e orientador não mudam por aqui (só o admin). */
  // Futuro: client.patch<Projeto>(`/projetos/${id}`, dados)
  atualizar(id: number, dados: DadosProjeto): Promise<Projeto> {
    return tentar(() => Object.assign(encontrar(id), structuredClone(dados)))
  },

  // Futuro: client.post<Projeto>(`/projetos/${id}/membros`, { usuario, funcao })
  adicionarMembro(id: number, idUsuario: number, funcao: string): Promise<Projeto> {
    return tentar(() => {
      const projeto = encontrar(id)
      if (projeto.membros.some((m) => m.idUsuario === idUsuario)) throw new Error('Já está no projeto')
      projeto.membros.push({ idUsuario, funcao, desde: new Date().toISOString().slice(0, 10) })
      return projeto
    })
  },

  // Futuro: client.patch<Projeto>(`/projetos/${id}/membros/${idUsuario}`, { funcao })
  trocarFuncao(id: number, idUsuario: number, funcao: string): Promise<Projeto> {
    return tentar(() => {
      const projeto = encontrar(id)
      const membro = projeto.membros.find((m) => m.idUsuario === idUsuario)
      if (!membro) throw new Error('Não está no projeto')
      membro.funcao = funcao
      return projeto
    })
  },

  /** O líder não pode ser removido por aqui. */
  // Futuro: client.delete<Projeto>(`/projetos/${id}/membros/${idUsuario}`)
  removerMembro(id: number, idUsuario: number): Promise<Projeto> {
    return tentar(() => {
      const projeto = encontrar(id)
      if (projeto.idLead === idUsuario) throw new Error('O líder não pode ser removido')
      projeto.membros = projeto.membros.filter((m) => m.idUsuario !== idUsuario)
      return projeto
    })
  },

  // Futuro: client.get<ImagemGaleria[]>(`/projetos/${id}/galeria`)
  listarGaleria(id: number): Promise<ImagemGaleria[]> {
    return respostaMock(galeria.filter((g) => g.idProjeto === id))
  },

  // Futuro: client.post<ImagemGaleria>(`/projetos/${id}/galeria`, formData)
  enviarImagem(id: number, dados: NovaImagem): Promise<ImagemGaleria> {
    return tentar(() => {
      encontrar(id)
      const nova: ImagemGaleria = {
        ...dados,
        id: Math.max(0, ...galeria.map((g) => g.id)) + 1,
        idProjeto: id,
        data: new Date().toISOString().slice(0, 10),
      }
      galeria.push(nova)
      if (nova.tipo === 'LOGO') garantirLogoUnica(id, nova.id)
      return nova
    })
  },

  /** Devolve a galeria inteira do projeto (trocar para logo muda a logo anterior). */
  // Futuro: client.patch<ImagemGaleria[]>(`/galeria/${idImagem}`, { tipo })
  trocarTipoImagem(idImagem: number, tipo: TipoArquivoGaleria): Promise<ImagemGaleria[]> {
    return tentar(() => {
      const imagem = galeria.find((g) => g.id === idImagem)
      if (!imagem) throw new Error(`Imagem ${idImagem} não encontrada`)
      imagem.tipo = tipo
      if (tipo === 'LOGO') garantirLogoUnica(imagem.idProjeto, imagem.id)
      return galeria.filter((g) => g.idProjeto === imagem.idProjeto)
    })
  },

  // Futuro: client.delete(`/galeria/${idImagem}`)
  removerImagem(idImagem: number): Promise<void> {
    return tentar(() => {
      const i = galeria.findIndex((g) => g.id === idImagem)
      if (i < 0) throw new Error(`Imagem ${idImagem} não encontrada`)
      galeria.splice(i, 1)
    })
  },
}
