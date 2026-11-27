<script setup lang="ts">
import AuthEsferas from '@/components/auth/AuthEsferas.vue'
import { logoFabrica } from '@/utils/logo'

withDefaults(
  defineProps<{
    /** Esferas decorativas ao fundo (o 404 não tem). */
    esferas?: boolean
    /** `gaveta` deixa as duas colunas do mesmo tamanho (404); `centro` usa uma coluna centralizada. */
    colunas?: 'cracha' | 'gaveta' | 'centro'
  }>(),
  { esferas: true, colunas: 'cracha' },
)
</script>

<template>
  <div class="auth-layout">
    <AuthEsferas v-if="esferas" />

    <header class="cabecalho">
      <img v-if="logoFabrica" :src="logoFabrica" alt="Fábrica de Software" width="52" height="36" class="logo" />
      <span class="divisor" aria-hidden="true" />
      <span class="nome">Fabrica<span class="hub">HUB</span></span>
    </header>

    <main class="principal">
      <div class="colunas" :class="colunas">
        <slot />
      </div>
    </main>

    <footer class="rodape">
      <p>IFC ARAQUARI · FÁBRICA DE SOFTWARE</p>
      <span class="bolinhas" aria-hidden="true">
        <span class="laranja" />
        <span class="turquesa" />
        <span class="vermelha" />
        <span class="azul" />
      </span>
    </footer>
  </div>
</template>

<style scoped>
.auth-layout {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-height: 100dvh;
  background: var(--ink);
  overflow-x: clip;
}

.cabecalho,
.principal,
.rodape {
  position: relative;
  z-index: 1;
}

.cabecalho {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px clamp(16px, 4vw, 32px);
}

.logo {
  width: 52px;
  height: 36px;
  object-fit: contain;
}

.divisor {
  width: 1px;
  height: 24px;
  background: var(--border);
}

.nome {
  font-size: 15px;
  font-weight: 800;
}

.hub {
  color: var(--brand-orange);
}

.principal {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 32px clamp(16px, 5vw, 64px) 56px;
}

.colunas {
  display: grid;
  align-items: center;
  gap: clamp(40px, 7vw, 96px);
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}

.colunas.cracha {
  grid-template-columns: minmax(0, 1fr) minmax(0, 380px);
}

.colunas.gaveta {
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
}

.colunas.centro {
  grid-template-columns: minmax(0, 1fr);
  justify-items: center;
}

.rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px clamp(16px, 4vw, 32px);
  border-top: 1px solid var(--border);
}

.rodape p {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.bolinhas {
  display: flex;
  gap: 5px;
}

.bolinhas span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.bolinhas .laranja { background: var(--brand-orange); }
.bolinhas .turquesa { background: var(--brand-teal); }
.bolinhas .vermelha { background: var(--brand-red); }
.bolinhas .azul { background: var(--brand-blue); }

@media (max-width: 899px) {
  .colunas.cracha,
  .colunas.gaveta {
    grid-template-columns: minmax(0, 1fr);
    justify-items: center;
  }
}
</style>
