import { computed, reactive, ref } from 'vue'
import { MAX_BIO, usuariosApi } from '@/api/usuarios'
import { useDado } from '@/composables/useLista'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { papelComunidade } from '@/utils/pessoas'
import type { DadosPerfil, TipoLink, Usuario } from '@/utils/tipos'

export const TIPOS_LINK: TipoLink[] = ['GitHub', 'LinkedIn', 'Site']
export { MAX_BIO }

/** Foto: PNG ou JPG, até 2 MB. */
const TIPOS_FOTO = ['image/png', 'image/jpeg']
const MAX_FOTO = 2 * 1024 * 1024

function copiarDados(usuario: DadosPerfil): DadosPerfil {
  return { foto: usuario.foto, curso: usuario.curso, bio: usuario.bio, links: usuario.links.map((l) => ({ ...l })) }
}

/**
 * Meu perfil: nome e usuário vêm do GitHub (só leitura); foto, curso, bio e links são editáveis.
 * "Descartar" volta ao que foi carregado; erro ao salvar mantém o que foi digitado.
 */
export function usePerfil() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()
  const fonte = useDado(() => usuariosApi.obterPorId(auth.usuario?.id), 'Não foi possível carregar o seu perfil.')

  const form = reactive<DadosPerfil>({ foto: null, curso: '', bio: '', links: [] })
  const salvando = ref(false)
  const aviso = ref<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  function preencher(usuario: Usuario) {
    Object.assign(form, copiarDados(usuario))
  }

  async function carregar() {
    await fonte.carregar()
    if (fonte.dado.value) preencher(fonte.dado.value)
  }

  const usuario = fonte.dado
  const alterado = computed(() => !!usuario.value && JSON.stringify(form) !== JSON.stringify(copiarDados(usuario.value)))
  const restantes = computed(() => MAX_BIO - form.bio.length)
  const papel = computed(() => (usuario.value ? papelComunidade(usuario.value, projetos.lista) : 'membro'))

  function descartar() {
    if (usuario.value) preencher(usuario.value)
    aviso.value = null
  }

  function adicionarLink() {
    const usados = new Set(form.links.map((l) => l.tipo))
    form.links.push({ tipo: TIPOS_LINK.find((t) => !usados.has(t)) ?? 'Site', url: '' })
  }

  function removerLink(indice: number) {
    form.links.splice(indice, 1)
  }

  /** Lê a foto escolhida; devolve a mensagem de erro, se houver. */
  function trocarFoto(arquivo: File): Promise<string | null> {
    if (!TIPOS_FOTO.includes(arquivo.type)) return Promise.resolve('Use uma imagem PNG ou JPG.')
    if (arquivo.size > MAX_FOTO) return Promise.resolve('A foto pode ter até 2 MB.')
    return new Promise((resolver) => {
      const leitor = new FileReader()
      leitor.onload = () => {
        form.foto = String(leitor.result)
        resolver(null)
      }
      leitor.onerror = () => resolver('Não foi possível ler a imagem.')
      leitor.readAsDataURL(arquivo)
    })
  }

  function removerFoto() {
    form.foto = null
  }

  async function salvar() {
    if (!usuario.value || salvando.value) return
    salvando.value = true
    aviso.value = null
    try {
      const dados: DadosPerfil = {
        ...copiarDados(form),
        links: form.links.filter((l) => l.url.trim()).map((l) => ({ ...l, url: l.url.trim() })),
      }
      const atualizado = await usuariosApi.atualizarPerfil(usuario.value.id, dados)
      usuario.value = atualizado
      preencher(atualizado)
      auth.definirUsuario(atualizado) // sidebar reflete na hora
      aviso.value = { tipo: 'sucesso', texto: 'Perfil salvo.' }
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível salvar. O que você digitou continua aqui; tente de novo.' }
    } finally {
      salvando.value = false
    }
  }

  return {
    carregar,
    carregando: fonte.carregando,
    erro: fonte.erro,
    usuario,
    papel,
    form,
    alterado,
    restantes,
    salvando,
    aviso,
    descartar,
    salvar,
    adicionarLink,
    removerLink,
    trocarFoto,
    removerFoto,
  }
}
