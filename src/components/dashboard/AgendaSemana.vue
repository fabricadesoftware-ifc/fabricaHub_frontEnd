<script setup lang="ts">
import type { EventoAgenda } from '@/utils/tipos'

export interface DiaAgenda {
  iso: string
  sigla: string
  numero: number
  hoje: boolean
  eventos: EventoAgenda[]
}

defineProps<{ dias: DiaAgenda[]; nomeProjeto: (id?: number) => string }>()

function detalhe(evento: EventoAgenda, nomeProjeto: (id?: number) => string): string {
  if (evento.tipo === 'entrega' && !evento.concluido) return 'PRAZO'
  if (evento.hora) return ''
  return nomeProjeto(evento.idProjeto)
}
</script>

<template>
  <ol class="agenda">
    <li v-for="dia in dias" :key="dia.iso" class="dia" :class="{ hoje: dia.hoje }" :aria-current="dia.hoje ? 'date' : undefined">
      <p class="cabecalho">
        <span class="sigla">{{ dia.sigla }}</span>
        <span v-if="dia.hoje" class="marcador">HOJE</span>
      </p>
      <p class="numero">{{ dia.numero }}</p>
      <ul class="eventos">
        <li
          v-for="evento in dia.eventos"
          :key="evento.id"
          class="evento"
          :class="[evento.tipo, { concluido: evento.concluido, prazo: evento.tipo === 'entrega' && !evento.concluido }]"
        >
          <span class="titulo">{{ evento.titulo }}<template v-if="evento.hora"> · {{ evento.hora }}</template></span>
          <span v-if="detalhe(evento, nomeProjeto)" class="detalhe">{{ detalhe(evento, nomeProjeto) }}</span>
          <span v-if="evento.concluido" class="sr-only">(concluído)</span>
        </li>
      </ul>
    </li>
  </ol>
</template>

<style scoped>
.agenda {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid var(--border);
}

.dia {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 150px;
  padding: 10px 8px;
  border-right: 1px solid var(--border);
}

.dia:last-child {
  border-right: 0;
}

.hoje {
  border: 1.5px solid var(--brand-orange);
  border-radius: 4px;
}

.cabecalho {
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

.marcador {
  color: var(--brand-orange);
}

.numero {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 800;
  color: var(--text-muted);
}

.hoje .numero,
.hoje .sigla {
  color: var(--text);
}

.eventos {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 6px 0 0;
  padding: 0;
  list-style: none;
}

.evento {
  display: flex;
  flex-direction: column;
  padding: 6px 8px;
  border-radius: 4px;
  background: var(--surface-2);
  font-size: 11px;
  line-height: 1.35;
}

.evento .titulo::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--text-subtle);
  vertical-align: middle;
}

.evento.reuniao .titulo::before,
.evento.evento .titulo::before {
  background: var(--brand-teal);
}

.evento.prazo .titulo::before {
  background: var(--brand-orange);
}

.concluido {
  opacity: .5;
}

.titulo {
  font-weight: 600;
}

.detalhe {
  font-family: var(--font-mono);
  font-size: 9.5px;
  color: var(--text-subtle);
}

.prazo .detalhe {
  font-weight: 700;
  color: var(--brand-orange);
}

@media (max-width: 699px) {
  .agenda {
    grid-template-columns: minmax(0, 1fr);
  }

  .dia {
    min-height: 0;
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }
}
</style>
