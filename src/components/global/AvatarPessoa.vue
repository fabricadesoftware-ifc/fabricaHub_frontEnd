<script setup lang="ts">
import { computed } from 'vue'
import { corTextoSobre } from '@/utils/cores'

const props = withDefaults(
  defineProps<{
    nome: string
    cor?: string
    tamanho?: number
    /** `circulo` (pilhas de equipe) ou `quadrado` (mensagens, comentários). */
    forma?: 'quadrado' | 'circulo'
    /** Sem `iniciais`, usa as duas primeiras letras do nome. */
    iniciais?: string
    /** Foto (URL ou data URL); quando existe, substitui as iniciais. */
    foto?: string | null
  }>(),
  { cor: '#2A2AFF', tamanho: 28, forma: 'quadrado', iniciais: '', foto: null },
)

const textoIniciais = computed(() => (props.iniciais || props.nome.slice(0, 2)).toUpperCase())
</script>

<template>
  <span
    class="avatar"
    :class="forma"
    aria-hidden="true"
    :style="{
      width: `${tamanho}px`,
      height: `${tamanho}px`,
      fontSize: `${Math.round(tamanho * 0.38)}px`,
      background: cor,
      color: corTextoSobre(cor),
    }"
  >
    <img v-if="foto" :src="foto" alt="" class="foto" />
    <template v-else>{{ textoIniciais }}</template>
  </span>
</template>

<style scoped>
.avatar {
  flex-shrink: 0;
  display: inline-grid;
  place-items: center;
  font-weight: 700;
  line-height: 1;
}

.quadrado {
  border-radius: 8px;
}

.avatar {
  overflow: hidden;
}

.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.circulo {
  border-radius: 50%;
  border: 2px solid var(--surface);
}
</style>
