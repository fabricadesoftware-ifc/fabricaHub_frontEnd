import { ref } from 'vue'
import { defineStore } from 'pinia'
import { acessoController } from '@/controllers/acessoController'
import { mensagemController } from '@/controllers/mensagemController'
import { noticiaController } from '@/controllers/noticiaController'
import { tarefaController } from '@/controllers/tarefaController'
import type { Mensagem, Noticia, SolicitacaoAcesso, Tarefa } from '@/utils/tipos'

/** Tarefas, mensagens, notícias e acessos: alimentam contadores da sidebar e do dashboard. */
export const useAtividadeStore = defineStore('atividade', () => {
  const tarefas = ref<Tarefa[]>([])
  const mensagens = ref<Mensagem[]>([])
  const noticias = ref<Noticia[]>([])
  const solicitacoes = ref<SolicitacaoAcesso[]>([])

  async function carregar() {
    ;[tarefas.value, mensagens.value, noticias.value, solicitacoes.value] = await Promise.all([
      tarefaController.listar(),
      mensagemController.listar(),
      noticiaController.listar(),
      acessoController.listarSolicitacoes(),
    ])
  }

  return { tarefas, mensagens, noticias, solicitacoes, carregar }
})
