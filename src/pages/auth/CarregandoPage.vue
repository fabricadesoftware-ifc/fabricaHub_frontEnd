<script setup lang="ts">
import BotaoBase from '@/components/global/BotaoBase.vue'
import ContadorMecanico from '@/components/global/ContadorMecanico.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import { useCarregamentoPainel } from '@/composables/useCarregamentoPainel'
import AuthLayout from '@/layouts/AuthLayout.vue'

const { progresso, etapa, erro, tentarDeNovo } = useCarregamentoPainel()
</script>

<template>
  <AuthLayout :esferas="false" colunas="centro">
    <section class="carregando" aria-labelledby="titulo-carregando">
      <p class="rotulo">&lt; ARRUMANDO A MESA /&gt;</p>

      <div class="mesa" aria-hidden="true">
        <span class="bolinha laranja" />
        <span class="bolinha turquesa" />
        <span class="bolinha vermelha" />
        <span class="bolinha azul" />
      </div>

      <article class="ficha">
        <div class="topo">
          <RotuloSecao :rotulo="erro ? '[!] ERRO' : '[..] CARREGANDO'" :tom="erro ? 'perigo' : 'accent'">
            <span id="titulo-carregando">Preparando seu painel<span class="cursor" aria-hidden="true">_</span></span>
          </RotuloSecao>
          <span class="porcentagem">
            <ContadorMecanico :numero="progresso" :digitos="3" tamanho="pequeno" :animar="false" />
            <span class="sinal" aria-hidden="true">%</span>
          </span>
        </div>

        <div
          class="barra"
          role="progressbar"
          aria-label="Carregando o painel"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="progresso"
        >
          <span class="preenchido" :style="{ width: `${progresso}%` }" />
        </div>

        <div class="rodape" role="status">
          <template v-if="erro">
            <p class="erro">{{ erro }}</p>
            <BotaoBase variante="secundario" @click="tentarDeNovo">Tentar de novo</BotaoBase>
          </template>
          <p v-else class="etapa"><span aria-hidden="true">›</span> {{ etapa }}</p>
        </div>
      </article>
    </section>
  </AuthLayout>
</template>

<style scoped>
.carregando {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  width: 100%;
  max-width: 340px;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--accent);
}

/* Quatro bolinhas da marca pulando sobre a "mesa" (cores chapadas, sem gradiente) */
.mesa {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  height: 76px;
  padding: 0 18px 6px;
  border-bottom: 1px solid var(--border);
}

.bolinha {
  border-radius: 50%;
  animation: pular 1.2s ease-in-out infinite;
}

.laranja {
  width: 30px;
  height: 30px;
  margin-bottom: 30px;
  background: var(--brand-orange);
}

.turquesa {
  width: 23px;
  height: 23px;
  margin-bottom: 20px;
  background: var(--brand-teal);
  animation-delay: .15s;
}

.vermelha {
  width: 18px;
  height: 18px;
  margin-bottom: 10px;
  background: var(--brand-red);
  animation-delay: .3s;
}

.azul {
  width: 14px;
  height: 14px;
  margin-bottom: 4px;
  background: var(--brand-blue);
  animation-delay: .45s;
}

@keyframes pular {
  50% {
    transform: translateY(-12px);
  }
}

.ficha {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: 14px; /* espaço para a aba */
  padding: 16px 18px;
  background: var(--surface);
  border-radius: 0 var(--radius-card) var(--radius-card) var(--radius-card);
  box-shadow: var(--shadow-hard);
}

.ficha::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 92px;
  height: 14px;
  background: inherit;
  border-radius: 6px 6px 0 0;
}

.topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.cursor {
  color: var(--brand-orange);
}

.porcentagem {
  flex-shrink: 0;
  display: inline-flex;
  align-items: flex-end;
  gap: 4px;
}

.sinal {
  font-family: var(--font-mono);
  font-size: 10px;
  color: var(--text-subtle);
}

.barra {
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--surface-2);
  overflow: hidden;
}

.preenchido {
  display: block;
  height: 100%;
  background: var(--brand-orange);
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--border);
}

.etapa {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}

.erro {
  font-size: 13px;
  color: var(--brand-red);
}

@media (prefers-reduced-motion: reduce) {
  .bolinha {
    animation: none;
  }
}
</style>
