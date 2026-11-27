export type Papel = 'admin' | 'lider' | 'membro'

/** Perfis do seletor de papel em desenvolvimento (cada um entra com uma conta diferente). */
export type PerfilDev = Papel | 'nao-autorizado'

export type TipoLink = 'GitHub' | 'LinkedIn' | 'Site'

export interface LinkPerfil {
  tipo: TipoLink
  url: string
}

export interface Usuario {
  id: number
  /** Nome curto (menu, mensagens, crachá da sidebar). */
  nome: string
  /** Nome completo (vem do GitHub). */
  nomeCompleto: string
  /** Login do GitHub, sem o @. */
  usuario: string
  iniciais: string
  funcao: string
  isSuper: boolean
  online: boolean
  /** Cor do avatar (iniciais). */
  cor: string
  /** Foto enviada pelo usuário (data URL); sem foto, usa as iniciais. */
  foto: string | null
  /** Ex.: "Informática · Técnico integrado". */
  curso: string
  ativo: boolean
  /** Ex.: "Bolsista". */
  vinculo: string
  /** Entrada na Fábrica, ISO (só a data). */
  desde: string
  /** Número do crachá. */
  registro: number
  bio: string
  links: LinkPerfil[]
}

/** Campos que o próprio membro edita em "Meu perfil" (nome e usuário vêm do GitHub). */
export type DadosPerfil = Pick<Usuario, 'foto' | 'curso' | 'bio' | 'links'>

/** Papel exibido no crachá da comunidade (cor da faixa). */
export type PapelComunidade = 'lider' | 'membro' | 'orientador'

export interface DesempenhoMembro {
  concluidas: number
  fazendo: number
  emRevisao: number
  /** % de tarefas aprovadas sem devolução. */
  dePrimeira: number
  devolvidas: number
}

export interface PullRequest {
  repositorio: string
  numero: number
  titulo: string
  /** ISO (só a data). */
  data: string
}

export interface AtividadeGithub {
  commits: number
  pullRequests: number
  /** ISO (só a data). */
  ultimaAtividade: string
  /** Últimos 6 meses, do mais antigo ao atual. */
  commitsPorMes: { mes: string; total: number }[]
  prsRecentes: PullRequest[]
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
  /** Frase curta do card. */
  resumo: string
  descricao: string
  tecnologias: string[]
  membros: MembroProjeto[]
  progresso: number
  repositorio?: string
  figma?: string
}

export type TipoArquivoGaleria = 'LOGO' | 'BANNER' | 'TELA'

export interface ImagemGaleria {
  id: number
  idProjeto: number
  /** Nome do arquivo (ex.: "logo.png"). */
  arquivo: string
  tipo: TipoArquivoGaleria
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

/** Período de algo (ISO, só a data). Sem `fim` = atual. */
export interface Periodo {
  inicio: string
  fim?: string
}

export interface ProjetoEquipe extends Periodo {
  idProjeto: number
}

export interface Equipe {
  id: number
  nome: string
  cor: string
  /** Criação da equipe, ISO (só a data). */
  desde: string
  /** Membros atuais (derivado de `Time_Membro`). */
  idsMembros: number[]
  idsProjetos: number[]
  projetos: ProjetoEquipe[]
}

/** Tabela `Time_Membro`: entrada e saída de cada pessoa numa equipe. */
export interface TimeMembro extends Periodo {
  id: number
  idEquipe: number
  idUsuario: number
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
