import { equipes, timeMembros } from '@/mocks/comunidade'
import { conversas as conversasMock, mensagens as mensagensMock } from '@/mocks/mensagens'
import { projetos } from '@/mocks/projetos'
import { respostaMock } from '@/utils/respostaMock'
import type { Conversa, Mensagem, TipoConversa } from '@/utils/tipos'

const conversas: Conversa[] = structuredClone(conversasMock)
const mensagens: Mensagem[] = structuredClone(mensagensMock)

function proximoId(lista: { id: number }[]) {
  return Math.max(0, ...lista.map((item) => item.id)) + 1
}

/** Quem participa: direta = as duas pessoas; equipe = membros atuais; projeto = membros, líder e orientador. */
function participa(conversa: Conversa, idUsuario: number): boolean {
  if (conversa.tipo === 'direta') return conversa.participantes.includes(idUsuario)
  if (conversa.tipo === 'equipe') {
    return timeMembros.some((t) => t.idEquipe === conversa.idAlvo && t.idUsuario === idUsuario && !t.fim)
  }
  const projeto = projetos.find((p) => p.id === conversa.idAlvo)
  return (
    !!projeto &&
    (projeto.idLead === idUsuario || projeto.idOrientador === idUsuario || projeto.membros.some((m) => m.idUsuario === idUsuario))
  )
}

export const mensagensApi = {
  // Futuro: client.get<Mensagem[]>('/mensagens')
  listar(): Promise<Mensagem[]> {
    return respostaMock(mensagens)
  },

  // Futuro: client.get<Conversa[]>('/conversas')
  listarConversas(idUsuario: number): Promise<Conversa[]> {
    return respostaMock(conversas.filter((c) => participa(c, idUsuario)))
  },

  /** Abre a conversa com a pessoa, equipe ou projeto; cria se ainda não existir. */
  // Futuro: client.post<Conversa>('/conversas', { tipo, alvo })
  abrirConversa(tipo: TipoConversa, idAlvo: number, idUsuario: number): Promise<Conversa> {
    const existente = conversas.find((c) =>
      tipo === 'direta'
        ? c.tipo === 'direta' && c.participantes.includes(idUsuario) && c.participantes.includes(idAlvo)
        : c.tipo === tipo && c.idAlvo === idAlvo,
    )
    if (existente) return respostaMock(existente)
    const equipe = tipo === 'equipe' ? equipes.find((e) => e.id === idAlvo) : undefined
    const nova: Conversa = {
      id: proximoId(conversas),
      tipo,
      participantes: tipo === 'direta' ? [idUsuario, idAlvo] : [],
      idAlvo: tipo === 'direta' ? undefined : idAlvo,
      idProjeto: tipo === 'projeto' ? idAlvo : equipe?.projetos.find((p) => !p.fim)?.idProjeto,
    }
    conversas.push(nova)
    return respostaMock(nova)
  },

  // Futuro: client.post<Mensagem>(`/conversas/${idConversa}/mensagens`, { texto })
  enviar(idConversa: number, idRemetente: number, texto: string): Promise<Mensagem> {
    const conversa = conversas.find((c) => c.id === idConversa)
    if (!conversa) return Promise.reject(new Error(`Conversa ${idConversa} não encontrada`))
    const nova: Mensagem = {
      id: proximoId(mensagens),
      idConversa,
      idRemetente,
      idProjeto: conversa.idProjeto ?? 0,
      idTarefa: conversa.idTarefa,
      texto,
      em: new Date().toISOString(),
      lida: true,
    }
    mensagens.push(nova)
    return respostaMock(nova)
  },

  /** Marca como lidas as mensagens que outras pessoas mandaram na conversa. */
  // Futuro: client.post(`/conversas/${idConversa}/lidas`)
  marcarLidas(idConversa: number, idUsuario: number): Promise<void> {
    for (const m of mensagens) if (m.idConversa === idConversa && m.idRemetente !== idUsuario) m.lida = true
    return respostaMock(undefined)
  },
}
