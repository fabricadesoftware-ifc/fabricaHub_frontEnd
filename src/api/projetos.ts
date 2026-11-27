import { liderancasAlternativas, projetos as projetosMock } from '@/mocks/projetos'
import { respostaMock } from '@/utils/respostaMock'
import type { Projeto } from '@/utils/tipos'

const projetos: Projeto[] = structuredClone(projetosMock)
// Lideranças originais do mock, para poder devolvê-las ao simular "líder".
const lideresOriginais = new Map(projetosMock.map((p) => [p.id, p.idLead]))

export const projetosApi = {
  // Futuro: client.get<Projeto[]>('/projetos')
  listar(): Promise<Projeto[]> {
    return respostaMock(projetos)
  },

  /**
   * Só para o seletor de papel em desenvolvimento.
   * `lidera = true` devolve ao usuário os projetos que ele lidera no mock;
   * `false` passa essas lideranças para outra pessoa.
   */
  definirLideranca(idUsuario: number, lidera: boolean): Promise<Projeto[]> {
    for (const projeto of projetos) {
      if (lideresOriginais.get(projeto.id) !== idUsuario) continue
      projeto.idLead = lidera ? idUsuario : (liderancasAlternativas[projeto.id] ?? projeto.idLead)
    }
    return respostaMock(projetos)
  },
}
