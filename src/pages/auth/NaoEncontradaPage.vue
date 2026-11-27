<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import GavetaFichas from '@/components/auth/GavetaFichas.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { LINK_COORDENACAO } from '@/utils/contato'

const auth = useAuthStore()
const router = useRouter()

const login = computed(() => auth.githubUser?.login ?? 'visitante')

function voltar() {
  if (window.history.state?.back) router.back()
  else router.push({ name: 'dashboard' })
}
</script>

<template>
  <AuthLayout :esferas="false" colunas="gaveta">
    <section class="conteudo">
      <RotuloSecao rotulo="[404] FICHA NÃO ENCONTRADA" nivel="h1" tamanho="grande">
        Essa ficha não está na <span class="destaque">gaveta_</span>
      </RotuloSecao>

      <p class="descricao">
        A página que você procurou foi movida, renomeada ou nunca existiu. Confira o endereço ou volte para um lugar
        conhecido.
      </p>

      <div class="terminal">
        <p>
          <span class="prompt">{{ login }}@fabrica:~$</span> find /hub -name
          <span class="string">"essa-pagina"</span>
        </p>
        <p class="saida">› 0 resultados em 6 gavetas</p>
        <p><span class="prompt">{{ login }}@fabrica:~$</span> <span class="cursor" aria-hidden="true">_</span></p>
      </div>

      <div class="acoes">
        <BotaoBase variante="secundario" @click="voltar">← Voltar</BotaoBase>
        <BotaoBase :para="{ name: 'dashboard' }">Ir para o dashboard</BotaoBase>
      </div>

      <p class="ajuda">Acha que isso é um erro? <a :href="LINK_COORDENACAO">Avise a coordenação</a></p>
    </section>

    <GavetaFichas />
  </AuthLayout>
</template>

<style scoped>
.conteudo {
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  max-width: 520px;
}

.destaque {
  color: var(--brand-orange);
}

.descricao {
  font-size: 14px;
  color: var(--text-muted);
}

.terminal {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text);
  overflow-wrap: anywhere;
}

.prompt {
  color: var(--online);
}

.string {
  color: var(--accent);
}

.saida {
  color: var(--text-subtle);
}

.cursor {
  color: var(--brand-orange);
  font-weight: 700;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.ajuda {
  font-size: 12.5px;
  color: var(--text-muted);
}

.ajuda a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.ajuda a:hover {
  text-decoration: underline;
}
</style>
