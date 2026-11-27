import { noticiaRepository } from '@/repositories/noticiaRepository'
import type { Noticia } from '@/utils/tipos'

export const noticiaController = {
  listar(): Promise<Noticia[]> {
    return noticiaRepository.listar()
  },
}
