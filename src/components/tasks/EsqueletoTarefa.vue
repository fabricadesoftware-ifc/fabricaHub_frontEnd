<script setup lang="ts">
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
</script>

<template>
  <div class="esqueleto-tarefa" aria-hidden="true">
    <div class="cabecalho">
      <div class="pilha">
        <EsqueletoBloco largura="200px" altura="10px" />
        <EsqueletoBloco largura="150px" altura="10px" />
        <EsqueletoBloco largura="min(420px, 90%)" altura="28px" />
        <div class="linha">
          <EsqueletoBloco v-for="i in 4" :key="i" largura="58px" altura="20px" raio="999px" />
        </div>
      </div>
      <div class="linha">
        <EsqueletoBloco largura="170px" altura="44px" raio="8px" />
        <EsqueletoBloco largura="160px" altura="44px" raio="8px" />
      </div>
    </div>

    <div class="colunas">
      <div class="principal">
        <div class="bloco">
          <EsqueletoBloco largura="110px" altura="10px" />
          <EsqueletoBloco altura="12px" />
          <EsqueletoBloco altura="12px" />
          <EsqueletoBloco largura="60%" altura="12px" />
        </div>
        <div class="bloco">
          <EsqueletoBloco largura="90px" altura="10px" />
          <EsqueletoBloco largura="120px" altura="18px" />
          <div v-for="i in 2" :key="i" class="linha">
            <EsqueletoBloco largura="30px" altura="30px" raio="8px" />
            <div class="pilha cresce"><EsqueletoBloco largura="30%" altura="12px" /><EsqueletoBloco largura="70%" altura="12px" /></div>
          </div>
          <EsqueletoBloco altura="72px" raio="8px" />
        </div>
      </div>
      <div class="lateral">
        <div class="bloco">
          <EsqueletoBloco largura="80px" altura="10px" />
          <div v-for="i in 8" :key="i" class="linha">
            <EsqueletoBloco largura="70px" altura="10px" />
            <EsqueletoBloco largura="45%" altura="12px" />
          </div>
        </div>
        <div class="bloco">
          <EsqueletoBloco largura="90px" altura="10px" />
          <EsqueletoBloco altura="36px" />
          <EsqueletoBloco altura="36px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.esqueleto-tarefa {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cabecalho {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.pilha {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.linha {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cresce {
  flex: 1;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
  gap: 20px;
}

.principal,
.lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.bloco {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 18px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
}

@media (max-width: 999px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
