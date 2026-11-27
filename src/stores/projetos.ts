import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Projeto } from '@/utils/tipos'

/**
 * Projetos carregados: estado compartilhado porque define o papel
 * (líder = `idLead` de algum projeto). Quem carrega é `useProjetos`/`useAuth`.
 */
export const useProjetosStore = defineStore('projetos', () => {
  const lista = ref<Projeto[]>([])

  function substituir(projetos: Projeto[]) {
    lista.value = projetos
  }

  return { lista, substituir }
})
