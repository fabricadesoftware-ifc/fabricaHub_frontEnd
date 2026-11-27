<script setup lang="ts">
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
</script>

<template>
  <div class="esqueleto-dashboard" aria-hidden="true">
    <div class="cabecalho">
      <div class="pilha">
        <EsqueletoBloco largura="220px" altura="10px" />
        <EsqueletoBloco largura="260px" altura="28px" />
      </div>
      <div class="linha">
        <EsqueletoBloco largura="240px" altura="40px" raio="8px" />
        <EsqueletoBloco largura="40px" altura="40px" raio="8px" />
      </div>
    </div>

    <div class="fichas">
      <div v-for="i in 4" :key="i" class="bloco ficha">
        <EsqueletoBloco largura="60%" altura="10px" />
        <div class="linha"><EsqueletoBloco largura="36px" altura="42px" /><EsqueletoBloco largura="36px" altura="42px" /></div>
        <EsqueletoBloco largura="80%" altura="10px" />
      </div>
    </div>

    <div class="colunas">
      <div class="principal">
        <div class="bloco caderno">
          <div class="espiral"><span v-for="i in 18" :key="i" /></div>
          <div class="pilha recuo"><EsqueletoBloco largura="90px" altura="10px" /><EsqueletoBloco largura="150px" altura="18px" /></div>
          <div v-for="i in 4" :key="i" class="linha recuo item">
            <EsqueletoBloco largura="16px" altura="16px" raio="4px" />
            <div class="pilha cresce"><EsqueletoBloco largura="55%" altura="12px" /><EsqueletoBloco largura="40%" altura="10px" /></div>
            <EsqueletoBloco largura="100px" altura="32px" raio="8px" />
            <EsqueletoBloco largura="52px" altura="20px" raio="999px" />
          </div>
        </div>

        <div class="pilha"><EsqueletoBloco largura="90px" altura="10px" /><EsqueletoBloco largura="160px" altura="18px" /></div>
        <div class="projetos">
          <div v-for="i in 3" :key="i" class="bloco pasta">
            <EsqueletoBloco largura="70%" altura="14px" />
            <EsqueletoBloco largura="40%" altura="18px" raio="999px" />
            <EsqueletoBloco largura="50%" altura="10px" />
            <div class="linha"><EsqueletoBloco largura="40px" altura="16px" /><EsqueletoBloco largura="56px" altura="16px" /></div>
          </div>
        </div>

        <div class="bloco agenda">
          <div class="pilha"><EsqueletoBloco largura="80px" altura="10px" /><EsqueletoBloco largura="130px" altura="18px" /></div>
          <div class="dias">
            <div v-for="i in 5" :key="i" class="pilha">
              <EsqueletoBloco largura="30px" altura="10px" />
              <EsqueletoBloco largura="26px" altura="20px" />
              <EsqueletoBloco altura="34px" raio="4px" />
            </div>
          </div>
        </div>
      </div>

      <div class="lateral">
        <div v-for="i in 4" :key="i" class="bloco lado" :class="{ mural: i === 3 }">
          <div class="pilha"><EsqueletoBloco largura="90px" altura="10px" /><EsqueletoBloco largura="130px" altura="18px" /></div>
          <EsqueletoBloco altura="44px" raio="8px" />
          <EsqueletoBloco altura="44px" raio="8px" />
          <EsqueletoBloco largura="70%" altura="44px" raio="8px" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.esqueleto-dashboard {
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
  gap: 8px;
}

.cresce {
  flex: 1;
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

.fichas {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.ficha {
  border-radius: 0 var(--radius-card) var(--radius-card) var(--radius-card);
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

.caderno {
  padding: 0 0 8px;
  overflow: hidden;
}

.espiral {
  display: flex;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--surface-2);
}

.espiral span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ink);
}

.recuo {
  padding: 0 18px;
}

.item {
  padding-top: 8px;
}

.projetos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.pasta {
  background: var(--surface-2);
}

.pasta :deep(.esqueleto) {
  background: var(--ink);
}

.dias {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.mural {
  background: var(--cortica);
}

@media (max-width: 1099px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}

@media (max-width: 599px) {
  .linha.item > :nth-child(n + 3) {
    display: none;
  }

  .dias {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
