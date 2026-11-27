import { mensagemRepository } from '@/repositories/mensagemRepository'
import type { Mensagem } from '@/utils/tipos'

export const mensagemController = {
  listar(): Promise<Mensagem[]> {
    return mensagemRepository.listar()
  },
}
