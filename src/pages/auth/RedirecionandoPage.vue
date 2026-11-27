<script setup lang="ts">
import AuthHero from '@/components/auth/AuthHero.vue'
import Cracha from '@/components/auth/Cracha.vue'
import { useRedirecionamento, type EstadoEtapa } from '@/composables/useRedirecionamento'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { LINK_COORDENACAO } from '@/utils/contato'

const { etapas, progresso, mensagemStatus, concluir } = useRedirecionamento()

const simbolos: Record<EstadoEtapa, string> = { concluida: '✓', atual: '›', pendente: '·' }
const descricoes: Record<EstadoEtapa, string> = { concluida: 'concluída', atual: 'em andamento', pendente: 'pendente' }
</script>

<template>
  <AuthLayout>
    <AuthHero texto="Estamos conferindo seu crachá. Isso leva só alguns segundos." />

    <div class="lado">
      <Cracha selo="IFC" lendo>
        <template #rotulo><span class="spinner" aria-hidden="true">◌</span>[...] VERIFICANDO</template>
        <template #titulo>Redirecionando<span class="reticencias">…</span></template>

        <p class="texto">Estamos confirmando sua conta no GitHub. Você será levado ao seu painel em seguida.</p>

        <ol class="etapas">
          <li v-for="etapa in etapas" :key="etapa.rotulo" class="etapa" :class="etapa.estado">
            <span class="marca" aria-hidden="true">{{ simbolos[etapa.estado] }}</span>
            {{ etapa.rotulo }}
            <span class="sr-only">({{ descricoes[etapa.estado] }})</span>
          </li>
        </ol>

        <div class="barra" aria-hidden="true">
          <span class="preenchido" :style="{ width: `${progresso}%` }" />
        </div>

        <p class="sr-only" role="status">{{ mensagemStatus }}</p>

        <template #rodape>
          <p class="rodape-texto">
            Não foi redirecionado? <button type="button" class="link" @click="concluir">Clique aqui</button>
          </p>
        </template>
      </Cracha>

      <p class="ajuda">Precisa de ajuda? <a :href="LINK_COORDENACAO">Fale com a coordenação</a></p>
    </div>
  </AuthLayout>
</template>

<style scoped>
.lado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.spinner {
  display: inline-block;
  font-size: 13px;
  animation: girar 1s linear infinite;
}

@keyframes girar {
  to {
    transform: rotate(360deg);
  }
}

.reticencias {
  color: var(--brand-orange);
}

.texto {
  font-size: 13px;
  color: var(--text-muted);
}

.etapas {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 12px 14px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--tile);
  list-style: none;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
}

.etapa {
  display: flex;
  align-items: center;
  gap: 8px;
}

.marca {
  width: 10px;
  text-align: center;
}

.concluida {
  color: var(--text);
}

.concluida .marca {
  color: var(--online);
}

.atual {
  color: var(--accent);
}

.pendente {
  color: var(--text-subtle);
}

.barra {
  height: 4px;
  border-radius: var(--radius-pill);
  background: var(--surface-2);
  overflow: hidden;
}

.preenchido {
  display: block;
  height: 100%;
  background: var(--brand-orange);
  transition: width .5s ease;
}

.rodape-texto {
  font-size: 12px;
  text-align: center;
  color: var(--text-muted);
}

.link {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 2px;
  border: 0;
  background: none;
  color: var(--accent);
  font-weight: 600;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.ajuda {
  font-size: 12.5px;
  color: var(--text-muted);
  text-align: center;
}

.ajuda a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.ajuda a:hover {
  text-decoration: underline;
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
  }

  .preenchido {
    transition: none;
  }
}
</style>
