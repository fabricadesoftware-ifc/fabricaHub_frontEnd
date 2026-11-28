import { computed, reactive, ref, type Ref } from 'vue'
import { projetosApi } from '@/api/projetos'
import { useUsuarios } from '@/composables/useUsuarios'
import { useProjetosStore } from '@/stores/projetos'
import type { DadosProjeto, Projeto } from '@/utils/tipos'

export const MAX_DESCRICAO = 400
/** Tecnologias comuns na Fábrica (as do projeto entram mesmo se não estiverem aqui). */
const TECNOLOGIAS_COMUNS = ['Vue', 'React', 'Django REST', 'Node', 'PostgreSQL', 'MySQL', 'Docker', 'Figma', 'Python', 'ESP32']

function copiar(p: Projeto): DadosProjeto {
  return {
    nome: p.nome,
    descricao: p.descricao,
    status: p.status,
    tecnologias: [...p.tecnologias],
    repositorio: p.repositorio ?? '',
    figma: p.figma ?? '',
  }
}

/** Editar projeto: nome, descrição, status, tecnologias e links. Líder e orientador só o admin troca. */
export function useEditarProjeto(idProjeto: Ref<number>) {
  const projetos = useProjetosStore()
  const usuariosFonte = useUsuarios()
  const projeto = computed(() => projetos.lista.find((p) => p.id === idProjeto.value) ?? null)

  const form = reactive<DadosProjeto>({ nome: '', descricao: '', status: 'Em andamento', tecnologias: [], repositorio: '', figma: '' })
  const salvando = ref(false)
  const aviso = ref<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  function preencher() {
    if (projeto.value) Object.assign(form, copiar(projeto.value))
  }

  async function carregar() {
    preencher()
    await usuariosFonte.carregar()
  }

  const alterado = computed(() => !!projeto.value && JSON.stringify(form) !== JSON.stringify(copiar(projeto.value)))
  const tecnologias = computed(() => [...new Set([...TECNOLOGIAS_COMUNS, ...(projeto.value?.tecnologias ?? [])])])
  const erroNome = computed(() => (form.nome.trim() ? '' : 'O projeto precisa de um nome.'))

  function alternarTecnologia(nome: string) {
    const i = form.tecnologias.indexOf(nome)
    if (i >= 0) form.tecnologias.splice(i, 1)
    else form.tecnologias.push(nome)
  }

  function descartar() {
    preencher()
    aviso.value = null
  }

  async function salvar() {
    if (!projeto.value || erroNome.value || salvando.value) return
    salvando.value = true
    aviso.value = null
    try {
      const atualizado = await projetosApi.atualizar(projeto.value.id, {
        ...form,
        tecnologias: [...form.tecnologias],
        nome: form.nome.trim(),
        repositorio: form.repositorio?.trim() || undefined,
        figma: form.figma?.trim() || undefined,
      })
      projetos.atualizar(atualizado)
      preencher()
      aviso.value = { tipo: 'sucesso', texto: 'Projeto salvo.' }
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível salvar. O que você digitou continua aqui; tente de novo.' }
    } finally {
      salvando.value = false
    }
  }

  return {
    carregar,
    carregando: usuariosFonte.carregando,
    projeto,
    form,
    alterado,
    tecnologias,
    erroNome,
    salvando,
    aviso,
    alternarTecnologia,
    descartar,
    salvar,
    lider: computed(() => usuariosFonte.usuario(projeto.value?.idLead ?? -1)),
    orientador: computed(() => usuariosFonte.usuario(projeto.value?.idOrientador ?? -1)),
  }
}
