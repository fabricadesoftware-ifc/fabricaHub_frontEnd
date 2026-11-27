<script setup lang="ts">
import { computed } from 'vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import type { Papel } from '@/utils/tipos'

const props = defineProps<{
  nome: string
  funcao: string
  matricula: number
  papel: Papel
  online?: boolean
}>()

defineEmits<{ sair: [] }>()

const nomesPapel: Record<Papel, string> = { membro: 'MEMBRO', lider: 'LÍDER', admin: 'ADMIN' }

const inicial = computed(() => props.nome.charAt(0).toUpperCase())
const numero = computed(() => String(props.matricula).padStart(3, '0'))
</script>

<template>
  <section class="cracha" :class="`papel-${papel}`" aria-label="Crachá do usuário">
    <span class="presilha" aria-hidden="true" />
    <div class="cartao">
      <div class="faixa" aria-hidden="true"><span class="furo" /></div>
      <div class="corpo">
        <span class="avatar" aria-hidden="true">
          {{ inicial }}
          <span v-if="online" class="online" />
        </span>
        <div class="dados">
          <p class="nome">{{ nome }}</p>
          <p class="funcao">{{ funcao }}<template v-if="online"> · online</template></p>
        </div>
      </div>
      <div class="rodape">
        <p class="registro">{{ nomesPapel[papel] }} · Nº {{ numero }}</p>
        <div class="acoes">
          <button type="button" class="botao-icone" aria-label="Sair" @click="$emit('sair')">
            <IconeSvg nome="sair" :tamanho="16" />
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cracha {
  position: relative;
  padding-top: 12px; /* metade da presilha fica acima do cartão */
}

.papel-membro { --cor-papel: var(--papel-membro); --cor-papel-claro: var(--papel-membro-claro); }
.papel-lider { --cor-papel: var(--papel-lider); --cor-papel-claro: var(--papel-lider-claro); }
.papel-admin { --cor-papel: var(--papel-admin); --cor-papel-claro: var(--papel-admin-claro); }

.presilha {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  width: 30px;
  height: 20px;
  transform: translateX(-50%);
  border-radius: 4px;
  background: #8D929B;
  box-shadow: inset 0 -4px 0 #5E636B;
}

.cartao {
  background: var(--surface);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
  overflow: hidden;
}

.faixa {
  display: grid;
  place-items: center;
  height: 18px;
  background: var(--cor-papel);
}

.furo {
  width: 32px;
  height: 6px;
  border-radius: 3px;
  background: var(--sidebar);
}

.corpo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 12px;
}

.avatar {
  position: relative;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: var(--brand-teal);
  color: #08090A;
  font-size: 17px;
  font-weight: 700;
}

.online {
  position: absolute;
  right: -3px;
  bottom: -3px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--online);
  border: 2px solid var(--surface);
}

.dados {
  min-width: 0;
}

.nome {
  font-size: 15px;
  font-weight: 700;
  line-height: 1.3;
}

.funcao {
  font-size: 12px;
  color: var(--text-muted);
}

.rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 6px 0 14px;
  border-top: 1px dashed rgba(255, 255, 255, .12);
}

.registro {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--cor-papel-claro);
  white-space: nowrap;
}

.acoes {
  display: flex;
}

.botao-icone {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  padding: 0;
  border: 0;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.botao-icone:hover {
  background: rgba(255, 255, 255, .06);
  color: var(--text);
}
</style>
