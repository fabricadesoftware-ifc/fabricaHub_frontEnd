import type { Noticia } from '@/utils/tipos'

export const noticias: Noticia[] = [
  {
    id: 1,
    titulo: 'Apresentação dos projetos acontece em 4 de dezembro',
    data: '2026-11-25',
    categoria: 'Evento',
    resumo: 'Cada projeto tem 10 minutos para mostrar o que entregou no semestre, seguidos de 5 minutos de perguntas.',
    lide: 'Cada projeto da Fábrica tem 10 minutos para mostrar o que entregou no semestre, seguidos de 5 minutos de perguntas da banca.',
    blocos: [
      {
        tipo: 'paragrafo',
        texto:
          'A banca terá professores do curso de Informática e convidados de empresas da região. Os projetos serão apresentados na ordem do sorteio, que a coordenação publica no dia 1º de dezembro.',
      },
      { tipo: 'intertitulo', texto: 'O que levar' },
      {
        tipo: 'paragrafo',
        texto:
          'O projeto rodando em ambiente de testes, os slides no drive da equipe até 3 de dezembro e a lista de tarefas concluídas no FabricaHUB. A banca usa o quadro de tarefas para conferir o que foi entregue.',
      },
      {
        tipo: 'paragrafo',
        texto: 'Dúvidas sobre a ordem ou o tempo podem ser enviadas para a coordenação pelas Mensagens.',
      },
    ],
    autor: 'Coordenação da Fábrica',
    destaque: true,
    leituras: 64,
    nova: true,
    evento: { data: '2026-12-04', hora: '19h', local: 'Auditório do campus', quem: 'Líder de cada projeto' },
  },
  {
    id: 2,
    titulo: 'Inscrições abertas para o Painel de Integração',
    data: '2026-11-22',
    categoria: 'Projeto',
    resumo: 'Bolsistas do 2º ano podem se inscrever até 5 de dezembro pelo formulário da coordenação.',
    lide: 'O Painel de Integração abre duas vagas para bolsistas do 2º ano a partir de janeiro.',
    blocos: [
      {
        tipo: 'paragrafo',
        texto:
          'As inscrições vão até 5 de dezembro, pelo formulário da coordenação. Quem entrar começa na equipe de Front-end, com as telas de boletim e de lançamento de notas.',
      },
      {
        tipo: 'paragrafo',
        texto: 'A seleção tem uma conversa curta com o líder do projeto e uma tarefa prática de uma semana.',
      },
    ],
    autor: 'Coordenação da Fábrica',
    destaque: false,
    leituras: 41,
    nova: false,
  },
  {
    id: 3,
    titulo: 'Workshop de Django REST no dia 27',
    data: '2026-11-18',
    categoria: 'Evento',
    resumo: 'Igor apresenta autenticação, permissões e testes de API. Traga o notebook.',
    lide: 'Igor apresenta autenticação, permissões e testes de API num workshop de duas horas no Laboratório 3.',
    blocos: [
      {
        tipo: 'paragrafo',
        texto:
          'O workshop é aberto a todos os membros. Quem for deve chegar com o Python 3.12 e o projeto de exemplo já clonado, para não perder tempo com instalação.',
      },
    ],
    autor: 'Igor Martins',
    destaque: false,
    leituras: 37,
    nova: false,
    evento: { data: '2026-11-27', hora: '14h', local: 'Laboratório 3', quem: 'Igor Martins' },
  },
  {
    id: 4,
    titulo: 'Novos bolsistas chegam à Fábrica',
    data: '2026-11-10',
    categoria: 'Equipe',
    resumo: 'Seis estudantes entram nas equipes de Front-end, Back-end e Design.',
    lide: 'Seis estudantes entram na Fábrica neste mês, divididos entre as equipes de Front-end, Back-end e Design.',
    blocos: [
      {
        tipo: 'paragrafo',
        texto:
          'Cada um terá um padrinho da própria equipe nas primeiras semanas. As primeiras tarefas já estão no quadro, marcadas com a tag de boas-vindas.',
      },
    ],
    autor: 'Coordenação da Fábrica',
    destaque: false,
    leituras: 29,
    nova: false,
  },
  {
    id: 5,
    titulo: 'Site da Fábrica entra no ar',
    data: '2026-10-28',
    categoria: 'Aviso',
    resumo: 'O novo site reúne os projetos entregues e a lista de bolsistas de cada semestre.',
    lide: 'O novo site da Fábrica está no ar, com os projetos entregues e a lista de bolsistas de cada semestre.',
    blocos: [
      {
        tipo: 'paragrafo',
        texto: 'Erros ou informações desatualizadas podem ser avisados à equipe de Front-end pelas Mensagens.',
      },
    ],
    autor: 'Equipe Front-end',
    destaque: false,
    leituras: 18,
    nova: false,
  },
]
