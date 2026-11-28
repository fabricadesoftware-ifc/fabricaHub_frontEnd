<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef } from 'vue'
import { tagsAcesso, criarTag, alternarTag, estadoTag } from '@/api/tagsAcesso'
import { useAuthStore } from '@/stores/auth'
import { dataCompleta, diaRelativo } from '@/utils/datas'
const auth = useAuthStore(),
  filtro = ref('Todas'),
  aviso = ref(''),
  erro = ref('')
const modal = useTemplateRef<HTMLDialogElement>('modal')
const form = reactive({ codigo: '', descricao: '', validade: diaRelativo(30), limite: 10 })
const visiveis = computed(() =>
  tagsAcesso.value.filter(
    (t) => filtro.value === 'Todas' || (estadoTag(t) === 'Ativa') === (filtro.value === 'Ativas'),
  ),
)
function salvar() {
  if (!auth.usuario?.isSuper) return
  try {
    criarTag(form, auth.usuario.nome)
    modal.value?.close()
    filtro.value = 'Todas'
    aviso.value = 'Tag criada.'
  } catch (e) {
    erro.value = e instanceof Error ? e.message : 'Falha ao criar tag.'
  }
}
async function copiar(codigo: string) {
  try {
    await navigator.clipboard.writeText(codigo)
    aviso.value = 'Código copiado.'
  } catch {
    aviso.value = 'Copie o código exibido no cartão.'
  }
}
function abrir() {
  Object.assign(form, { codigo: '', descricao: '', validade: diaRelativo(30), limite: 10 })
  erro.value = ''
  modal.value?.showModal()
}
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; ETIQUETAS DE ENTRADA /&gt;</small>
        <h1>Tags de <span>acesso_</span></h1>
      </div>
      <button class="principal" @click="abrir">+ Nova tag</button>
    </header>
    <nav class="abas" aria-label="Estado da tag">
      <button
        v-for="f in ['Todas', 'Ativas', 'Inativas']"
        :key="f"
        :aria-pressed="f === filtro"
        @click="filtro = f"
      >
        {{ f }}
      </button>
    </nav>
    <div class="tags-grid">
      <article
        v-for="t in visiveis"
        :key="t.codigo"
        class="ticket"
        :class="{ inativa: estadoTag(t) !== 'Ativa' }"
      >
        <header>
          <h3>{{ t.codigo }}</h3>
          <span class="selo" :class="{ ok: estadoTag(t) === 'Ativa' }">{{ estadoTag(t) }}</span>
        </header>
        <p>{{ t.descricao }}</p>
        <dl>
          <div>
            <dt>Entra como</dt>
            <dd>Membro</dd>
          </div>
          <div>
            <dt>Validade</dt>
            <dd>{{ dataCompleta(t.validade) }}</dd>
          </div>
        </dl>
        <small
          >USOS <b>{{ t.usos }} DE {{ t.limite }}</b></small
        ><progress :value="t.usos" :max="t.limite" aria-label="Usos da tag"></progress>
        <footer>
          <button @click="copiar(t.codigo)">Copiar código</button
          ><button
            :disabled="['Vencida', 'Esgotada'].includes(estadoTag(t))"
            @click="auth.usuario?.isSuper && alternarTag(t, auth.usuario.nome)"
          >
            {{ t.ativa ? 'Desativar' : 'Reativar' }}
          </button>
        </footer>
      </article>
    </div>
    <p v-if="!visiveis.length">Nenhuma tag neste filtro.</p>
    <p class="nota">
      A tag é usada após o login com GitHub. A validade e o limite de usos controlam a entrada.
    </p>
    <p role="status">{{ aviso }}</p>
    <dialog ref="modal" aria-labelledby="nova-tag">
      <form @submit.prevent="salvar">
        <h2 id="nova-tag">Nova tag de acesso</h2>
        <label>Código<input v-model.trim="form.codigo" required autofocus /></label
        ><label>Descrição<input v-model.trim="form.descricao" required /></label
        ><label
          >Validade<input
            type="date"
            v-model="form.validade"
            :min="diaRelativo(0)"
            required /></label
        ><label
          >Limite de usos<input type="number" min="1" v-model.number="form.limite" required
        /></label>
        <p v-if="erro" role="alert">{{ erro }}</p>
        <footer>
          <button type="button" @click="modal?.close()">Cancelar</button
          ><button class="principal">Criar tag</button>
        </footer>
      </form>
    </dialog>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
