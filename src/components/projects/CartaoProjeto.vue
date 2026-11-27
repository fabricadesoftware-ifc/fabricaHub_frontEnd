<script setup lang="ts">
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import type { Projeto } from '@/utils/tipos'

/**
 * Pasta de projeto (dashboard, arquivo de projetos, perfil do membro).
 * Slot padrão: linhas extras abaixo do resumo. Slot `rodape`: linha de baixo
 * (use `class="realce"` no trecho em laranja, ex.: "Você: Front-end").
 */
withDefaults(
  defineProps<{
    projeto: Projeto
    /** Fundo de papel pardo (arquivo de projetos e perfil). */
    pardo?: boolean
    mostrarStatus?: boolean
    mostrarResumo?: boolean
    /** Quantas tecnologias mostrar (0 esconde). */
    limiteTecnologias?: number
    nivel?: 'h2' | 'h3'
  }>(),
  { pardo: false, mostrarStatus: true, mostrarResumo: false, limiteTecnologias: 2, nivel: 'h3' },
)
</script>

<template>
  <article class="cartao-projeto" :class="{ pardo }">
    <span class="aba"><span class="quadrado" :style="{ color: projeto.cor }" aria-hidden="true">■</span> {{ projeto.sigla }}</span>
    <div class="topo">
      <component :is="nivel" class="nome">
        <RouterLink :to="{ name: 'projeto', params: { id: projeto.id } }">{{ projeto.nome }}</RouterLink>
      </component>
      <PilulaStatus v-if="mostrarStatus" :status="projeto.status" class="status" />
    </div>
    <p v-if="mostrarResumo" class="resumo">{{ projeto.resumo }}</p>
    <slot />
    <ul v-if="limiteTecnologias > 0" class="tecnologias" aria-label="Tecnologias">
      <li v-for="tecnologia in projeto.tecnologias.slice(0, limiteTecnologias)" :key="tecnologia">{{ tecnologia }}</li>
    </ul>
    <p v-if="$slots.rodape" class="rodape">
      <slot name="rodape" />
    </p>
  </article>
</template>

<style scoped>
.cartao-projeto {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 15px;
  padding: 14px 16px;
  background: var(--surface-2);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.pardo,
.pardo .aba {
  background: var(--surface-pasta);
}

.aba {
  position: absolute;
  left: -1px;
  bottom: 100%;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 15px;
  padding: 0 7px;
  border-radius: 4px 4px 0 0;
  background: var(--surface-2);
  color: var(--text);
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  white-space: nowrap;
}

.topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 6px 10px;
  width: 100%;
}

.nome {
  min-width: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}

.nome a {
  color: var(--text);
  text-decoration: none;
}

.nome a:hover {
  text-decoration: underline;
}

/* Link esticado: a capa inteira abre o projeto */
.nome a::after {
  content: '';
  position: absolute;
  inset: -16px -1px -1px; /* inclui a aba */
  z-index: 1;
  border-radius: inherit;
}

.nome a:focus-visible {
  outline: none;
}

.cartao-projeto:has(.nome a:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.cartao-projeto {
  cursor: pointer;
}

.resumo {
  font-size: 12.5px;
  line-height: 1.45;
  color: var(--text-muted);
}

:slotted(.funcao) {
  font-size: 12px;
  color: var(--text-muted);
}

.tecnologias {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tecnologias li {
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--ink);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, .06);
  font-size: 12px;
  color: var(--text-muted);
}

:slotted(.realce) {
  font-weight: 600;
  color: var(--accent);
}

:slotted(strong) {
  color: var(--text);
}

/* Hover: sobe um pouco e a sombra dura cresce */
.cartao-projeto {
  transition: transform var(--dur-media) var(--ease-saida), box-shadow var(--dur-media) var(--ease-saida),
    border-color var(--dur-media);
}

.cartao-projeto:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-elevada);
}
</style>
