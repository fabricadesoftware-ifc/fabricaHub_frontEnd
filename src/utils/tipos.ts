export type Papel = 'admin' | 'lider' | 'membro'

/** Perfis do seletor de papel em desenvolvimento (cada um entra com uma conta diferente). */
export type PerfilDev = Papel | 'nao-autorizado'

export interface Usuario {
  id: number
  nome: string
  funcao: string
  isSuper: boolean
  online: boolean
  /** Cor do avatar (iniciais). */
  cor: string
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

export type TamanhoTarefa = 'P' | 'M' | 'G'
export type TipoTarefa = 'Feature' | 'Bug' | 'Chore'

export interface Tarefa {
  id: number
  titulo: string
  idProjeto: number
  branch: string
  prioridade: Prioridade
  idResponsavel: number
  status: StatusTarefa
  tamanho: TamanhoTarefa
  /** Previsão de esforço em horas. */
  previsaoHoras: number
  /** Função de quem executa (ex.: Front-end). */
  funcao: string
  tipo: TipoTarefa
  tags: string[]
  descricao: string
  idCriador: number
  /** ISO (data e hora). */
  criadaEm: string
  /** Prazo de entrega, ISO (só a data). */
  prazo?: string
  /** Quando o líder aprovou, ISO (data e hora). */
  aprovadaEm?: string
}

export interface ComentarioTarefa {
  id: number
  idTarefa: number
  idAutor: number
  texto: string
  /** ISO (data e hora). */
  em: string
}

export interface HistoricoTarefa {
  id: number
  idTarefa: number
  status: StatusTarefa
  idAutor: number
  /** Ex.: "começou a tarefa". */
  acao: string
  /** ISO (data e hora). */
  em: string
}

export type TipoEvento = 'reuniao' | 'evento' | 'entrega'

export interface EventoAgenda {
  id: number
  titulo: string
  /** ISO (só a data). */
  data: string
  hora?: string
  idProjeto?: number
  tipo: TipoEvento
  concluido?: boolean
}

export interface Atividade {
  id: number
  idAutor: number
  /** Ex.: "comentou em", "te marcou em", "entrou na equipe". */
  acao: string
  alvo: string
  idTarefa?: number
  haQuantoTempo: string
}

export interface Equipe {
  id: number
  nome: string
  idsMembros: number[]
  idsProjetos: number[]
}

export interface Mensagem {
  id: number
  idRemetente: number
  idProjeto: number
  /** Mensagem sobre uma tarefa específica (aparece o título da tarefa). */
  idTarefa?: number
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
  loginGitHub?: string
}

/** Usuário do GitHub que fez login (pode não ser membro da Fábrica). */
export interface GithubUser {
  login: string
  nome: string
  iniciais: string
}

/** Resultado do login com GitHub: `idUsuario` nulo = conta sem acesso. */
export interface ContaGitHub extends GithubUser {
  idUsuario: number | null
}
