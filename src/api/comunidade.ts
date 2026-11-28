import { NOMES_EQUIPES, type CadastroEquipe, type VinculoEquipe } from '@/utils/gestao'
import { atividades, equipes, timeMembros, type EquipeMock } from '@/mocks/comunidade'
import { respostaMock } from '@/utils/respostaMock'
import type { Atividade, Equipe, TimeMembro } from '@/utils/tipos'

/** Monta a equipe com os membros atuais (sem `fim` em Time_Membro). */
function comMembros(equipe: EquipeMock): Equipe {
  return {
    ...equipe,
    idsMembros: timeMembros.filter((t) => t.idEquipe === equipe.id && !t.fim).map((t) => t.idUsuario),
    idsProjetos: equipe.projetos.filter((p) => !p.fim).map((p) => p.idProjeto),
  }
}

let proximaEquipe = Math.max(0, ...equipes.map((e) => e.id)) + 1

function validarPeriodos(vinculos: VinculoEquipe[]) {
  for (const [i, v] of vinculos.entries()) {
    if (!v.alvo || !v.inicio || (v.fim && v.fim < v.inicio)) throw new Error('Confira o vínculo e as datas de entrada e saída.')
    if (
      vinculos
        .slice(0, i)
        .some((outro) => outro.alvo === v.alvo && (!outro.fim || outro.fim >= v.inicio) && (!v.fim || v.fim >= outro.inicio))
    ) {
      throw new Error('Os períodos do mesmo vínculo não podem se sobrepor.')
    }
  }
}

export const comunidadeApi = {
  async salvarEquipe(id: number | null, dados: CadastroEquipe) {
    if (!NOMES_EQUIPES.includes(dados.nome) || equipes.some((e) => e.nome === dados.nome && e.id !== id)) {
      throw new Error('Escolha uma das três equipes que ainda não esteja cadastrada.')
    }
    validarPeriodos(dados.membros)
    validarPeriodos(dados.projetos)
    const cores = { 'Front-end': '#FF6600', 'Back-end': '#2A2AFF', Design: '#12B0AE' }
    const equipe =
      id === null
        ? { id: proximaEquipe++, nome: dados.nome, desde: dados.desde, cor: cores[dados.nome], projetos: [] }
        : equipes.find((e) => e.id === id)
    if (!equipe) throw new Error('Equipe não encontrada.')
    Object.assign(equipe, {
      nome: dados.nome,
      desde: dados.desde,
      cor: cores[dados.nome],
      projetos: dados.projetos.map(({ alvo, ...periodo }) => ({ idProjeto: alvo, ...periodo })),
    })
    if (id === null) equipes.push(equipe)
    let proximo = Math.max(0, ...timeMembros.map((m) => m.id)) + 1
    timeMembros.splice(
      0,
      timeMembros.length,
      ...timeMembros.filter((m) => m.idEquipe !== equipe.id),
      ...dados.membros.map(({ alvo, ...periodo }) => ({ id: proximo++, idEquipe: equipe.id, idUsuario: alvo, ...periodo })),
    )
    return respostaMock(undefined)
  },
  async excluirEquipe(id: number) {
    const indice = equipes.findIndex((e) => e.id === id)
    if (indice < 0) throw new Error('Equipe não encontrada.')
    equipes.splice(indice, 1)
    timeMembros.splice(0, timeMembros.length, ...timeMembros.filter((m) => m.idEquipe !== id))
    return respostaMock(undefined)
  },

  // Futuro: client.get<Atividade[]>('/atividades')
  listarAtividades(): Promise<Atividade[]> {
    return respostaMock(atividades)
  },

  // Futuro: client.get<Equipe[]>('/equipes')
  listarEquipes(): Promise<Equipe[]> {
    return respostaMock(equipes.map(comMembros))
  },

  // Futuro: client.get<Equipe>(`/equipes/${id}`)
  obterEquipe(id: number): Promise<Equipe | null> {
    const equipe = equipes.find((e) => e.id === id)
    return respostaMock(equipe ? comMembros(equipe) : null)
  },

  /** Entradas e saídas (Time_Membro). Filtra por equipe e/ou por pessoa. */
  // Futuro: client.get<TimeMembro[]>('/time-membros', { params: { equipe, usuario } })
  listarTimeMembros(filtro: { idEquipe?: number; idUsuario?: number } = {}): Promise<TimeMembro[]> {
    return respostaMock(
      timeMembros.filter(
        (t) =>
          (filtro.idEquipe === undefined || t.idEquipe === filtro.idEquipe) &&
          (filtro.idUsuario === undefined || t.idUsuario === filtro.idUsuario),
      ),
    )
  },
}
