<script setup lang="ts">
import { computed } from 'vue'
import { lerData } from '@/utils/datas'

/** Folhinha de calendário: dia grande e mês. `destaque` pinta a faixa de cima (ex.: o evento mais próximo). */
const props = withDefaults(defineProps<{ data: string; destaque?: boolean }>(), { destaque: false })

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const dia = computed(() => String(lerData(props.data).getDate()).padStart(2, '0'))
const mes = computed(() => MESES[lerData(props.data).getMonth()])
</script>

<template>
  <span class="folha" :class="{ destaque }">
    <span class="faixa" aria-hidden="true" />
    <span class="dia">{{ dia }}</span>
    <span class="mes">{{ mes }}</span>
  </span>
</template>

<style scoped>
.folha {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 48px;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface-2);
  box-shadow: var(--shadow-hard);
}

.faixa {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, .14);
}

.destaque .faixa {
  background: var(--brand-orange);
}

.dia {
  margin-top: 4px;
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.mes {
  margin-bottom: 4px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--text-subtle);
}
</style>
