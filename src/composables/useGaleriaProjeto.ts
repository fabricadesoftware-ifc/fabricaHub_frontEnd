import { computed, ref, type Ref } from 'vue'
import { projetosApi } from '@/api/projetos'
import { estadoDasFontes, useLista } from '@/composables/useLista'
import { useUsuarios } from '@/composables/useUsuarios'
import { useAuthStore } from '@/stores/auth'
import type { TipoArquivoGaleria } from '@/utils/tipos'

export const TIPOS_ARQUIVO: TipoArquivoGaleria[] = ['LOGO', 'BANNER', 'TELA', 'OUTRO']
export const ROTULO_TIPO: Record<TipoArquivoGaleria, string> = { LOGO: 'Logo', BANNER: 'Banner', TELA: 'Tela', OUTRO: 'Outro' }

/** PNG, JPG ou SVG, até 5 MB cada. */
const ACEITOS = ['image/png', 'image/jpeg', 'image/svg+xml']
const MAX_BYTES = 5 * 1024 * 1024

function lerArquivo(arquivo: File): Promise<{ url: string; largura: number; altura: number }> {
  return new Promise((resolver, rejeitar) => {
    const leitor = new FileReader()
    leitor.onerror = () => rejeitar(new Error('leitura'))
    leitor.onload = () => {
      const url = String(leitor.result)
      const imagem = new Image()
      imagem.onload = () => resolver({ url, largura: imagem.naturalWidth, altura: imagem.naturalHeight })
      imagem.onerror = () => resolver({ url, largura: 0, altura: 0 })
      imagem.src = url
    }
    leitor.readAsDataURL(arquivo)
  })
}

/** Galeria do projeto: enviar imagens, trocar o tipo (uma logo só) e remover. */
export function useGaleriaProjeto(idProjeto: Ref<number>) {
  const auth = useAuthStore()
  const galeriaFonte = useLista(() => projetosApi.listarGaleria(idProjeto.value), 'Não foi possível carregar a galeria.')
  const usuariosFonte = useUsuarios()
  const { carregando, erro } = estadoDasFontes([galeriaFonte, usuariosFonte])

  const filtro = ref<TipoArquivoGaleria | null>(null)
  const tipoEnvio = ref<TipoArquivoGaleria>('TELA')
  const enviando = ref(false)
  const ocupado = ref<number | null>(null)
  const aviso = ref<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null)

  async function carregar() {
    await Promise.all([galeriaFonte.carregar(), usuariosFonte.carregar()])
  }

  const imagens = computed(() => galeriaFonte.dados.value.filter((g) => !filtro.value || g.tipo === filtro.value))

  async function enviar(arquivos: FileList | File[]) {
    const lista = [...arquivos]
    if (!lista.length || enviando.value || !auth.usuario) return
    const recusado = lista.find((a) => !ACEITOS.includes(a.type) || a.size > MAX_BYTES)
    if (recusado) {
      aviso.value = { tipo: 'erro', texto: `"${recusado.name}" não entra: use PNG, JPG ou SVG de até 5 MB.` }
      return
    }
    enviando.value = true
    aviso.value = null
    try {
      for (const [i, arquivo] of lista.entries()) {
        const { url, largura, altura } = await lerArquivo(arquivo)
        // Só a primeira imagem do lote pode virar logo.
        const tipo: TipoArquivoGaleria = tipoEnvio.value === 'LOGO' && i > 0 ? 'OUTRO' : tipoEnvio.value
        await projetosApi.enviarImagem(idProjeto.value, {
          arquivo: arquivo.name,
          tipo,
          tamanhoKb: Math.max(1, Math.round(arquivo.size / 1024)),
          largura,
          altura,
          idAutor: auth.usuario.id,
          url,
        })
      }
      await galeriaFonte.carregar()
      aviso.value = { tipo: 'sucesso', texto: lista.length === 1 ? 'Imagem enviada.' : `${lista.length} imagens enviadas.` }
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível enviar. Tente de novo.' }
    } finally {
      enviando.value = false
    }
  }

  async function trocarTipo(idImagem: number, tipo: TipoArquivoGaleria) {
    ocupado.value = idImagem
    aviso.value = null
    try {
      galeriaFonte.dados.value = await projetosApi.trocarTipoImagem(idImagem, tipo)
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível trocar o tipo. Tente de novo.' }
    } finally {
      ocupado.value = null
    }
  }

  async function remover(idImagem: number) {
    ocupado.value = idImagem
    aviso.value = null
    try {
      await projetosApi.removerImagem(idImagem)
      galeriaFonte.dados.value = galeriaFonte.dados.value.filter((g) => g.id !== idImagem)
      aviso.value = { tipo: 'sucesso', texto: 'Imagem removida.' }
    } catch {
      aviso.value = { tipo: 'erro', texto: 'Não foi possível remover. Tente de novo.' }
    } finally {
      ocupado.value = null
    }
  }

  return {
    carregar,
    carregando,
    erro,
    filtro,
    tipoEnvio,
    imagens,
    total: computed(() => galeriaFonte.dados.value.length),
    enviando,
    ocupado,
    aviso,
    enviar,
    trocarTipo,
    remover,
    usuario: usuariosFonte.usuario,
  }
}
