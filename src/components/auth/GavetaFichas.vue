<script setup lang="ts">
import PilulaStatus from '@/components/global/PilulaStatus.vue'

// Deslocamento vertical de cada ficha, para parecerem arquivadas à mão.
const fichas = [
  { codigo: 400, desnivel: 14 },
  { codigo: 401, desnivel: 0 },
  { codigo: 402, desnivel: 10 },
  { codigo: 403, desnivel: 4 },
  { codigo: 404, desnivel: 0 },
  { codigo: 405, desnivel: 6 },
  { codigo: 406, desnivel: 12 },
]
</script>

<template>
  <div class="gaveta-fichas" aria-hidden="true">
    <div class="armario">
      <div class="fichas">
        <div
          v-for="ficha in fichas"
          :key="ficha.codigo"
          class="ficha"
          :class="{ vazia: ficha.codigo === 404 }"
          :style="{ marginTop: `${ficha.desnivel}px` }"
        >
          <span class="aba">{{ ficha.codigo }}</span>
          <span v-if="ficha.codigo === 404" class="interrogacao">?</span>
        </div>
      </div>

      <div class="frente">
        <span class="placa">PÁGINAS · 400–406</span>
        <span class="puxador" />
      </div>
    </div>

    <div class="perdida">
      <span class="aba-perdida">404</span>
      <p class="perdida-numero">404</p>
      <p class="perdida-texto">Página não encontrada</p>
      <PilulaStatus status="Achados e perdidos" cor="var(--text)" />
    </div>
  </div>
</template>

<style scoped>
.gaveta-fichas {
  position: relative;
  width: 100%;
  max-width: 440px;
  padding-bottom: 48px;
}

.armario {
  padding: 30px 16px 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
}

.fichas {
  display: flex;
  gap: 8px;
  height: 170px;
}

.ficha {
  position: relative;
  flex: 1;
  min-width: 0;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px 8px 0 0;
}

.aba {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 5px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  color: var(--text-muted);
}

.ficha.vazia {
  background: transparent;
  border: 1.5px dashed var(--accent);
}

.ficha.vazia .aba {
  border: 1.5px dashed var(--accent);
  background: var(--ink);
  color: var(--accent);
}

.interrogacao {
  position: absolute;
  top: 38%;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 26px;
  font-weight: 800;
  color: var(--accent);
  animation: flutuar 2.4s ease-in-out infinite;
}

@keyframes flutuar {
  50% {
    transform: translate(-50%, -8px);
  }
}

.frente {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: -64px -17px 0;
  padding: 20px 16px 22px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.placa {
  padding: 4px 12px;
  border: 1.5px solid #4A4E55;
  border-radius: 4px;
  background: #111215;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .16em;
  color: var(--text-muted);
  white-space: nowrap;
}

.puxador {
  width: 42%;
  height: 9px;
  border-radius: var(--radius-pill);
  background: #8D929B; /* metal */
  box-shadow: inset 0 -3px 0 #5E636B;
}

.perdida {
  position: absolute;
  right: -24px;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 180px;
  padding: 14px 16px 16px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: 0 var(--radius-menu) var(--radius-menu) var(--radius-menu);
  box-shadow: var(--shadow-hard);
  transform: rotate(-8deg);
}

.aba-perdida {
  position: absolute;
  bottom: 100%;
  left: -1px;
  padding: 1px 8px;
  border-radius: 4px 4px 0 0;
  background: var(--brand-orange);
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  color: var(--text);
}

.perdida-numero {
  font-family: var(--font-mono);
  font-size: 40px;
  font-weight: 800;
  line-height: 1;
  color: var(--brand-orange);
}

.perdida-texto {
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--text-muted);
}

@media (max-width: 899px) {
  .perdida {
    right: 0;
  }
}

/* Celular: a gaveta encolhe para caber e a ficha perdida sai. */
@media (max-width: 599px) {
  .gaveta-fichas {
    padding-bottom: 0;
  }

  .armario {
    padding: 26px 10px 0;
  }

  .fichas {
    gap: 4px;
    height: 130px;
  }

  .aba {
    padding: 1px 2px;
    font-size: 8px;
  }

  .frente {
    margin: -52px -11px 0;
  }

  .placa {
    font-size: 9.5px;
    letter-spacing: .1em;
  }

  .perdida {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .interrogacao {
    animation: none;
  }
}
</style>
