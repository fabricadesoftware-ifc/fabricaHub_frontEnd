import type { Mensagem } from '@/utils/tipos'

export const mensagens: Mensagem[] = [
  { id: 1, idRemetente: 2, idProjeto: 1, texto: 'Subi o endpoint de login, pode revisar?', haQuantoTempo: 'há 5 min', lida: false },
  { id: 2, idRemetente: 4, idProjeto: 2, texto: 'Reunião com a professora de histologia na quinta às 14h.', haQuantoTempo: 'há 20 min', lida: false },
  { id: 3, idRemetente: 7, idProjeto: 3, texto: 'As migrations estão prontas para review.', haQuantoTempo: 'há 1 h', lida: false },
  { id: 4, idRemetente: 5, idProjeto: 1, texto: 'Atualizei o protótipo do painel de turmas no Figma.', haQuantoTempo: 'há 2 h', lida: false },
  { id: 5, idRemetente: 8, idProjeto: 3, texto: 'O pipeline de deploy quebrou no build, já estou vendo.', haQuantoTempo: 'há 3 h', lida: false },
  { id: 6, idRemetente: 3, idProjeto: 3, texto: 'Bom trabalho na sprint, pessoal!', haQuantoTempo: 'ontem', lida: true },
  { id: 7, idRemetente: 6, idProjeto: 2, texto: 'Testei o app no celular, tudo certo.', haQuantoTempo: 'há 2 dias', lida: true },
]
