// Datas em pt-BR. Os mocks usam datas relativas a hoje para nunca ficarem velhos.

const DIAS = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

const MS_DIA = 24 * 60 * 60 * 1000

export function adicionarDias(data: Date, dias: number): Date {
  const nova = new Date(data)
  nova.setDate(nova.getDate() + dias)
  return nova
}

/** 'YYYY-MM-DD' no fuso local. */
export function isoDia(data: Date): string {
  const m = String(data.getMonth() + 1).padStart(2, '0')
  const d = String(data.getDate()).padStart(2, '0')
  return `${data.getFullYear()}-${m}-${d}`
}

/** Lê 'YYYY-MM-DD' (ou ISO completo) como data local. */
export function lerData(iso: string): Date {
  if (iso.length === 10) {
    const [a, m, d] = iso.split('-').map(Number)
    return new Date(a!, m! - 1, d!)
  }
  return new Date(iso)
}

/** Segunda-feira da semana de `data` (à meia-noite). */
export function segundaDaSemana(data = new Date()): Date {
  const base = new Date(data.getFullYear(), data.getMonth(), data.getDate())
  const dia = base.getDay()
  return adicionarDias(base, dia === 0 ? -6 : 1 - dia)
}

/** ISO com data relativa a hoje e hora fixa (para mocks). */
export function diasAtras(dias: number, hora = '10:00'): string {
  const [h, min] = hora.split(':').map(Number)
  const data = adicionarDias(new Date(), -dias)
  data.setHours(h!, min!, 0, 0)
  return data.toISOString()
}

/** 'YYYY-MM-DD' relativo a hoje (para mocks). */
export function diaRelativo(dias: number): string {
  return isoDia(adicionarDias(new Date(), dias))
}

/** 'YYYY-MM-DD' relativo à segunda desta semana (para mocks da agenda). */
export function diaDaSemana(indice: number): string {
  return isoDia(adicionarDias(segundaDaSemana(), indice))
}

export function siglaDia(data: Date): string {
  return DIAS[data.getDay()]!
}

/** "QUA 25 NOV" */
export function dataCabecalho(data = new Date()): string {
  return `${siglaDia(data)} ${data.getDate()} ${MESES[data.getMonth()]}`
}

/** "22 NOV" */
export function dataCurta(iso: string): string {
  const data = lerData(iso)
  return `${data.getDate()} ${MESES[data.getMonth()]}`
}

/** "24 nov · 14:30" */
export function dataHora(iso: string): string {
  const data = lerData(iso)
  const h = String(data.getHours()).padStart(2, '0')
  const m = String(data.getMinutes()).padStart(2, '0')
  return `${data.getDate()} ${MESES[data.getMonth()]!.toLowerCase()} · ${h}:${m}`
}

/** "18 nov" */
export function dataMinuscula(iso: string): string {
  return dataCurta(iso).toLowerCase()
}

/** Dias inteiros de hoje até `iso` (negativo = passou). */
export function diasAte(iso: string, hoje = new Date()): number {
  const alvo = lerData(iso)
  const base = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())
  return Math.round((alvo.getTime() - base.getTime()) / MS_DIA)
}

/** "hoje", "amanhã", "em 3 dias", "atrasada" */
export function prazoRelativo(iso: string): string {
  const dias = diasAte(iso)
  if (dias < 0) return 'atrasada'
  if (dias === 0) return 'hoje'
  if (dias === 1) return 'amanhã'
  return `em ${dias} dias`
}

export function saudacao(data = new Date()): string {
  const h = data.getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

/** "MAR/25" */
export function mesAno(iso: string): string {
  const data = lerData(iso)
  return `${MESES[data.getMonth()]}/${String(data.getFullYear()).slice(2)}`
}

/** "26/11" */
export function diaMes(iso: string): string {
  const data = lerData(iso)
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`
}

/** "MAR/25 → ATUAL" (sem fim = atual). */
export function periodo(inicio: string, fim?: string): string {
  return `${mesAno(inicio)} → ${fim ? mesAno(fim) : 'ATUAL'}`
}

/** "há 28 min", "há 2 h", "ontem", "24 nov" */
export function tempoRelativo(iso: string, agora = new Date()): string {
  const minutos = Math.max(0, Math.round((agora.getTime() - lerData(iso).getTime()) / 60000))
  if (minutos < 1) return 'agora'
  if (minutos < 60) return `há ${minutos} min`
  if (minutos < 24 * 60) return `há ${Math.round(minutos / 60)} h`
  if (diasAte(iso, agora) === -1) return 'ontem'
  return dataMinuscula(iso)
}
