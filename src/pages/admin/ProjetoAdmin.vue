<script setup lang="ts">
import { reactive } from 'vue'
import { STATUS_PROJETO } from '@/composables/useListaProjetos'
import type { CadastroProjeto } from '@/utils/gestao'
import { useRoute } from 'vue-router'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import RodapeGestao from '@/components/global/RodapeGestao.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import { fontesGestao as fontes, useCargaGestao, useEdicaoGestao } from '@/composables/useGestao'
const rota = useRoute()
const id = rota.params.id === undefined ? null : Number(rota.params.id)
const form = reactive<CadastroProjeto>({ nome: '', resumo: '', descricao: '', status: 'Planejamento', idLead: 0, idOrientador: 0 })
const { salvarProjeto, excluir, ocupado, aviso } = useEdicaoGestao()
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  const [projetos, membros] = await Promise.all([fontes.projetos(), fontes.membros()])
  const p = projetos.find((p) => p.id === id)
  if (id !== null && !p) return null
  if (p) {
    const { nome, resumo, descricao, status, idLead, idOrientador } = p
    Object.assign(form, { nome, resumo, descricao, status, idLead, idOrientador })
  }
  return { membros: membros.filter((m) => m.ativo || m.id === p?.idLead || m.id === p?.idOrientador), nome: p?.nome ?? '' }
})
</script>
<template>
  <PaginaGestao
    :titulo="id === null ? 'Novo projeto' : 'Editar projeto'"
    rotulo="FICHA DO PROJETO"
    :carregando="carregando"
    :erro="erro"
    :vazio="!dado ? 'Projeto não encontrado.' : !dado.membros.length ? 'Nenhum membro disponível.' : ''"
    @recarregar="carregar"
  >
    <form v-if="dado" @submit.prevent="salvarProjeto(id, { ...form })">
      <CartaoSecao rotulo="[01] IDENTIFICAÇÃO">
        <div class="grade">
          <label class="campo">
            Nome
            <input v-model.trim="form.nome" required />
          </label>
          <label class="campo">
            Status
            <select v-model="form.status">
              <option v-for="s in STATUS_PROJETO" :key="s">{{ s }}</option>
            </select>
          </label>
        </div>
        <label class="campo">
          Resumo
          <input v-model.trim="form.resumo" required />
        </label>
        <label class="campo">
          Descrição
          <textarea v-model.trim="form.descricao" rows="4" />
        </label>
      </CartaoSecao>
      <CartaoSecao rotulo="[02] RESPONSÁVEIS">
        <div class="grade">
          <label class="campo">
            Líder
            <select v-model="form.idLead" required>
              <option disabled :value="0">Selecione o líder</option>
              <option v-for="m in dado.membros" :key="m.id" :value="m.id">{{ m.nomeCompleto }}</option>
            </select>
          </label>
          <label class="campo">
            Orientador
            <select v-model="form.idOrientador" required>
              <option disabled :value="0">Selecione o orientador</option>
              <option v-for="m in dado.membros" :key="m.id" :value="m.id">{{ m.nomeCompleto }}</option>
            </select>
          </label>
        </div>
      </CartaoSecao>
      <RodapeGestao
        :ocupado="ocupado"
        :aviso="aviso"
        volta="admin-projetos"
        :excluir="id !== null"
        @remover="id !== null && excluir('projetos', id, dado.nome)"
      />
    </form>
  </PaginaGestao>
</template>
