import { lerJson, salvarJson } from '@/utils/armazenamento'
import { reactive } from 'vue'
import { usuarios, salvarUsuarios } from './usuarios'
import { projetos } from '@/mocks/projetos'
import { tags } from '@/mocks/gestao'
import { tarefasEmMemoria } from './tarefas'
import { registrar } from './auditoria'

export const categorias = [
  'Áreas',
  'Cursos',
  'Funções',
  'Prioridades',
  'Etiquetas',
  'Tecnologias',
] as const
export type Categoria = (typeof categorias)[number]
interface Vinculo {
  nome: string
  mudar: (nome: string) => void
}
function vinculos(categoria: Categoria, incluirUsuarios = true): Vinculo[] {
  const pessoas = incluirUsuarios ? usuarios : []
  const tarefas = tarefasEmMemoria()
  function lista(nomes: string[]) {
    return nomes.map((nome, i) => ({
      nome,
      mudar: (valor: string) => {
        nomes[i] = valor
      },
    }))
  }
  switch (categoria) {
    case 'Áreas':
      return pessoas.map((u) => ({
        nome: u.area ?? u.funcao,
        mudar: (nome) => {
          u.area = nome
        },
      }))
    case 'Cursos':
      return pessoas.map((u) => ({
        nome: u.curso,
        mudar: (nome) => {
          u.curso = nome
        },
      }))
    case 'Funções':
      return [...pessoas, ...tarefas, ...projetos.flatMap((p) => p.membros)].map((u) => ({
        nome: u.funcao,
        mudar: (nome) => {
          u.funcao = nome
        },
      }))
    case 'Prioridades':
      return tarefas.map((t) => ({
        nome: t.prioridade,
        mudar: (nome) => {
          t.prioridade = nome
        },
      }))
    case 'Etiquetas':
      return [...pessoas, ...tarefas].flatMap((u) => lista(u.tags ?? []))
    case 'Tecnologias':
      return projetos.flatMap((p) => lista(p.tecnologias))
  }
}
const iniciais: Record<Categoria, string[]> = {
  Áreas: ['Desenvolvimento web', 'Design de interface', 'Dados', 'Infraestrutura'],
  Cursos: [],
  Funções: ['Embarcados'],
  Prioridades: ['Baixa', 'Média', 'Alta'],
  Etiquetas: tags,
  Tecnologias: [
    'Vue',
    'React',
    'Django REST',
    'Node',
    'PostgreSQL',
    'MySQL',
    'Docker',
    'Figma',
    'Python',
    'ESP32',
  ],
}
type Listas = Record<Categoria, string[]>
interface Mudanca {
  categoria: Categoria
  anterior: string
  novo: string
}
const chave = 'fabricahub:cadastros'
const salvo = lerJson<{ listas: Listas; mudancas: Mudanca[] }>(chave)
const mudancas = salvo?.mudancas ?? []
// Projetos e tarefas usam mocks de sessão. Reaplica os nomes do catálogo ao iniciar.
for (const m of mudancas) {
  for (const v of vinculos(m.categoria, false)) if (v.nome === m.anterior) v.mudar(m.novo)
}
export const catalogo = reactive(
  salvo?.listas ??
    (Object.fromEntries(
      categorias.map((c) => [
        c,
        [...new Set([...iniciais[c], ...vinculos(c).map((v) => v.nome)].filter(Boolean))],
      ]),
    ) as Record<Categoria, string[]>),
)
export function usos(c: Categoria, nome: string) {
  return vinculos(c).filter((v) => v.nome === nome).length
}
export function alterarItem(
  c: Categoria,
  anterior: string | null,
  novo: string | null,
  autor: string,
) {
  const itens = catalogo[c]
  const nome = novo?.trim() ?? ''
  const indice = anterior === null ? -1 : itens.indexOf(anterior)
  if (anterior !== null && indice < 0) throw new Error('Item não encontrado.')
  if (
    novo !== null &&
    (!nome ||
      itens.some((n, i) => i !== indice && n.toLocaleLowerCase() === nome.toLocaleLowerCase()))
  )
    throw new Error('Informe um nome único nesta aba.')
  const associados = vinculos(c).filter((v) => v.nome === anterior)
  if (novo === null && associados.length) throw new Error('Este item está em uso.')
  if (anterior === null) itens.push(nome)
  else if (novo === null) itens.splice(indice, 1)
  else {
    if (c === 'Funções') for (const u of usuarios) u.area ??= u.funcao
    associados.forEach((v) => v.mudar(nome))
    itens.splice(indice, 1, nome)
    mudancas.push({ categoria: c, anterior, novo: nome })
    salvarUsuarios()
  }
  salvarJson(chave, { listas: catalogo, mudancas })
  registrar(
    autor,
    c +
      ' · ' +
      (anterior === null
        ? 'Adicionou ' + nome
        : novo === null
          ? 'Excluiu ' + anterior
          : anterior + ' → ' + nome),
  )
}
