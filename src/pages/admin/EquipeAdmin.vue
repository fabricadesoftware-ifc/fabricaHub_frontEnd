<script setup lang="ts">
import { reactive } from 'vue'
import { NOMES_EQUIPES, type CadastroEquipe, type VinculoEquipe } from '@/utils/gestao'
import { isoDia } from '@/utils/datas'
import BotaoBase from '@/components/global/BotaoBase.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import { useRoute } from 'vue-router'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import RodapeGestao from '@/components/global/RodapeGestao.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import { fontesGestao as fontes, useCargaGestao, useEdicaoGestao } from '@/composables/useGestao'
const rota = useRoute()
const id = rota.params.id === undefined ? null : Number(rota.params.id)
const { salvarEquipe, excluir, ocupado, aviso } = useEdicaoGestao()
const form = reactive<CadastroEquipe>({ nome: 'Front-end', desde: isoDia(new Date()), membros: [], projetos: [] })
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  const [equipes, membros, projetos, vinculos] = await Promise.all([
    fontes.equipes(),
    fontes.membros(),
    fontes.projetos(),
    fontes.vinculos(),
  ])
  const equipe = equipes.find((e) => e.id === id)
  if (id !== null && !equipe) return null
  const nomes = NOMES_EQUIPES.filter((n) => !equipes.some((e) => e.nome === n && e.id !== id))
  form.nome = nomes.find((n) => n === equipe?.nome) ?? nomes[0] ?? 'Front-end'
  if (equipe) {
    form.desde = equipe.desde
    form.membros = vinculos.filter((v) => v.idEquipe === id).map((v) => ({ alvo: v.idUsuario, inicio: v.inicio, fim: v.fim }))
    form.projetos = equipe.projetos.map((v) => ({ alvo: v.idProjeto, inicio: v.inicio, fim: v.fim }))
  }
  return { nomes, nome: equipe?.nome ?? '', membros: membros.map((m) => ({ id: m.id, nome: m.nomeCompleto })), projetos }
})
const grupos = [
  { chave: 'membros', titulo: '[02] MEMBROS', singular: 'Membro' },
  { chave: 'projetos', titulo: '[03] PROJETOS', singular: 'Projeto' },
] as const
function remover(vinculos: VinculoEquipe[], indice: number) {
  if (window.confirm('Remover este vínculo da equipe?')) vinculos.splice(indice, 1)
}
</script>
<template>
  <PaginaGestao
    :titulo="id === null ? 'Nova equipe' : 'Editar equipe'"
    rotulo="FICHA DA EQUIPE"
    :carregando="carregando"
    :erro="erro"
    :vazio="!dado ? 'Equipe não encontrada.' : ''"
    @recarregar="carregar"
  >
    <EstadoVazio
      v-if="!dado?.nomes.length"
      titulo="As três equipes já estão cadastradas."
      texto="Abra a ficha da equipe para editar seus vínculos."
    >
      <BotaoBase variante="secundario" :para="{ name: 'admin-equipes' }">Ver equipes</BotaoBase>
    </EstadoVazio>
    <form v-else @submit.prevent="salvarEquipe(id, form)">
      <CartaoSecao rotulo="[01] IDENTIFICAÇÃO">
        <div class="grade">
          <label class="campo">
            Equipe
            <select v-model="form.nome">
              <option v-for="n in dado.nomes" :key="n">{{ n }}</option>
            </select>
          </label>
          <label class="campo">
            Data de criação
            <input type="date" v-model="form.desde" required />
          </label>
        </div>
      </CartaoSecao>
      <CartaoSecao v-for="g in grupos" :key="g.chave" :rotulo="g.titulo">
        <template #acao>
          <BotaoBase
            variante="secundario"
            :disabled="!dado[g.chave].length"
            @click="form[g.chave].push({ alvo: 0, inicio: isoDia(new Date()) })"
          >
            Vincular {{ g.singular.toLowerCase() }}
          </BotaoBase>
        </template>
        <EstadoVazio v-if="!form[g.chave].length" compacto titulo="Nenhum vínculo registrado." />
        <div v-for="(v, i) in form[g.chave]" :key="i" class="linha">
          <label class="campo identidade">
            {{ g.singular }}
            <select v-model="v.alvo" required>
              <option disabled :value="0">Selecione</option>
              <option v-for="op in dado[g.chave]" :key="op.id" :value="op.id">{{ op.nome }}</option>
            </select>
          </label>
          <label class="campo">
            Entrada
            <input type="date" v-model="v.inicio" required />
          </label>
          <label class="campo">
            Saída
            <input type="date" v-model="v.fim" :min="v.inicio" />
          </label>
          <BotaoBase variante="secundario" @click="remover(form[g.chave], i)">Remover</BotaoBase>
        </div>
      </CartaoSecao>
      <RodapeGestao
        :ocupado="ocupado"
        :aviso="aviso"
        volta="admin-equipes"
        :excluir="id !== null"
        @remover="id !== null && excluir('equipes', id, dado.nome)"
      />
    </form>
  </PaginaGestao>
</template>
