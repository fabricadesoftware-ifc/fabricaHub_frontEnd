import { catalogo } from './cadastros'
import { registrar, registros } from './auditoria'
import { respostaMock } from '@/utils/respostaMock'
import { toRaw } from 'vue'
export const gestaoApi = {
  listarLogs: () => respostaMock(toRaw(registros.value)),
  listarTags: () => respostaMock([...catalogo.Etiquetas]),
  registrar,
}
