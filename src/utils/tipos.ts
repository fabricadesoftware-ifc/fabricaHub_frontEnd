export type Papel = 'admin' | 'lider' | 'membro'

export interface Usuario {
  id: number
  nome: string
  funcao: string
  matricula: number
  isSuper: boolean
  online: boolean
}

export type StatusProjeto = 'Em andamento' | 'Planejamento' | 'Pausado' | 'Concluído'
export type Prioridade = 'Alta' | 'Média' | 'Baixa'
export type StatusTarefa = 'A fazer' | 'Fazendo' | 'Em revisão' | 'Concluída'

export interface MembroProjeto {
  idUsuario: number
  funcao: string
}

export interface Projeto {
  id: number
  nome: string
  sigla: string
  cor: string
  status: StatusProjeto
  idOrientador: number
  idLead: number
  tecnologias: string[]
  membros: MembroProjeto[]
  progresso: number
}

export interface Tarefa {
  id: number
  titulo: string
  idProjeto: number
  branch: string
  prioridade: Prioridade
  idResponsavel: number
  status: StatusTarefa
}

export interface Mensagem {
  id: number
  idRemetente: number
  idProjeto: number
  texto: string
  haQuantoTempo: string
  lida: boolean
}

export interface Noticia {
  id: number
  titulo: string
  data: string
  texto: string
  nova: boolean
}

export interface SolicitacaoAcesso {
  id: number
  nome: string
  tag: string
  pendente: boolean
}
