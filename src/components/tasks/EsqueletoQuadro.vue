<script setup lang="ts">
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'

// Quantos cartões cada coluna mostra enquanto carrega (A fazer, Fazendo, Em revisão, Concluídas).
const cartoes = [3, 1, 2, 2]
const larguras = ['78%', '64%', '86%', '58%']
</script>

<template>
  <div class="esqueleto-quadro" aria-hidden="true">
    <div v-for="(quantidade, i) in cartoes" :key="i" class="coluna">
      <div class="topo">
        <EsqueletoBloco largura="110px" altura="22px" raio="4px" />
        <EsqueletoBloco largura="30px" altura="22px" raio="4px" />
      </div>

      <div v-for="j in quantidade" :key="j" class="cartao-esqueleto">
        <EsqueletoBloco class="aba" largura="64px" altura="15px" raio="4px 4px 0 0" />
        <div class="cartao">
          <EsqueletoBloco :largura="larguras[(i + j) % larguras.length]" altura="14px" />
          <EsqueletoBloco largura="52%" altura="10px" />
          <div class="meta">
            <EsqueletoBloco largura="52px" altura="20px" raio="999px" />
            <EsqueletoBloco largura="38px" altura="10px" />
          </div>
          <!-- Em revisão mostra só o "Aguardando o líder"; Concluídas, o carimbo -->
          <EsqueletoBloco v-if="i < 2" altura="44px" raio="8px" class="acao" />
          <EsqueletoBloco v-else-if="i === 2" largura="60%" altura="12px" class="acao" />
          <EsqueletoBloco v-else largura="70%" altura="24px" raio="6px" class="acao carimbo" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.esqueleto-quadro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
  gap: 16px;
}

.coluna {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.topo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.cartao-esqueleto {
  display: flex;
  flex-direction: column;
}

.cartao {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 14px 14px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
}

/* Blocos dentro do cartão (que já é surface-2) precisam de outro tom para aparecer */
.cartao :deep(.esqueleto) {
  background: rgba(255, 255, 255, .07);
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.acao {
  margin-top: 6px;
}

.carimbo {
  transform: rotate(-6deg);
}
</style>
