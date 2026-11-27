<script setup lang="ts">
import { computed } from 'vue'
import { useLink, type RouteLocationRaw } from 'vue-router'
import IconeSvg, { type NomeIcone } from '@/components/global/IconeSvg.vue'

const props = defineProps<{
  rotulo: string
  icone: NomeIcone
  para: RouteLocationRaw
  contador?: number
  atencao?: boolean
  novidade?: boolean
  /** Definido pelo menu: só o item mais específico para a rota atual fica ativo. */
  ativo?: boolean
}>()

const { href, navigate } = useLink({ to: computed(() => props.para) })

const descricaoContador = computed(() => {
  if (!props.contador) return ''
  return props.atencao ? `, ${props.contador} pendentes` : `, ${props.contador}`
})
</script>

<template>
  <a :href="href" class="item" :class="{ ativo }" :aria-current="ativo ? 'page' : undefined" @click="navigate">
    <IconeSvg :nome="icone" class="icone" />
    <span class="rotulo">{{ rotulo }}<span class="sr-only">{{ descricaoContador }}</span></span>
    <span v-if="contador" class="contador" :class="{ atencao }" aria-hidden="true">{{ contador }}</span>
    <span v-else-if="novidade" class="novidade"><span class="sr-only">, novidades</span></span>
  </a>
</template>

<style scoped>
.item {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 11px 12px;
  border-radius: var(--radius-btn);
  color: #B5B3AC;
  font-size: 14px;
  text-decoration: none;
}

.item:hover {
  background: rgba(255, 255, 255, .04);
  color: var(--text);
}

.icone {
  flex-shrink: 0;
}

.rotulo {
  flex: 1;
  min-width: 0;
}

.contador {
  padding: 1px 7px;
  border-radius: 4px;
  background: var(--surface-2);
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
}

.contador.atencao {
  background: var(--brand-orange);
  color: #fff;
}

.novidade {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-orange);
}

/* Aba ativa encostando no conteúdo */
.ativo,
.ativo:hover {
  background: var(--ink);
  color: var(--text);
  font-weight: 700;
  box-shadow: inset 4px 0 0 var(--brand-orange);
  margin-right: -15px;
  border-radius: 6px 0 0 6px;
}

.ativo .icone {
  color: var(--brand-orange);
}

@media (max-width: 799px) {
  .ativo,
  .ativo:hover {
    margin-right: 0;
    border-radius: 6px;
  }
}
</style>
