<script setup lang="ts">
import { reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import type { CadastroNoticia } from '@/utils/gestao'
import { isoDia } from '@/utils/datas'
import { CATEGORIAS } from '@/composables/useJornal'
import BotaoBase from '@/components/global/BotaoBase.vue'
import { useRoute } from 'vue-router'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import RodapeGestao from '@/components/global/RodapeGestao.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import { fontesGestao as fontes, useCargaGestao, useEdicaoGestao } from '@/composables/useGestao'
const rota = useRoute()
const id = rota.params.id === undefined ? null : Number(rota.params.id)
const auth = useAuthStore()
const form = reactive<CadastroNoticia>({
  titulo: '',
  data: isoDia(new Date()),
  categoria: 'Aviso',
  resumo: '',
  lide: '',
  blocos: [],
  autor: auth.usuario?.nome ?? '',
  destaque: false,
})
const { salvarNoticia, excluir, ocupado, aviso } = useEdicaoGestao()
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  if (id === null) return { nome: '' }
  const n = (await fontes.noticias()).find((n) => n.id === id)
  if (!n) return null
  const { titulo, data, categoria, resumo, lide, blocos, autor, destaque } = n
  Object.assign(form, { titulo, data, categoria, resumo, lide, blocos, autor, destaque })
  return { nome: titulo }
})
function remover(i: number) {
  if (window.confirm('Excluir este bloco de texto?')) form.blocos.splice(i, 1)
}
</script>
<template>
  <PaginaGestao
    :titulo="id === null ? 'Nova notícia' : 'Editar notícia'"
    rotulo="REDAÇÃO"
    :carregando="carregando"
    :erro="erro"
    :vazio="!dado ? 'Notícia não encontrada.' : ''"
    @recarregar="carregar"
  >
    <form v-if="dado" @submit.prevent="salvarNoticia(id, { ...form, blocos: form.blocos.map((b) => ({ ...b })) })">
      <CartaoSecao rotulo="[01] PUBLICAÇÃO">
        <label class="campo">
          Título
          <input v-model.trim="form.titulo" required />
        </label>
        <div class="grade">
          <label class="campo">
            Categoria
            <select v-model="form.categoria">
              <option v-for="c in CATEGORIAS" :key="c">{{ c }}</option>
            </select>
          </label>
          <label class="campo">
            Data
            <input type="date" v-model="form.data" required />
          </label>
          <label class="campo">
            Autor
            <input v-model.trim="form.autor" required />
          </label>
        </div>
        <label>
          <input type="checkbox" v-model="form.destaque" />
          Destaque na primeira página
        </label>
      </CartaoSecao>
      <CartaoSecao rotulo="[02] TEXTO" variante="caderno">
        <label class="campo">
          Resumo
          <textarea v-model.trim="form.resumo" rows="2" required />
        </label>
        <label class="campo">
          Primeiro parágrafo
          <textarea v-model.trim="form.lide" rows="3" required />
        </label>
        <div v-for="(b, i) in form.blocos" :key="i" class="linha">
          <label class="campo identidade">
            {{ b.tipo === 'paragrafo' ? 'Parágrafo' : 'Intertítulo' }}
            <textarea v-model.trim="b.texto" rows="2" required />
          </label>
          <BotaoBase variante="secundario" @click="remover(i)">Remover</BotaoBase>
        </div>
        <div class="filtros">
          <BotaoBase variante="secundario" @click="form.blocos.push({ tipo: 'paragrafo', texto: '' })">Adicionar parágrafo</BotaoBase>
          <BotaoBase variante="secundario" @click="form.blocos.push({ tipo: 'intertitulo', texto: '' })">
            Adicionar intertítulo
          </BotaoBase>
        </div>
      </CartaoSecao>
      <RodapeGestao
        :ocupado="ocupado"
        :aviso="aviso"
        volta="admin-noticias"
        :excluir="id !== null"
        @remover="id !== null && excluir('noticias', id, dado.nome)"
      />
    </form>
  </PaginaGestao>
</template>
