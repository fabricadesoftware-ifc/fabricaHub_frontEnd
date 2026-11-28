import { noticias as noticiasMock } from '@/mocks/noticias'
import { respostaMock } from '@/utils/respostaMock'
import type { Noticia } from '@/utils/tipos'

const noticias: Noticia[] = structuredClone(noticiasMock)

export const noticiasApi = {
  async salvar(id: number | null, dados: import('@/utils/gestao').CadastroNoticia) {
    if (![dados.titulo, dados.autor, dados.resumo, dados.lide, ...dados.blocos.map((b) => b.texto)].every((texto) => texto.trim())) {
      throw new Error('Preencha os campos de texto da notícia.')
    }
    if (id === null) {
      noticias.push({ ...dados, id: Math.max(0, ...noticias.map((n) => n.id)) + 1, leituras: 0, nova: true })
    } else {
      const noticia = noticias.find((n) => n.id === id)
      if (!noticia) throw new Error('Notícia não encontrada.')
      Object.assign(noticia, dados)
      if (dados.categoria !== 'Evento') delete noticia.evento
    }
    return respostaMock(undefined)
  },
  async excluir(id: number) {
    const indice = noticias.findIndex((n) => n.id === id)
    if (indice < 0) throw new Error('Notícia não encontrada.')
    noticias.splice(indice, 1)
    return respostaMock(undefined)
  },

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
