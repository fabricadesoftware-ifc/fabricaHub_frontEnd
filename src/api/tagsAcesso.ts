import { ref } from 'vue'
import { diaRelativo, isoDia } from '@/utils/datas'
import { lerJson, salvarJson } from '@/utils/armazenamento'
import type { GithubUser } from '@/utils/tipos'
import { autorizarConta, usuarios } from './usuarios'
import { pedidosAcesso } from './acesso'
import { registrar } from './auditoria'

export interface TagAcesso {
  codigo: string
  descricao: string
  validade: string
  limite: number
  usos: number
  ativa: boolean
}
const chave = 'fabricahub:tags-acesso'
export const tagsAcesso = ref<TagAcesso[]>(
  lerJson(chave) ?? [
    {
      codigo: 'FAB-INF-2026',
      descricao: 'Bolsistas de Informática',
      validade: diaRelativo(30),
      limite: 20,
      usos: 11,
      ativa: true,
    },
    {
      codigo: 'FAB-QUI-2026',
      descricao: 'Bolsistas de Química',
      validade: diaRelativo(30),
      limite: 5,
      usos: 2,
      ativa: true,
    },
    {
      codigo: 'WORKSHOP-DRF',
      descricao: 'Workshop de Django REST',
      validade: diaRelativo(0),
      limite: 30,
      usos: 8,
      ativa: true,
    },
    {
      codigo: 'FAB-INF-2025',
      descricao: 'Turma anterior de Informática',
      validade: diaRelativo(-30),
      limite: 20,
      usos: 14,
      ativa: false,
    },
  ],
)
export function estadoTag(tag: TagAcesso, hoje = isoDia(new Date())) {
  if (tag.validade < hoje) return 'Vencida'
  if (tag.usos >= tag.limite) return 'Esgotada'
  return tag.ativa ? 'Ativa' : 'Desativada'
}
export function criarTag(
  dados: Pick<TagAcesso, 'codigo' | 'descricao' | 'validade' | 'limite'>,
  autor: string,
) {
  const codigo = dados.codigo.trim().toUpperCase()
  if (!codigo || tagsAcesso.value.some((t) => t.codigo === codigo))
    throw new Error('Informe um código único.')
  if (
    !dados.descricao.trim() ||
    !dados.validade ||
    dados.validade < isoDia(new Date()) ||
    !Number.isInteger(dados.limite) ||
    dados.limite < 1
  )
    throw new Error('Confira a descrição, a validade e o limite de usos.')
  tagsAcesso.value.unshift({ ...dados, codigo, ativa: true, usos: 0 })
  salvarJson(chave, tagsAcesso.value)
  registrar(autor, 'Criou a tag ' + codigo + '.')
}
export function alternarTag(tag: TagAcesso, autor: string) {
  tag.ativa = !tag.ativa
  salvarJson(chave, tagsAcesso.value)
  registrar(autor, (tag.ativa ? 'Reativou ' : 'Desativou ') + tag.codigo + '.')
}
export function resgatarTag(codigo: string, conta: GithubUser) {
  const tag = tagsAcesso.value.find((t) => t.codigo === codigo.trim().toUpperCase())
  if (!tag || estadoTag(tag) !== 'Ativa') {
    registrar(conta.login, 'Apresentou uma tag inválida ou indisponível.', 'Acesso', false)
    throw new Error('Tag inválida, desativada, vencida ou esgotada.')
  }
  if (!usuarios.some((u) => u.usuario === conta.login && u.ativo)) {
    autorizarConta(conta)
    tag.usos++
    salvarJson(chave, tagsAcesso.value)
    for (const p of pedidosAcesso.value) if (p.loginGitHub === conta.login) p.pendente = false
    salvarJson('fabricahub:pedidos', pedidosAcesso.value)
    registrar(conta.login, 'Entrou com a tag ' + tag.codigo + '.', 'Acesso')
  }
  return usuarios.find((u) => u.usuario === conta.login)!.id
}
