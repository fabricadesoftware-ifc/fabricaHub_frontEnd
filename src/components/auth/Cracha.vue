<script setup lang="ts">
import { computed } from 'vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import { logoFabrica } from '@/utils/logo'

const props = withDefaults(
  defineProps<{
    variante?: 'acesso' | 'visitante'
    /** Texto da pílula no canto da faixa (ex.: IFC, 403). */
    selo: string
    rotulo?: string
    /** Linha de leitura passando pelo cartão (ex.: verificando). */
    lendo?: boolean
  }>(),
  { variante: 'acesso', rotulo: '', lendo: false },
)

const tituloFaixa = computed(() => (props.variante === 'acesso' ? 'CRACHÁ DE ACESSO' : 'CRACHÁ DE VISITANTE'))
const corSelo = computed(() => (props.variante === 'acesso' ? 'var(--text)' : 'var(--brand-red)'))
</script>

<template>
  <div class="cracha" :class="variante">
    <div class="cordao" aria-hidden="true">
      <span v-if="variante === 'acesso'" class="cordao-texto">FÁBRICA · IFC ·</span>
      <!-- Cordão de visitante: listras desenhadas em SVG (sem gradiente) -->
      <svg v-else class="cordao-listras" viewBox="0 0 22 90" preserveAspectRatio="none">
        <rect v-for="i in 9" :key="i" x="6" :y="i * 9 - 4" width="10" height="4" rx="1" />
      </svg>
      <span class="presilha" />
    </div>

    <section class="cartao" :aria-label="tituloFaixa">
      <div class="faixa">
        <span class="faixa-titulo">{{ tituloFaixa }}</span>
        <PilulaStatus :status="selo" :cor="corSelo" />
      </div>

      <div class="corpo">
        <div class="topo">
          <span class="icone" aria-hidden="true">
            <slot name="icone">
              <img v-if="logoFabrica" :src="logoFabrica" alt="" width="34" height="24" />
            </slot>
          </span>
          <RotuloSecao :rotulo="rotulo" :tom="variante === 'visitante' ? 'perigo' : 'accent'">
            <template v-if="$slots.rotulo" #rotulo><slot name="rotulo" /></template>
            <slot name="titulo" />
          </RotuloSecao>
          <slot name="selo-topo" />
        </div>
        <slot />
      </div>

      <div v-if="$slots.rodape" class="rodape">
        <slot name="rodape" />
      </div>

      <span v-if="lendo" class="leitura" aria-hidden="true" />
    </section>
  </div>
</template>

<style scoped>
.cracha {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 380px;
}

.cordao {
  position: relative;
  display: flex;
  justify-content: center;
  width: 22px;
  height: 90px;
  border-radius: 2px 2px 0 0;
}

.acesso .cordao {
  background: var(--brand-orange);
}

.visitante .cordao {
  background: #2A2D33; /* cordão de visitante */
}

.cordao-texto {
  padding-top: 8px;
  writing-mode: vertical-rl;
  font-family: var(--font-mono);
  font-size: 8px;
  font-weight: 700;
  letter-spacing: .2em;
  color: var(--text);
}

.cordao-listras {
  width: 100%;
  height: 100%;
}

.cordao-listras rect {
  fill: #5A5F68; /* listras do cordão de visitante */
}

.presilha {
  position: absolute;
  bottom: -10px;
  left: 50%;
  z-index: 2;
  width: 30px;
  height: 20px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #8D929B; /* metal */
  box-shadow: inset 0 -4px 0 #5E636B;
}

.cartao {
  position: relative;
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
  overflow: hidden;
}

.faixa {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px 12px;
}

.acesso .faixa {
  background: var(--brand-orange);
}

.visitante .faixa {
  background: var(--surface-2);
}

.faixa-titulo {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: .16em;
  color: var(--text);
}

.corpo {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 18px 16px;
}

.topo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icone {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--tile);
  color: var(--brand-red);
}

.icone img {
  width: 36px;
  height: 26px;
  object-fit: contain;
}

.rodape {
  padding: 12px 16px;
  border-top: 1px dashed rgba(255, 255, 255, .12);
}

/* Linha de leitura: passa de cima a baixo enquanto verifica */
.leitura {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 2px;
  background: var(--accent);
  opacity: .55;
  animation: ler 1.8s ease-in-out infinite alternate;
}

@keyframes ler {
  to {
    top: calc(100% - 2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .leitura {
    display: none;
  }
}
</style>
