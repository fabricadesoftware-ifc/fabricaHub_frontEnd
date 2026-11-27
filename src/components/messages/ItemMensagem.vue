<script setup lang="ts">
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import { horaOuData } from '@/utils/datas'
import type { Mensagem, Usuario } from '@/utils/tipos'

/** `contexto`: título da tarefa ou nome do projeto. */
defineProps<{ mensagem: Mensagem; remetente?: Usuario; contexto: string }>()
</script>

<template>
  <li class="mensagem" :class="{ nova: !mensagem.lida }">
    <AvatarPessoa :nome="remetente?.nome ?? '?'" :iniciais="remetente?.iniciais" :foto="remetente?.foto" :cor="remetente?.cor" :tamanho="28" />
    <div class="conteudo">
      <p class="topo">
        <span class="quem">
          <strong>{{ remetente?.nome ?? 'Alguém' }}</strong>
          <span class="contexto"> · {{ contexto }}</span>
        </span>
        <span class="tempo">{{ horaOuData(mensagem.em) }}</span>
      </p>
      <p class="texto">{{ mensagem.texto }}</p>
      <span v-if="!mensagem.lida" class="sr-only">(não lida)</span>
    </div>
  </li>
</template>

<style scoped>
.mensagem {
  display: flex;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-btn);
  background: var(--surface-2);
}

.nova .tempo::before {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 6px;
  border-radius: 50%;
  background: var(--brand-orange);
  vertical-align: middle;
}

.conteudo {
  flex: 1;
  min-width: 0;
}

.topo {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 12.5px;
}

.quem {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.contexto {
  color: var(--text-subtle);
}

.tempo {
  flex-shrink: 0;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.texto {
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 12.5px;
  color: var(--text-muted);
}

.mensagem:not(.nova) .texto {
  color: var(--text-subtle);
}

.mensagem {
  transition: background-color var(--dur-media), transform var(--dur-media) var(--ease-saida);
}

.mensagem:hover {
  background: #262930;
  transform: translateX(2px);
}
</style>
