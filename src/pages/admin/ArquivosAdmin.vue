<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { arquivosApi, capacidade, classe, type Arquivo } from '@/api/arquivos'
import { registrar } from '@/api/auditoria'
import { useAuthStore } from '@/stores/auth'
import { dataCurta } from '@/utils/datas'
import { baixar } from '@/utils/download'
const auth = useAuthStore(),
  itens = ref<Arquivo[]>([]),
  filtro = ref('Todos'),
  busca = ref(''),
  aviso = ref(''),
  ocupado = ref(false),
  carregando = ref(true)
const seletor = useTemplateRef<HTMLInputElement>('seletor')
const total = computed(() => itens.value.reduce((s, a) => s + a.bytes, 0))
const visiveis = computed(() =>
  itens.value.filter(
    (a) =>
      (filtro.value === 'Todos' || filtro.value === a.tipo) &&
      a.nome.toLocaleLowerCase().includes(busca.value.trim().toLocaleLowerCase()),
  ),
)
function tamanho(n: number) {
  return n < 1024
    ? n + ' B'
    : n < 1024 ** 2
      ? Math.ceil(n / 1024) + ' KB'
      : (n / 1024 ** 2).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + ' MB'
}
async function carregar() {
  carregando.value = true
  try {
    itens.value = (await arquivosApi.listar()).sort((a, b) => b.em.localeCompare(a.em))
  } catch {
    aviso.value = 'Não foi possível abrir o arquivo geral deste navegador.'
  } finally {
    carregando.value = false
  }
}
onMounted(carregar)
async function enviar(lista: FileList | null) {
  if (!lista || ocupado.value || !auth.usuario?.isSuper) return
  ocupado.value = true
  const mensagens: string[] = []
  try {
    for (const f of Array.from(lista)) {
      const tipo = classe(f.name)
      if (!tipo || f.size > 20 * 1024 ** 2 || f.size + total.value > capacidade) {
        mensagens.push(f.name + ' excede o limite ou possui formato incompatível.')
        continue
      }
      const arquivo: Arquivo = {
        id: crypto.randomUUID(),
        nome: f.name,
        em: new Date().toISOString(),
        tipo,
        bytes: f.size,
        autor: auth.usuario.nome,
        conteudo: f,
      }
      await arquivosApi.salvar(arquivo)
      itens.value.unshift(arquivo)
      registrar(arquivo.autor, 'Enviou ' + f.name + '.')
      mensagens.push(f.name + ' enviado.')
    }
  } catch {
    mensagens.push('O navegador não conseguiu armazenar o arquivo.')
  } finally {
    ocupado.value = false
    aviso.value = mensagens.join(' ')
    if (seletor.value) seletor.value.value = ''
  }
}
async function remover(a: Arquivo) {
  if (!auth.usuario?.isSuper || !window.confirm('Excluir ' + a.nome + '?')) return
  try {
    await arquivosApi.excluir(a.id)
    itens.value = itens.value.filter((x) => x.id !== a.id)
    registrar(auth.usuario.nome, 'Excluiu ' + a.nome + '.')
    aviso.value = 'Arquivo excluído.'
  } catch {
    aviso.value = 'Falha ao excluir arquivo.'
  }
}
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; ARQUIVO GERAL /&gt; · {{ itens.length }} ARQUIVOS</small>
        <h1>Arquivos<span>_</span></h1>
      </div>
    </header>
    <div class="envio-grid">
      <section
        class="drop"
        @dragover.prevent
        @drop.prevent="enviar($event.dataTransfer?.files ?? null)"
      >
        <span class="icone-envio" aria-hidden="true">↑</span>
        <div>
          <h3>Arraste arquivos ou escolha do computador</h3>
          <p>PDF, imagens e planilhas até 20 MB.</p>
        </div>
        <input
          ref="seletor"
          type="file"
          hidden
          multiple
          accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.svg,.csv,.xlsx,.xls,.ods"
          @change="enviar(seletor?.files ?? null)"
        /><button class="principal" :disabled="ocupado || carregando" @click="seletor?.click()">
          Enviar arquivo
        </button>
      </section>
      <section class="painel-sis">
        <small
          >ESPAÇO <b>{{ tamanho(total) }} DE 5 GB</b></small
        ><progress :value="total" :max="capacidade" aria-label="Espaço utilizado"></progress>
        <p>PDF · Imagens · Planilhas</p>
      </section>
    </div>
    <p v-if="aviso" role="status">{{ aviso }}</p>
    <section class="painel-sis">
      <div class="faixa">
        <button
          v-for="f in ['Todos', 'PDF', 'Imagem', 'Planilha']"
          :key="f"
          :aria-pressed="filtro === f"
          @click="filtro = f"
        >
          {{ f }}</button
        ><input
          v-model="busca"
          type="search"
          aria-label="Buscar arquivo"
          placeholder="Buscar arquivo..."
        />
      </div>
      <div class="rolar">
        <table>
          <thead>
            <tr>
              <th>Arquivo</th>
              <th>Usado em</th>
              <th>Enviado por</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in visiveis" :key="a.id">
              <td>
                <strong>{{ a.nome }}</strong
                ><small>{{ a.tipo }} · {{ tamanho(a.bytes) }}</small>
              </td>
              <td>{{ a.usadoEm ?? 'Geral' }}</td>
              <td>{{ a.autor }}</td>
              <td>{{ dataCurta(a.em) }}</td>
              <td>
                <div class="acoes-sis">
                  <button :aria-label="'Baixar ' + a.nome" @click="baixar(a.conteudo, a.nome)">
                    ↓</button
                  ><button
                    class="perigo"
                    :disabled="!!a.usadoEm"
                    :title="a.usadoEm ? 'Arquivo em uso pelo sistema' : undefined"
                    :aria-label="'Excluir ' + a.nome"
                    @click="remover(a)"
                  >
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!visiveis.length">
        {{ carregando ? 'Carregando arquivos…' : 'Nenhum arquivo encontrado.' }}
      </p>
    </section>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
