<script setup lang="ts">
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import FolhaCalendario from '@/components/news/FolhaCalendario.vue'
import { COR_CATEGORIA, minutosDeLeitura } from '@/utils/noticias'
import type { Noticia } from '@/utils/tipos'

/** Linha da lista "Últimas": folhinha com a data, categoria, título, linha fina e tempo de leitura. */
defineProps<{ noticia: Noticia }>()
</script>

<template>
  <article class="linha-noticia">
    <FolhaCalendario :data="noticia.data" />
    <div class="textos">
      <PilulaStatus :status="noticia.categoria" :cor="COR_CATEGORIA[noticia.categoria]" class="categoria" />
      <h3 class="titulo">
        <RouterLink :to="{ name: 'noticia', params: { id: noticia.id } }" class="esticado">{{ noticia.titulo }}</RouterLink>
      </h3>
      <p class="resumo">{{ noticia.resumo }}</p>
    </div>
    <span class="leitura">{{ minutosDeLeitura(noticia) }} MIN</span>
  </article>
</template>

<style scoped>
.linha-noticia {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px 0;
}

.textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}

.categoria {
  padding: 1px 8px;
  border-radius: 4px;
  font-size: 9.5px;
}

.titulo {
  font-size: 15px;
  font-weight: 600;
  line-height: 1.35;
}

.titulo a {
  color: var(--text);
  text-decoration: none;
}

/* A linha inteira abre a notícia */
.esticado::after {
  content: '';
  position: absolute;
  inset: 0;
}

.linha-noticia:hover .titulo a {
  text-decoration: underline;
}

.esticado:focus-visible {
  outline: none;
}

.linha-noticia:has(.esticado:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-btn);
}

.resumo {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
}

.leitura {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}
</style>
