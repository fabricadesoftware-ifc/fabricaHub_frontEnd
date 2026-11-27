import { noticias as noticiasMock } from '@/mocks/noticias'
import { respostaMock } from '@/utils/respostaMock'
import type { Noticia } from '@/utils/tipos'

const noticias: Noticia[] = structuredClone(noticiasMock)

export const noticiasApi = {
  /** Mais recente primeiro. */
  // Futuro: client.get<Noticia[]>('/noticias')
  listar(): Promise<Noticia[]> {
    return respostaMock([...noticias].sort((a, b) => b.data.localeCompare(a.data)))
  },

  // Futuro: client.get<Noticia>(`/noticias/${id}`)
  obter(id: number): Promise<Noticia | null> {
    return respostaMock(noticias.find((n) => n.id === id) ?? null)
  },

  /** Conta uma leitura (alimenta "Mais lidas"). */
  // Futuro: client.post(`/noticias/${id}/leituras`)
  registrarLeitura(id: number): Promise<void> {
    const noticia = noticias.find((n) => n.id === id)
    if (noticia) noticia.leituras++
    return respostaMock(undefined)
  },
}
