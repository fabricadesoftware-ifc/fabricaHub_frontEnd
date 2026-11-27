import { diasAtras } from '@/utils/datas'
import type { Conversa, Mensagem } from '@/utils/tipos'

export const conversas: Conversa[] = [
  { id: 1, tipo: 'direta', participantes: [1, 2], idProjeto: 1, idTarefa: 11 },
  { id: 2, tipo: 'projeto', participantes: [], idAlvo: 3, idProjeto: 3 },
  { id: 3, tipo: 'equipe', participantes: [], idAlvo: 1, idProjeto: 3 },
  { id: 4, tipo: 'direta', participantes: [1, 4], idProjeto: 2 },
  { id: 5, tipo: 'projeto', participantes: [], idAlvo: 1, idProjeto: 1 },
  { id: 6, tipo: 'direta', participantes: [1, 7], idProjeto: 3, idTarefa: 16 },
]

export const mensagens: Mensagem[] = [
  // Daniel (direta, sobre o endpoint de notas)
  { id: 1, idConversa: 1, idRemetente: 2, idProjeto: 1, idTarefa: 11, texto: 'Terminei o endpoint de notas finais e subi o PR #48.', em: diasAtras(0, '10:20'), lida: true },
  { id: 2, idConversa: 1, idRemetente: 2, idProjeto: 1, idTarefa: 11, texto: 'Pode revisar quando der? Testei com a turma do 2º ano.', em: diasAtras(0, '10:21'), lida: true },
  { id: 3, idConversa: 1, idRemetente: 1, idProjeto: 1, idTarefa: 11, texto: 'Vou olhar depois do almoço. Tem migração nova?', em: diasAtras(0, '10:35'), lida: true },
  { id: 4, idConversa: 1, idRemetente: 2, idProjeto: 1, idTarefa: 11, texto: 'Tem uma, só adiciona o campo de nota final.', em: diasAtras(0, '12:40'), lida: false },
  // Projeto FabricaHUB
  { id: 5, idConversa: 2, idRemetente: 3, idProjeto: 3, texto: 'A tela de login ficou ótima, só ajustar o espaço do botão no celular.', em: diasAtras(0, '08:50'), lida: true },
  { id: 6, idConversa: 2, idRemetente: 5, idProjeto: 3, texto: 'Concordo. No resto está pronto para a review de sexta.', em: diasAtras(0, '09:12'), lida: false },
  // Equipe Front-end
  { id: 7, idConversa: 3, idRemetente: 7, idProjeto: 3, texto: 'Alguém pega o filtro de equipes? Estou no contador.', em: diasAtras(0, '08:10'), lida: true },
  { id: 8, idConversa: 3, idRemetente: 1, idProjeto: 3, texto: 'Está fixado no projeto FabricaHUB, eu pego hoje.', em: diasAtras(0, '08:30'), lida: true },
  // Zenere (direta)
  { id: 9, idConversa: 4, idRemetente: 4, idProjeto: 2, texto: 'Enviei as imagens novas para a galeria do atlas.', em: diasAtras(1, '16:05'), lida: true },
  // Projeto Painel de Integração
  { id: 10, idConversa: 5, idRemetente: 5, idProjeto: 1, texto: 'Atualizei o protótipo do painel de turmas no Figma.', em: diasAtras(5, '14:00'), lida: true },
  { id: 11, idConversa: 5, idRemetente: 6, idProjeto: 1, texto: 'O login dos professores vai usar a conta do IFC?', em: diasAtras(5, '15:30'), lida: true },
  // Pedro (direta, sobre o contador)
  { id: 12, idConversa: 6, idRemetente: 7, idProjeto: 3, idTarefa: 16, texto: 'Dá uma olhada no contador quando puder.', em: diasAtras(0, '07:40'), lida: false },
]
