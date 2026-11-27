<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRole } from '@/composables/useRole'
import { podeAcessar } from '@/services/permissoes'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Papel } from '@/utils/tipos'

// Só em desenvolvimento (App.vue não carrega este componente em produção).
const auth = useAuthStore()
const projetos = useProjetosStore()
const { papel } = useRole()
const rota = useRoute()
const router = useRouter()
const trocando = ref(false)

const opcoes: { valor: Papel; rotulo: string }[] = [
  { valor: 'membro', rotulo: 'Membro' },
  { valor: 'lider', rotulo: 'Líder' },
  { valor: 'admin', rotulo: 'Admin' },
]

async function trocar(novo: Papel) {
  if (novo === papel.value || trocando.value) return
  trocando.value = true
  try {
    await auth.garantirCarregado()
    await auth.simularPapel(novo)
    // O guard não roda de novo na mesma rota: confere a permissão aqui.
    if (!rota.meta.publica && !podeAcessar(rota, auth.usuario, projetos.lista)) {
      await router.replace({ name: 'acesso-negado' })
    }
  } finally {
    trocando.value = false
  }
}
</script>

<template>
  <div class="seletor" role="group" aria-labelledby="seletor-titulo">
    <span id="seletor-titulo" class="titulo">DEV · PAPEL</span>
    <div class="opcoes">
      <button
        v-for="opcao in opcoes"
        :key="opcao.valor"
        type="button"
        class="opcao"
        :class="[`papel-${opcao.valor}`, { ativa: papel === opcao.valor }]"
        :aria-pressed="papel === opcao.valor"
        :disabled="trocando"
        @click="trocar(opcao.valor)"
      >
        {{ opcao.rotulo }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.seletor {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 8px;
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.titulo {
  padding-left: 4px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.opcoes {
  display: flex;
  gap: 4px;
}

.opcao {
  min-width: 44px;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.opcao:hover {
  color: var(--text);
}

.papel-membro { --cor: var(--papel-membro); --cor-texto: #08090A; }
.papel-lider { --cor: var(--papel-lider); --cor-texto: #fff; }
.papel-admin { --cor: var(--papel-admin); --cor-texto: #fff; }

.opcao.ativa {
  background: var(--cor);
  border-color: var(--cor);
  color: var(--cor-texto);
}
</style>
