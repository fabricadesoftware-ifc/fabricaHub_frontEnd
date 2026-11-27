<script setup lang="ts">
defineProps<{ texto: string }>()
</script>

<template>
  <section class="hero">
    <p class="rotulo">&lt; FÁBRICA DE SOFTWARE /&gt;</p>
    <h1 class="titulo">Fabrica<span class="hub">HUB</span><span class="hub cursor" aria-hidden="true">_</span></h1>
    <p class="subtitulo">Projetos, equipes e tarefas em <span class="destaque">um só lugar.</span></p>
    <p class="texto">{{ texto }}</p>
    <slot />
  </section>
</template>

<style scoped>
.hero {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 520px;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--accent);
}

.titulo {
  font-family: var(--font-mono);
  font-size: clamp(44px, 7vw, 68px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -.02em;
}

.hub {
  color: var(--brand-orange);
}

.subtitulo {
  font-size: clamp(17px, 2.2vw, 20px);
  font-weight: 600;
  line-height: 1.35;
}

.destaque {
  color: var(--brand-orange);
}

.texto {
  max-width: 440px;
  font-size: 14px;
  color: var(--text-muted);
}

@media (max-width: 599px) {
  .titulo {
    font-size: 40px;
  }
}
</style>
