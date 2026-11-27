<script setup lang="ts">
import { computed } from 'vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import type { Papel } from '@/utils/tipos'

const props = defineProps<{ papel: Papel }>()

// Mesma quantidade de itens do menu real de cada papel.
const secoes = computed(() => (props.papel === 'admin' ? [7, 5] : [5, 3]))
const larguras = ['62%', '78%', '54%', '70%', '48%', '66%', '58%']
const temPastas = computed(() => props.papel !== 'admin')
</script>

<template>
  <div class="esqueleto-barra" aria-hidden="true">
    <div v-for="(itens, i) in secoes" :key="i" class="secao">
      <EsqueletoBloco largura="112px" altura="22px" raio="4px" />
      <div v-for="j in itens" :key="j" class="item">
        <EsqueletoBloco largura="18px" altura="18px" raio="4px" />
        <EsqueletoBloco :largura="larguras[(j + i) % larguras.length]" altura="12px" />
      </div>
    </div>

    <div v-if="temPastas" class="secao">
      <EsqueletoBloco largura="128px" altura="22px" raio="4px" />
      <div v-for="j in 3" :key="j" class="pasta">
        <EsqueletoBloco largura="72px" altura="12px" raio="4px 4px 0 0" />
        <div class="cartao">
          <EsqueletoBloco :largura="larguras[j + 1]" altura="12px" />
          <EsqueletoBloco altura="3px" />
        </div>
      </div>
      <div class="cartao entrega">
        <EsqueletoBloco largura="96px" altura="10px" />
        <EsqueletoBloco largura="110px" altura="22px" />
        <EsqueletoBloco largura="80%" altura="10px" />
      </div>
    </div>

    <div class="cracha">
      <EsqueletoBloco altura="18px" raio="12px 12px 0 0" />
      <div class="cracha-corpo">
        <EsqueletoBloco largura="42px" altura="42px" raio="10px" />
        <div class="pilha">
          <EsqueletoBloco largura="70px" altura="14px" />
          <EsqueletoBloco largura="110px" altura="10px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.esqueleto-barra {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 22px;
}

.secao {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 0 12px;
}

.pasta {
  display: flex;
  flex-direction: column;
}

.cartao {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 0 8px 8px 8px;
}

.entrega {
  gap: 8px;
  margin-top: 4px;
}

.cracha {
  margin-top: auto;
  background: var(--surface);
  border-radius: var(--radius-menu);
  overflow: hidden;
}

.cracha-corpo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
}

.pilha {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
