import { ref } from 'vue'
import { defineStore } from 'pinia'
import { authController } from '@/controllers/authController'
import { useProjetosStore } from '@/stores/projetos'
import type { Papel, Usuario } from '@/utils/tipos'

export const useAuthStore = defineStore('auth', () => {
  const usuario = ref<Usuario | null>(null)
  let carregamento: Promise<void> | null = null

  /** Carrega usuário e projetos uma única vez (o guard depende dos dois). */
  function garantirCarregado(): Promise<void> {
    carregamento ??= (async () => {
      const projetos = useProjetosStore()
      const [u] = await Promise.all([authController.obterUsuarioLogado(), projetos.carregar()])
      usuario.value = u
      // Só em desenvolvimento: abrir com ?papel=membro|lider|admin já simula o papel
      // (roda antes do guard, então dá para testar rotas protegidas por link).
      const papelInicial = new URLSearchParams(window.location.search).get('papel')
      if (import.meta.env.DEV && (papelInicial === 'membro' || papelInicial === 'lider' || papelInicial === 'admin')) {
        await simularPapel(papelInicial)
      }
    })()
    return carregamento
  }

  /** Só em desenvolvimento (seletor de papel). */
  async function simularPapel(papel: Papel) {
    if (!usuario.value) return
    const resultado = await authController.simularPapel(usuario.value.id, papel)
    usuario.value = resultado.usuario
    useProjetosStore().substituir(resultado.projetos)
  }

  return { usuario, garantirCarregado, simularPapel }
})
