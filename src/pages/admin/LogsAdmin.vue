<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { registros, tiposLog } from '@/api/auditoria'
import { dataHora, diaRelativo, isoDia } from '@/utils/datas'
import { baixar } from '@/utils/download'
const tipo = ref('Todos'),
  status = ref('Todos'),
  periodo = ref('7 dias'),
  busca = ref(''),
  limite = ref(10)
watch([tipo, status, periodo, busca], () => {
  limite.value = 10
})
const filtrados = computed(() => {
  const inicio = diaRelativo(periodo.value === 'Hoje' ? 0 : periodo.value === '7 dias' ? -6 : -29)
  return registros.value.filter(
    (r) =>
      isoDia(new Date(r.em)) >= inicio &&
      (tipo.value === 'Todos' || r.tipo === tipo.value) &&
      (status.value === 'Todos' || r.sucesso === (status.value === 'Sucesso')) &&
      (r.autor + ' ' + r.acao).toLocaleLowerCase().includes(busca.value.trim().toLocaleLowerCase()),
  )
})
function exportar() {
  const linhas = [
    ['Quando', 'Tipo', 'Ação', 'Usuário', 'Status'],
    ...filtrados.value.map((r) => [r.em, r.tipo, r.acao, r.autor, r.sucesso ? 'OK' : 'Falha']),
  ]
  const csv = linhas
    .map((l) =>
      l
        .map((v) => '"' + (/^[=+@\-\t\r]/.test(v) ? "'" : '') + v.replaceAll('"', '""') + '"')
        .join(';'),
    )
    .join('\r\n')
  baixar(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' }), 'auditoria.csv')
}
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; FITA DE REGISTRO /&gt;</small>
        <h1>Logs e <span>auditoria_</span></h1>
      </div>
      <button @click="exportar">Exportar CSV</button>
    </header>
    <section class="painel-sis filtros-log">
      <div class="faixa">
        <small>Tipo</small
        ><button
          v-for="t in ['Todos', ...tiposLog]"
          :key="t"
          :aria-pressed="tipo === t"
          @click="tipo = t"
        >
          {{ t }}</button
        ><input
          v-model="busca"
          type="search"
          aria-label="Buscar usuário ou ação"
          placeholder="Buscar usuário ou ação..."
        />
      </div>
      <div class="faixa">
        <small>Status</small
        ><button
          v-for="s in ['Todos', 'Sucesso', 'Falha']"
          :key="s"
          :aria-pressed="status === s"
          @click="status = s"
        >
          {{ s }}</button
        ><small>Período</small
        ><button
          v-for="p in ['Hoje', '7 dias', '30 dias']"
          :key="p"
          :aria-pressed="periodo === p"
          @click="periodo = p"
        >
          {{ p }}
        </button>
      </div>
    </section>
    <section class="painel-sis fita">
      <small
        >FABRICAHUB · AUDITORIA <b>{{ filtrados.length }} REGISTROS</b></small
      >
      <div class="rolar">
        <table>
          <thead>
            <tr>
              <th>Quando</th>
              <th>Tipo</th>
              <th>Ação</th>
              <th>Usuário</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(r, i) in filtrados.slice(0, limite)"
              :key="i"
              :class="{ falha: !r.sucesso }"
            >
              <td>{{ dataHora(r.em) }}</td>
              <td>{{ r.tipo }}</td>
              <td>{{ r.acao }}</td>
              <td>{{ r.autor }}</td>
              <td :class="{ ok: r.sucesso }">{{ r.sucesso ? 'OK' : 'FALHA' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!filtrados.length">Nenhum registro corresponde aos filtros.</p>
      <button v-if="filtrados.length > limite" @click="limite += 10">Carregar mais</button>
    </section>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
