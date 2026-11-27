import { ref } from 'vue'
import { defineStore } from 'pinia'
import { projetoController } from '@/controllers/projetoController'
import type { Projeto } from '@/utils/tipos'

export const useProjetosStore = defineStore('projetos', () => {
  const lista = ref<Projeto[]>([])

  async function carregar() {
    lista.value = await projetoController.listar()
  }

  function substituir(projetos: Projeto[]) {
    lista.value = projetos
  }

  return { lista, carregar, substituir }
})
