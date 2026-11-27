<script setup lang="ts">
import EtiquetaCor from '@/components/global/EtiquetaCor.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import type { Projeto } from '@/utils/tipos'

/** Pasta de projeto (papel pardo) do dashboard. */
defineProps<{ projeto: Projeto; funcao: string; minhasAbertas: number }>()
</script>

<template>
  <article class="cartao-projeto">
    <EtiquetaCor class="aba" :texto="`■ ${projeto.sigla}`" :cor="projeto.cor" />
    <h3 class="nome">
      <RouterLink :to="{ name: 'projeto', params: { id: projeto.id } }">{{ projeto.nome }}</RouterLink>
    </h3>
    <PilulaStatus :status="projeto.status" class="status" />
    <p class="funcao">Você: {{ funcao }}</p>
    <ul class="tecnologias" aria-label="Tecnologias">
      <li v-for="tecnologia in projeto.tecnologias.slice(0, 2)" :key="tecnologia">{{ tecnologia }}</li>
    </ul>
    <p class="rodape">
      <span>{{ projeto.membros.length }} membros</span>
      <span class="suas">{{ minhasAbertas }} {{ minhasAbertas === 1 ? 'sua tarefa' : 'suas tarefas' }}</span>
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
  background: var(--surface-pasta);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: 0 var(--radius-btn) var(--radius-btn) var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.aba {
  position: absolute;
  left: -1px;
  bottom: 100%;
}

.nome {
  font-size: 15px;
  font-weight: 700;
}

.nome a {
  color: var(--text);
  text-decoration: none;
}

.nome a:hover {
  text-decoration: underline;
}

.funcao {
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
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  margin-top: 4px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, .06);
  font-size: 12px;
  color: var(--text-muted);
}

.suas {
  font-weight: 600;
  color: var(--accent);
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
