<script setup lang="ts">
import BarraLateral from '@/components/global/BarraLateral.vue'
</script>

<template>
  <div class="app-layout">
    <a href="#conteudo" class="pular">Pular para o conteúdo</a>
    <BarraLateral class="barra" />
    <main id="conteudo" class="conteudo" tabindex="-1">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  min-height: 100vh;
  background: var(--ink);
}

.barra {
  flex: 1 1 240px;
  max-width: 240px;
}

.conteudo {
  flex: 999 1 560px;
  min-width: 0;
  padding: 32px clamp(16px, 4vw, 40px);
}

.conteudo:focus {
  outline: none;
}

.pular {
  position: absolute;
  left: 12px;
  top: -60px;
  z-index: 10;
  padding: 10px 14px;
  border-radius: var(--radius-btn);
  background: var(--brand-orange);
  color: #fff;
  font-weight: 600;
}

.pular:focus {
  top: 12px;
}

/* O flex quebra a linha abaixo de 800px (240 + 560): a sidebar vira um bloco
   de largura total acima do conteúdo, nunca fixa e sem 100vh. */
@media (max-width: 799px) {
  .barra {
    flex-basis: 100%;
    max-width: none;
  }

  .conteudo {
    padding: 24px 16px;
  }
}
</style>
