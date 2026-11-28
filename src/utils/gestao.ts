import type { Noticia, Periodo, Projeto, Usuario } from './tipos'

export const NOMES_EQUIPES = ['Front-end', 'Back-end', 'Design'] as const
export type NomeEquipe = (typeof NOMES_EQUIPES)[number]
export type CadastroMembro = Pick<Usuario, 'nome' | 'nomeCompleto' | 'curso' | 'funcao' | 'ativo' | 'isSuper' | 'tags'>
export type CadastroProjeto = Pick<Projeto, 'nome' | 'resumo' | 'descricao' | 'status' | 'idLead' | 'idOrientador'>
export type CadastroNoticia = Pick<Noticia, 'titulo' | 'data' | 'categoria' | 'resumo' | 'lide' | 'blocos' | 'autor' | 'destaque'>
export interface VinculoEquipe extends Periodo {
  alvo: number
}
export interface CadastroEquipe {
  nome: NomeEquipe
  desde: string
  membros: VinculoEquipe[]
  projetos: VinculoEquipe[]
}
