import { computed, ref, type Ref } from 'vue'
import { projetosApi } from '@/api/projetos'
import { estadoDasFontes } from '@/composables/useLista'
import { useTarefas } from '@/composables/useTarefas'
import { useUsuarios } from '@/composables/useUsuarios'
import { useProjetosStore } from '@/stores/projetos'
import type { MembroProjeto, Projeto } from '@/utils/tipos'

/** Quadro de pessoal do projeto: adicionar, trocar função e remover (o líder fica). */
export function useMembrosProjeto(idProjeto: Ref<number>) {
  const projetos = useProjetosStore()
  const usuariosFonte = useUsuarios()
  const tarefasFonte = useTarefas()
  const { carregando, erro } = estadoDasFontes([usuariosFonte, tarefasFonte])

  /** Id do membro com ação em andamento (desabilita a linha). */
  const ocupado = ref<number | null>(null)
  const aviso = ref<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  async function carregar() {
    await Promise.all([usuariosFonte.carregar(), tarefasFonte.carregar()])
  }

  const projeto = computed(() => projetos.lista.find((p) => p.id === idProjeto.value) ?? null)

  /** Líder primeiro (mesmo que não esteja em `membros`), depois por função. */
  const linhas = computed(() => {
    const p = projeto.value
    if (!p) return []
    const membros: MembroProjeto[] = p.membros.some((m) => m.idUsuario === p.idLead)
      ? p.membros
      : [{ idUsuario: p.idLead, funcao: usuariosFonte.usuario(p.idLead)?.funcao ?? 'Front-end' }, ...p.membros]
    return membros
      .flatMap((m) => {
        const usuario = usuariosFonte.usuario(m.idUsuario)
        if (!usuario) return []
        const abertas = tarefasFonte.tarefas.value.filter(
          (t) => t.idProjeto === p.id && t.idResponsavel === m.idUsuario && t.status !== 'Concluída',
        ).length
        return [{ ...m, usuario, abertas, lider: m.idUsuario === p.idLead }]
      })
      .sort((a, b) => Number(b.lider) - Number(a.lider) || a.funcao.localeCompare(b.funcao))
  })

  const porFuncao = computed(() => {
    const contagem = new Map<string, number>()
    for (const l of linhas.value) contagem.set(l.funcao, (contagem.get(l.funcao) ?? 0) + 1)
    return [...contagem].map(([funcao, total]) => ({ funcao, total }))
  })

  /** Pessoas ativas (não docentes) que ainda não estão no projeto. */
  const disponiveis = computed(() =>
    usuariosFonte.usuarios.value
      .filter((u) => u.ativo && u.vinculo !== 'Docente' && !linhas.value.some((l) => l.idUsuario === u.id))
      .map((u) => ({ valor: String(u.id), rotulo: u.nomeCompleto })),
  )

  function nome(id: number) {
    return usuariosFonte.usuario(id)?.nome ?? 'A pessoa'
  }

  async function executar(idUsuario: number, acao: () => Promise<Projeto>, sucesso: string) {
    ocupado.value = idUsuario
    aviso.value = null
    try {
      projetos.atualizar(await acao())
      aviso.value = { tipo: 'sucesso', texto: sucesso }
      return true
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível salvar a mudança. Tente de novo.' }
      return false
    } finally {
      ocupado.value = null
    }
  }

  return {
    carregar,
    carregando,
    erro,
    projeto,
    linhas,
    porFuncao,
    disponiveis,
    ocupado,
    aviso,
    adicionar: (idUsuario: number, funcao: string) =>
      executar(idUsuario, () => projetosApi.adicionarMembro(idProjeto.value, idUsuario, funcao), `${nome(idUsuario)} entrou no projeto.`),
    trocarFuncao: (idUsuario: number, funcao: string) =>
      executar(idUsuario, () => projetosApi.trocarFuncao(idProjeto.value, idUsuario, funcao), `${nome(idUsuario)} agora é ${funcao}.`),
    remover: (idUsuario: number) =>
      executar(idUsuario, () => projetosApi.removerMembro(idProjeto.value, idUsuario), `${nome(idUsuario)} saiu do projeto.`),
  }
}
