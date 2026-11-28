import { logs, tags } from '@/mocks/gestao'
import { respostaMock } from '@/utils/respostaMock'

export const gestaoApi = {
  listarLogs: () => respostaMock(logs),
  listarTags: () => respostaMock(tags),
  registrar(autor: string, acao: string) {
    logs.unshift({ em: new Date().toISOString(), autor, acao })
  },
}
