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

export const comunidadeApi = {
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
