import type { StatusTarefa } from '@/utils/tipos'

// Cores de fundo claras demais para texto branco (contraste < 4.5:1).
// Regra da marca: fundo laranja usa sempre texto branco.
const fundosClaros = new Set(['#12B0AE', '#9AABFF'])

export function corTextoSobre(fundo: string): string {
  return fundosClaros.has(fundo.toUpperCase()) ? '#08090A' : '#FFFFFF'
}

export const corStatusTarefa: Record<StatusTarefa, string> = {
  'A fazer': 'var(--status-afazer)',
  Fazendo: 'var(--status-fazendo)',
  'Em revisão': 'var(--status-revisao)',
  Concluída: 'var(--status-concluida)',
}
