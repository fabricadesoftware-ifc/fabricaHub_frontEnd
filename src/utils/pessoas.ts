import type { PapelComunidade, Projeto, Usuario } from '@/utils/tipos'

/** Papel no crachá da comunidade: orientador (docente) > líder (lidera algum projeto) > membro. */
export function papelComunidade(usuario: Usuario, projetos: Projeto[]): PapelComunidade {
  if (usuario.vinculo === 'Docente') return 'orientador'
  if (projetos.some((p) => p.idLead === usuario.id)) return 'lider'
  return 'membro'
}

export const NOME_PAPEL: Record<PapelComunidade, string> = {
  lider: 'LÍDER',
  membro: 'MEMBRO',
  orientador: 'ORIENTADOR',
}

/** "Informática · Técnico integrado" → "Informática · Técnico" (cartões pequenos). */
export function cursoCurto(curso: string): string {
  return curso.replace(/ integrado$/i, '')
}

/** "Informática · Técnico integrado" → "Informática" (filtro de curso). */
export function nomeCurso(curso: string): string {
  return curso.split(' · ')[0] ?? curso
}

/** Cursos que o membro pode escolher em "Meu perfil". */
export const CURSOS = [
  'Informática · Técnico integrado',
  'Informática · Superior',
  'Química · Técnico integrado',
  'Agropecuária · Técnico integrado',
  'Informática · Docente',
] as const
