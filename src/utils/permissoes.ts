import type { RouteLocationNormalized } from 'vue-router'
import type { Papel, Projeto, StatusTarefa, Tarefa, Usuario } from '@/utils/tipos'

/**
 * Líder não é um tipo de usuário: é quem está como `idLead` de algum projeto.
 * Admin é `isSuper: true`. Todo usuário logado é membro.
 */
export function papeisDoUsuario(usuario: Usuario | null, projetos: Projeto[]): Set<Papel> {
  const papeis = new Set<Papel>()
  if (!usuario) return papeis
  papeis.add('membro')
  if (projetos.some((p) => p.idLead === usuario.id)) papeis.add('lider')
  if (usuario.isSuper) papeis.add('admin')
  return papeis
}

/** Papel principal: admin > lider > membro. */
export function papelPrincipal(papeis: Set<Papel>): Papel {
  if (papeis.has('admin')) return 'admin'
  if (papeis.has('lider')) return 'lider'
  return 'membro'
}

export function lideraProjeto(usuario: Usuario | null, projetos: Projeto[], idProjeto: number): boolean {
  return !!usuario && projetos.some((p) => p.id === idProjeto && p.idLead === usuario.id)
}

/** Usado pelo guard do router e pelo seletor de papel. */
export function podeAcessar(rota: RouteLocationNormalized, usuario: Usuario | null, projetos: Projeto[]): boolean {
  const papeis = papeisDoUsuario(usuario, projetos)
  for (const registro of rota.matched) {
    const permitidos = registro.meta.roles
    if (permitidos && !permitidos.some((p) => papeis.has(p))) return false
  }
  // Rotas como /projetos/:id/tarefas exigem liderar aquele projeto (admin passa direto).
  if (rota.meta.liderDoProjeto && !papeis.has('admin')) {
    return lideraProjeto(usuario, projetos, Number(rota.params.id))
  }
  return true
}

/** Status que o membro pode escolher para as próprias tarefas (concluir é com o líder). */
export const STATUS_DO_MEMBRO: readonly StatusTarefa[] = ['A fazer', 'Fazendo', 'Em revisão']

const TODOS_STATUS: readonly StatusTarefa[] = ['A fazer', 'Fazendo', 'Em revisão', 'Concluída']

/**
 * Para onde o usuário pode mover a tarefa.
 * Líder do projeto: qualquer tarefa do projeto, para qualquer status
 * (passar de "Em revisão" para "Concluída" conta como aprovação).
 * Membro: só as próprias, só enquanto estão em "A fazer" ou "Fazendo", e no máximo até "Em revisão".
 */
export function destinosDaTarefa(usuario: Usuario | null, tarefa: Tarefa, projetos: Projeto[] = []): StatusTarefa[] {
  if (!usuario) return []
  if (lideraProjeto(usuario, projetos, tarefa.idProjeto)) return TODOS_STATUS.filter((s) => s !== tarefa.status)
  if (tarefa.idResponsavel !== usuario.id) return []
  if (tarefa.status === 'Em revisão' || tarefa.status === 'Concluída') return []
  return STATUS_DO_MEMBRO.filter((s) => s !== tarefa.status)
}

export function podeMoverTarefa(usuario: Usuario | null, tarefa: Tarefa, para: StatusTarefa, projetos: Projeto[] = []): boolean {
  return destinosDaTarefa(usuario, tarefa, projetos).includes(para)
}
