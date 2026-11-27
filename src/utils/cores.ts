// Cores de fundo claras demais para texto branco (contraste < 4.5:1).
// Regra da marca: fundo laranja usa sempre texto branco.
const fundosClaros = new Set(['#12B0AE'])

export function corTextoSobre(fundo: string): string {
  return fundosClaros.has(fundo.toUpperCase()) ? '#08090A' : '#FFFFFF'
}
