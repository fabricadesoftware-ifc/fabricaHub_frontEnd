import { galeria, projetos } from '@/mocks/projetos'
import { respostaMock } from '@/utils/respostaMock'
import type { ImagemGaleria, Projeto } from '@/utils/tipos'

export const projetosApi = {
  // Futuro: client.get<Projeto[]>('/projetos')
  listar(): Promise<Projeto[]> {
    return respostaMock(projetos)
  },

  // Futuro: client.get<Projeto>(`/projetos/${id}`)
  obter(id: number): Promise<Projeto | null> {
    return respostaMock(projetos.find((p) => p.id === id) ?? null)
  },

  // Futuro: client.get<ImagemGaleria[]>(`/projetos/${id}/galeria`)
  listarGaleria(id: number): Promise<ImagemGaleria[]> {
    return respostaMock(galeria.filter((g) => g.idProjeto === id))
  },
}
