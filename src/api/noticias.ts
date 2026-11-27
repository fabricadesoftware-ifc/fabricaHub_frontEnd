import { noticias } from '@/mocks/noticias'
import { respostaMock } from '@/utils/respostaMock'
import type { Noticia } from '@/utils/tipos'

export const noticiasApi = {
  // Futuro: client.get<Noticia[]>('/noticias')
  listar(): Promise<Noticia[]> {
    return respostaMock(noticias)
  },
}
