import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { lideraProjeto, papeisDoUsuario, papelPrincipal } from '@/utils/permissoes'

export function useRole() {
  const auth = useAuthStore()
  const projetos = useProjetosStore()

  const papeis = computed(() => papeisDoUsuario(auth.usuario, projetos.lista))
  const isAdmin = computed(() => papeis.value.has('admin'))
  const isLeader = computed(() => papeis.value.has('lider'))
  const papel = computed(() => papelPrincipal(papeis.value))

  function leadsProject(id: number) {
    return lideraProjeto(auth.usuario, projetos.lista, id)
  }

  return { isAdmin, isLeader, leadsProject, papel }
}
