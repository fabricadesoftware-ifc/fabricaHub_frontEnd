import { projetoRepository } from '@/repositories/projetoRepository'
import type { Projeto } from '@/utils/tipos'

export const projetoController = {
  listar(): Promise<Projeto[]> {
    return projetoRepository.listar()
  },
}
