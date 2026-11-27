<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import RotuloSecao from '@/components/global/RotuloSecao.vue'

withDefaults(
  defineProps<{
    rotulo: string
    titulo?: string
    /** Link no canto (ex.: "Ver todos →"). */
    link?: { para: RouteLocationRaw; texto: string }
    /** Texto à direita quando não há link (ex.: "23 – 27 NOV"). */
    detalhe?: string
    /**
     * Visual do cartão: `caderno` (espiral), `recibo` (borda picotada),
     * `mural` (cortiça), `aberto` (sem fundo, só o título).
     */
    variante?: 'padrao' | 'caderno' | 'recibo' | 'mural' | 'aberto'
  }>(),
  { titulo: '', link: undefined, detalhe: '', variante: 'padrao' },
)
</script>

<template>
  <section class="cartao-secao" :class="variante">
    <div v-if="variante === 'caderno'" class="espiral" aria-hidden="true">
      <span v-for="i in 24" :key="i" class="furo" />
    </div>

    <header class="cabecalho">
      <RotuloSecao :rotulo="rotulo" :titulo="titulo" class="titulo-secao" />
      <slot v-if="$slots.acao" name="acao" />
      <RouterLink v-else-if="link" :to="link.para" class="link">{{ link.texto }}</RouterLink>
      <span v-else-if="detalhe" class="detalhe">{{ detalhe }}</span>
    </header>

    <div class="corpo">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.cartao-secao {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.cabecalho {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 18px 12px;
}

.titulo-secao {
  min-width: 0;
}

.link {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  min-height: 32px;
  font-size: 12px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.detalhe {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

.corpo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 18px 18px;
}

/* Caderno: fileira de furos da espiral no topo */
.caderno {
  overflow: hidden;
}

.espiral {
  display: flex;
  justify-content: space-between;
  padding: 8px 14px;
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
}

.furo {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--ink);
  box-shadow: inset 0 2px 0 #000;
}

.caderno .cabecalho {
  border-bottom: 1px solid var(--border);
  margin-bottom: 4px;
}

/* Recibo: borda superior picotada */
.recibo {
  border-top: 2px dashed rgba(255, 255, 255, .18);
  border-radius: 4px 4px var(--radius-menu) var(--radius-menu);
}

/* Mural: cortiça com a etiqueta do título num quadro escuro */
.mural {
  background: var(--cortica);
  border-color: rgba(0, 0, 0, .4);
}

.mural .cabecalho {
  margin: 14px 14px 4px;
  padding: 10px 12px;
  background: var(--surface);
  border-radius: var(--radius-btn);
  box-shadow: var(--shadow-hard);
}

.mural .corpo {
  padding: 10px 14px 16px;
}

/* Aberto: sem fundo, para grades de cartões (ex.: Meus projetos) */
.aberto {
  background: transparent;
  border: 0;
  box-shadow: none;
}

.aberto .cabecalho {
  padding: 0 0 12px;
}

.aberto .corpo {
  padding: 0;
}

@media (max-width: 599px) {
  .espiral .furo:nth-child(n + 13) {
    display: none;
  }
}

.link {
  transition: transform var(--dur-media) var(--ease-saida);
}

.link:hover {
  transform: translateX(3px);
}
</style>
