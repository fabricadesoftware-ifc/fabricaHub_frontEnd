<script setup lang="ts">
import { computed, ref, reactive, useTemplateRef } from 'vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import { useRoute } from 'vue-router'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import RodapeGestao from '@/components/global/RodapeGestao.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import { fontesGestao as fontes, useCargaGestao, useEdicaoGestao } from '@/composables/useGestao'
const id = Number(useRoute().params.id)
const { salvarMembro, ocupado, aviso } = useEdicaoGestao()
const form = reactive({ nome: '', nomeCompleto: '', curso: '', funcao: '', ativo: true, isSuper: false, tags: [] as string[] })
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  const [membros, tags] = await Promise.all([fontes.membros(), fontes.tags()])
  const m = membros.find((m) => m.id === id)
  if (!m) return null
  const { nome, nomeCompleto, curso, funcao, ativo, isSuper } = m
  Object.assign(form, { nome, nomeCompleto, curso, funcao, ativo, isSuper, tags: m.tags ?? [] })
  return { m, tags }
})
const dialogo = useTemplateRef<HTMLDialogElement>('dialogo')
const tag = ref('')
const disponiveis = computed(() => dado.value?.tags.filter((t) => !form.tags.includes(t)) ?? [])
function abrirDialogo() {
  tag.value = ''
  dialogo.value?.showModal()
}

function associar() {
  if (!disponiveis.value.includes(tag.value)) return
  form.tags.push(tag.value)
  dialogo.value?.close()
}
function remover(tag: string) {
  if (window.confirm('Remover a tag ' + tag + ' deste membro?')) form.tags = form.tags.filter((t) => t !== tag)
}
</script>
<template>
  <PaginaGestao
    titulo="Editar membro"
    rotulo="FICHA DO MEMBRO"
    :carregando="carregando"
    :erro="erro"
    :vazio="!dado ? 'Membro não encontrado.' : ''"
    @recarregar="carregar"
  >
    <form v-if="dado" @submit.prevent="salvarMembro(id, { ...form, tags: [...form.tags] })">
      <CartaoSecao rotulo="[01] IDENTIFICAÇÃO" :titulo="'@' + dado.m.usuario">
        <div class="grade">
          <label class="campo">
            Nome completo
            <input v-model.trim="form.nomeCompleto" required />
          </label>
          <label class="campo">
            Nome no crachá
            <input v-model.trim="form.nome" required />
          </label>
          <label class="campo">
            Curso
            <input v-model.trim="form.curso" required />
          </label>
          <label class="campo">
            Função
            <input v-model.trim="form.funcao" required />
          </label>
        </div>
      </CartaoSecao>
      <CartaoSecao rotulo="[02] ACESSO">
        <div class="grade">
          <label class="campo">
            Status
            <select v-model="form.ativo">
              <option :value="true">Ativo</option>
              <option :value="false">Inativo</option>
            </select>
          </label>
          <label class="campo">
            Papel de acesso
            <select v-model="form.isSuper">
              <option :value="false">Membro</option>
              <option :value="true">Administrador</option>
            </select>
          </label>
        </div>
        <small>A liderança é atribuída na ficha de cada projeto.</small>
      </CartaoSecao>
      <CartaoSecao rotulo="[03] TAGS">
        <template #acao>
          <BotaoBase
            variante="secundario"
            :disabled="!disponiveis.length"
            @click="abrirDialogo"
          >
            Associar tag
          </BotaoBase>
        </template>
        <EstadoVazio v-if="!form.tags.length" compacto titulo="Nenhuma tag associada." />
        <div v-for="t in form.tags" :key="t" class="linha">
          <strong class="identidade">{{ t }}</strong>
          <BotaoBase variante="secundario" @click="remover(t)">Remover</BotaoBase>
        </div>
      </CartaoSecao>
      <RodapeGestao :ocupado="ocupado" :aviso="aviso" volta="admin-membros" />
    </form>
    <dialog ref="dialogo" aria-labelledby="titulo-tag">
      <form @submit.prevent="associar">
        <h2 id="titulo-tag">Associar tag</h2>
        <label class="campo">
          Tag
          <select v-model="tag" required>
            <option value="" disabled>Selecione uma tag</option>
            <option v-for="t in disponiveis" :key="t">{{ t }}</option>
          </select>
        </label>
        <div class="botoes">
          <BotaoBase variante="secundario" @click="dialogo?.close()">Cancelar</BotaoBase>
          <BotaoBase tipo="submit">Associar</BotaoBase>
        </div>
      </form>
    </dialog>
  </PaginaGestao>
</template>
