import { computed } from 'vue'
import { usuariosApi } from '@/api/usuarios'
import { useLista } from '@/composables/useLista'
import type { Usuario } from '@/utils/tipos'

/** Pessoas da Fábrica, com busca por id (nomes e avatares em mensagens, comentários etc.). */
export function useUsuarios() {
  const { dados: usuarios, carregando, erro, carregar } = useLista(
    () => usuariosApi.listar(),
    'Não foi possível carregar as pessoas.',
  )

  const porId = computed(() => new Map(usuarios.value.map((u) => [u.id, u])))

  function usuario(id: number): Usuario | undefined {
    return porId.value.get(id)
  }

  return { usuarios, carregando, erro, carregar, usuario }
}
