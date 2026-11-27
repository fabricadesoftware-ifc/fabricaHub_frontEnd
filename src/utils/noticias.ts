import type { CategoriaNoticia, Noticia } from '@/utils/tipos'

/** Minutos de leitura (200 palavras por minuto, no mínimo 1). */
export function minutosDeLeitura(noticia: Noticia): number {
  const texto = [noticia.lide, ...noticia.blocos.map((b) => b.texto)].join(' ')
  return Math.max(1, Math.round(texto.split(/\s+/).length / 200))
}

/** Cor da etiqueta de cada categoria (texto e borda, sobre fundo escuro). */
export const COR_CATEGORIA: Record<CategoriaNoticia, string> = {
  Evento: 'var(--accent)',
  Projeto: 'var(--papel-membro-claro)',
  Equipe: 'var(--papel-lider-claro)',
  Aviso: 'var(--papel-admin-claro)',
}
