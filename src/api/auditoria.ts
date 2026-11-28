import { ref } from 'vue'
import { lerJson, salvarJson } from '@/utils/armazenamento'
import { diasAtras } from '@/utils/datas'

export const tiposLog = ['Login', 'Acesso', 'Tarefa', 'Projeto', 'Sistema'] as const
export type TipoLog = (typeof tiposLog)[number]
export interface Registro {
  em: string
  autor: string
  acao: string
  tipo: TipoLog
  sucesso: boolean
}
const chave = 'fabricahub:auditoria'
export const registros = ref<Registro[]>(
  lerJson(chave) ?? [
    {
      em: diasAtras(0, '09:30'),
      autor: 'peraza',
      acao: 'Atualizou a equipe de Front-end.',
      tipo: 'Sistema',
      sucesso: true,
    },
    {
      em: diasAtras(1),
      autor: 'igor.dev',
      acao: 'Tentou entrar sem acesso autorizado.',
      tipo: 'Login',
      sucesso: false,
    },
    {
      em: diasAtras(2),
      autor: 'daniel',
      acao: 'Atualizou o projeto Painel de Integração.',
      tipo: 'Projeto',
      sucesso: true,
    },
  ],
)
export function registrar(autor: string, acao: string, tipo: TipoLog = 'Sistema', sucesso = true) {
  registros.value.unshift({ em: new Date().toISOString(), autor, acao, tipo, sucesso })
  salvarJson(chave, registros.value)
}
