<script setup lang="ts">
import BotaoBase from '@/components/global/BotaoBase.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'

withDefaults(defineProps<{ mensagem: string; compacto?: boolean }>(), { compacto: false })
defineEmits<{ tentarDeNovo: [] }>()
</script>

<template>
  <div class="estado-erro" :class="{ compacto }" role="alert">
    <IconeSvg nome="alerta" :tamanho="compacto ? 18 : 22" class="icone" />
    <p class="mensagem">{{ mensagem }}</p>
    <BotaoBase variante="secundario" @click="$emit('tentarDeNovo')">Tentar de novo</BotaoBase>
  </div>
</template>

<style scoped>
.estado-erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 16px;
  border: 1px solid rgba(255, 32, 32, .35);
  border-radius: var(--radius-btn);
  background: var(--surface);
  text-align: center;
}

.compacto {
  padding: 16px 12px;
}

.icone {
  color: var(--brand-red);
}

.mensagem {
  font-size: 14px;
  color: var(--text-muted);
}

.estado-erro {
  animation: surgir var(--dur-lenta) var(--ease-saida) backwards;
}
</style>
