<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Ex.: "< MINHA MESA /> · QUA 25 NOV". */
    rotulo: string
    titulo: string
    /** Parte final do título, em laranja. */
    destaque?: string
  }>(),
  { destaque: '' },
)
</script>

<template>
  <header class="cabecalho-pagina">
    <div v-if="$slots.icone" class="icone">
      <slot name="icone" />
    </div>
    <div class="textos">
      <slot name="antes" />
      <p class="rotulo">{{ rotulo }}</p>
      <h1 class="titulo">
        {{ titulo }}<span v-if="destaque" class="destaque">{{ destaque }}</span>
      </h1>
      <slot name="depois" />
    </div>
    <div v-if="$slots.acoes" class="acoes">
      <slot name="acoes" />
    </div>
  </header>
</template>

<style scoped>
.cabecalho-pagina {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.icone {
  flex-shrink: 0;
  align-self: center;
}

.textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.titulo {
  font-size: clamp(24px, 3.2vw, 30px);
  font-weight: 700;
  line-height: 1.2;
}

.destaque {
  color: var(--brand-orange);
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}
</style>
