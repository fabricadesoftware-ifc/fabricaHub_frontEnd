<script setup lang="ts">
withDefaults(
  defineProps<{ texto: string; assinatura?: string; tipo?: 'aprovado' | 'devolvido' | 'recusado' }>(),
  { assinatura: '', tipo: 'aprovado' },
)
</script>

<template>
  <div class="carimbo" :class="tipo">
    <span class="texto">{{ texto }}</span>
    <span v-if="assinatura" class="assinatura">{{ assinatura }}</span>
  </div>
</template>

<style scoped>
.carimbo {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 8px 16px;
  border: 3px double var(--cor);
  border-radius: 10px;
  color: var(--cor);
  font-family: var(--font-mono);
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
  transform: rotate(-8deg);
}

.texto {
  font-size: 18px;
  line-height: 1.2;
}

.assinatura {
  font-size: 10px;
  font-weight: 700;
}

.aprovado {
  --cor: #3FB950;
}

.devolvido {
  --cor: #FF8533;
}

.recusado {
  --cor: #FF6B5E;
}
</style>
