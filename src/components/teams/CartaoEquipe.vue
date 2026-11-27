<script setup lang="ts">
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import type { Equipe, Usuario } from '@/utils/tipos'

/** Cartão "preso" no mural (com alfinete). */
defineProps<{ equipe: Equipe; membros: Usuario[] }>()
</script>

<template>
  <article class="cartao-equipe">
    <span class="alfinete" aria-hidden="true" />
    <div class="avatares" aria-hidden="true">
      <AvatarPessoa v-for="membro in membros.slice(0, 3)" :key="membro.id" :nome="membro.nome" :cor="membro.cor" :tamanho="26" forma="circulo" />
    </div>
    <h3 class="nome">
      <RouterLink :to="{ name: 'equipe', params: { id: equipe.id } }">{{ equipe.nome }}</RouterLink>
    </h3>
    <p class="info">{{ equipe.idsMembros.length }} membros · {{ equipe.idsProjetos.length }} projetos</p>
  </article>
</template>

<style scoped>
.cartao-equipe {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 14px 14px;
  background: var(--surface);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.alfinete {
  position: absolute;
  top: -5px;
  right: 14px;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--brand-orange);
  box-shadow: 0 2px 0 #000;
}

.avatares {
  display: flex;
}

.avatares > :not(:first-child) {
  margin-left: -8px;
}

.nome {
  font-size: 14px;
  font-weight: 700;
}

.nome a {
  color: var(--text);
  text-decoration: none;
}

.nome a:hover {
  text-decoration: underline;
}

.info {
  font-size: 12px;
  color: var(--text-muted);
}

/* Hover: sobe um pouco e a sombra dura cresce */
.cartao-equipe {
  transition: transform var(--dur-media) var(--ease-saida), box-shadow var(--dur-media) var(--ease-saida),
    border-color var(--dur-media);
}

.cartao-equipe:hover {
  transform: translateY(-2px);
  box-shadow: var(--sombra-elevada);
}
</style>
