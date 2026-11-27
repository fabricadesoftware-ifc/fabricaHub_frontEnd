import { mensagens } from '@/mocks/mensagens'
import { respostaMock } from '@/utils/respostaMock'
import type { Mensagem } from '@/utils/tipos'

export const mensagemRepository = {
  // Futuro: http.get<Mensagem[]>('/mensagens')
  listar(): Promise<Mensagem[]> {
    return respostaMock(mensagens)
  },
}
