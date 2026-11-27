<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { useRole } from '@/composables/useRole'
import { podeAcessar } from '@/utils/permissoes'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Papel } from '@/utils/tipos'

// Só em desenvolvimento (App.vue não carrega este componente em produção).
type Opcao = Papel | 'nao-autorizado'

const auth = useAuthStore()
const projetos = useProjetosStore()
const { entrar, garantirCarregado, simularPapel, simularNaoAutorizado } = useAuth()
const { papel } = useRole()
const rota = useRoute()
const router = useRouter()
const trocando = ref(false)

const opcoes: { valor: Opcao; rotulo: string }[] = [
  { valor: 'membro', rotulo: 'Membro' },
  { valor: 'lider', rotulo: 'Líder' },
  { valor: 'admin', rotulo: 'Admin' },
  { valor: 'nao-autorizado', rotulo: 'Não autorizado' },
]

const ativo = computed<Opcao | null>(() => {
  if (auth.naoAutorizadoSimulado) return 'nao-autorizado'
  return auth.usuario ? papel.value : auth.papelSimulado
})

async function trocar(novo: Opcao) {
  if (novo === ativo.value || trocando.value) return
  trocando.value = true
  try {
    // Fora do login, só guarda a preferência para o próximo "Entrar com GitHub".
    if (novo === 'nao-autorizado') {
      simularNaoAutorizado(true)
      if (auth.logado) {
        await entrar()
        await router.replace({ name: 'acesso-negado' })
      }
      return
    }

    const estavaSemAcesso = auth.naoAutorizadoSimulado
    simularNaoAutorizado(false)
    if (auth.logado && estavaSemAcesso) await entrar()
    await garantirCarregado()
    await simularPapel(novo)
    if (!auth.logado) return

    if (estavaSemAcesso && rota.name === 'acesso-negado') {
      await router.replace({ name: 'dashboard' })
    } else if (!rota.meta.publica && !podeAcessar(rota, auth.usuario, projetos.lista)) {
      // O guard não roda de novo na mesma rota: confere a permissão aqui.
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
        :class="[`papel-${opcao.valor}`, { ativa: ativo === opcao.valor }]"
        :aria-pressed="ativo === opcao.valor"
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
  max-width: calc(100vw - 32px);
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
  flex-wrap: wrap;
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

.papel-membro { --cor: var(--papel-membro); --cor-texto: var(--sidebar); }
.papel-lider { --cor: var(--papel-lider); --cor-texto: var(--text); }
.papel-admin { --cor: var(--papel-admin); --cor-texto: var(--text); }

.opcao.ativa {
  background: var(--cor);
  border-color: var(--cor);
  color: var(--cor-texto);
}

/* Vermelho com texto branco não tem contraste: só borda e texto. */
.papel-nao-autorizado.ativa {
  background: transparent;
  border-color: var(--brand-red);
  color: var(--brand-red);
}
</style>
