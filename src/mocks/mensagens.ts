import type { Mensagem } from '@/utils/tipos'

export const mensagens: Mensagem[] = [
  { id: 1, idRemetente: 2, idProjeto: 1, idTarefa: 11, texto: 'Subi o PR, pode revisar quando der?', haQuantoTempo: '12 min', lida: false },
  { id: 2, idRemetente: 3, idProjeto: 3, texto: 'A tela de login ficou ótima, só ajustar o espaço do botão no celular.', haQuantoTempo: '1 h', lida: false },
  { id: 3, idRemetente: 4, idProjeto: 2, texto: 'Enviei as imagens novas para a galeria.', haQuantoTempo: 'ontem', lida: true },
  { id: 4, idRemetente: 7, idProjeto: 3, idTarefa: 16, texto: 'Dá uma olhada no contador quando puder.', haQuantoTempo: '2 h', lida: false },
  { id: 5, idRemetente: 5, idProjeto: 1, texto: 'Atualizei o protótipo do painel de turmas no Figma.', haQuantoTempo: '3 h', lida: false },
  { id: 6, idRemetente: 8, idProjeto: 3, texto: 'O pipeline de deploy quebrou no build, já estou vendo.', haQuantoTempo: '4 h', lida: false },
  { id: 7, idRemetente: 6, idProjeto: 2, texto: 'Testei o app no celular, tudo certo.', haQuantoTempo: '2 dias', lida: true },
]
