<script setup lang="ts">
import { ref } from 'vue'
import { catalogo, categorias, alterarItem, usos, type Categoria } from '@/api/cadastros'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { projetosApi } from '@/api/projetos'
const auth = useAuthStore(),
  projetos = useProjetosStore()
const aba = ref<Categoria>('Áreas'),
  entrada = ref(''),
  editando = ref<string | null>(null),
  aviso = ref('')
function selecionar(c: Categoria) {
  aba.value = c
  entrada.value = ''
  editando.value = null
  aviso.value = ''
}
function editar(nome: string) {
  editando.value = nome
  entrada.value = nome
}

async function salvar(anterior: string | null, valor: string | null) {
  if (!auth.usuario?.isSuper) return
  try {
    alterarItem(aba.value, anterior, valor, auth.usuario.nome)
    selecionar(aba.value)
    projetos.substituir(await projetosApi.listar())
  } catch (e) {
    aviso.value = e instanceof Error ? e.message : 'Falha ao salvar.'
  }
}
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; FICHÁRIO /&gt; · LISTAS USADAS NOS FORMULÁRIOS</small>
        <h1>Cadastros<span>_</span></h1>
      </div>
    </header>
    <div>
      <nav class="abas pastas" aria-label="Categorias">
        <button v-for="c in categorias" :key="c" :aria-pressed="aba === c" @click="selecionar(c)">
          {{ c }} <b>{{ catalogo[c].length }}</b>
        </button>
      </nav>
      <section class="painel-sis">
        <h2 class="indice">[0{{ categorias.indexOf(aba) + 1 }}] {{ aba }}</h2>
        <form class="entrada" @submit.prevent="salvar(editando, entrada)">
          <input
            v-model.trim="entrada"
            :aria-label="'Nome em ' + aba"
            :placeholder="'Novo item em ' + aba"
            required
          /><button v-if="editando" type="button" @click="selecionar(aba)">Cancelar</button
          ><button class="principal">{{ editando ? 'Salvar' : '+ Adicionar' }}</button>
        </form>
        <p v-if="aviso" role="alert">{{ aviso }}</p>
        <div class="rolar">
          <table>
            <thead>
              <tr>
                <th>Nº</th>
                <th>Nome</th>
                <th>Em uso</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(nome, i) in catalogo[aba]" :key="nome">
                <td>{{ String(i + 1).padStart(2, '0') }}</td>
                <td>
                  <strong>{{ nome }}</strong>
                </td>
                <td>{{ usos(aba, nome) || 'Sem uso' }}</td>
                <td>
                  <div class="acoes-sis">
                    <button @click="editar(nome)">Editar</button>
                    <button
                      class="perigo"
                      :disabled="!!usos(aba, nome)"
                      @click="salvar(nome, null)"
                    >
                      Excluir
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="nota">
          Itens em uso podem ser renomeados. O novo nome aparece nos registros vinculados.
        </p>
      </section>
    </div>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
