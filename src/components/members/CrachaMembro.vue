<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import { NOME_PAPEL } from '@/utils/pessoas'
import type { PapelComunidade } from '@/utils/tipos'

/**
 * Crachá de pessoa da comunidade. A cor da faixa segue o papel:
 * líder laranja, membro turquesa, orientador azul.
 * Slot padrão: conteúdo extra abaixo do curso. Slot `rodape`: troca o rodapé padrão (papel + status).
 */
withDefaults(
  defineProps<{
    nome: string
    usuario: string
    curso: string
    papel: PapelComunidade
    cor: string
    iniciais?: string
    foto?: string | null
    ativo?: boolean
    online?: boolean
    /** Com `para`, o crachá inteiro vira link. */
    para?: RouteLocationRaw
    tamanho?: 'normal' | 'grande'
    /** Nível do título (h1 na página do membro, h3 numa lista). */
    nivel?: 'h1' | 'h2' | 'h3'
  }>(),
  { iniciais: '', foto: null, ativo: true, online: false, para: undefined, tamanho: 'normal', nivel: 'h3' },
)
</script>

<template>
  <article class="cracha-membro" :class="[`papel-${papel}`, tamanho, { link: para }]">
    <span class="presilha" aria-hidden="true" />
    <div class="faixa" aria-hidden="true" />
    <div class="corpo">
      <span class="avatar">
        <AvatarPessoa :nome="nome" :cor="cor" :iniciais="iniciais" :foto="foto" :tamanho="tamanho === 'grande' ? 72 : 40" />
        <span v-if="online" class="online"><span class="sr-only">online</span></span>
      </span>
      <component :is="nivel" class="nome">
        <RouterLink v-if="para" :to="para" class="esticado">{{ nome }}</RouterLink>
        <template v-else>{{ nome }}</template>
      </component>
      <p class="usuario">@{{ usuario }}</p>
      <p class="curso">{{ curso }}</p>
      <slot />
    </div>
    <div class="rodape">
      <slot name="rodape">
        <span class="papel">{{ NOME_PAPEL[papel] }}</span>
        <span class="status" :class="{ inativo: !ativo }">{{ ativo ? 'ATIVO' : 'INATIVO' }}</span>
      </slot>
    </div>
  </article>
</template>

<style scoped>
.cracha-membro {
  position: relative;
  display: flex;
  flex-direction: column;
  padding-top: 8px; /* metade da presilha fica acima */
}

.papel-membro { --cor-papel: var(--papel-membro); --cor-papel-claro: var(--papel-membro-claro); }
.papel-lider { --cor-papel: var(--papel-lider); --cor-papel-claro: var(--papel-lider-claro); }
.papel-orientador { --cor-papel: var(--papel-orientador); --cor-papel-claro: var(--papel-orientador-claro); }

.presilha {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  width: 26px;
  height: 14px;
  transform: translateX(-50%);
  border-radius: 3px;
  background: #8D929B; /* metal */
  box-shadow: inset 0 -3px 0 #5E636B;
}

.faixa {
  height: 10px;
  border-radius: var(--radius-menu) var(--radius-menu) 0 0;
  background: var(--cor-papel);
}

.corpo {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  padding: 18px 14px 14px;
  background: var(--surface);
  text-align: center;
}

.avatar {
  position: relative;
  margin-bottom: 8px;
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

.nome {
  font-size: 14px;
  font-weight: 700;
  line-height: 1.3;
}

.nome a {
  color: var(--text);
  text-decoration: none;
}

/* Link esticado: o crachá inteiro é clicável */
.esticado::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: var(--radius-menu);
}

.esticado:focus-visible {
  outline: none;
}

.link:has(.esticado:focus-visible) {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-menu);
}

.usuario {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.curso {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--cor-papel-claro);
}

.rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 36px;
  padding: 6px 14px;
  background: var(--surface);
  border-top: 1px dashed rgba(255, 255, 255, .12);
  border-radius: 0 0 var(--radius-menu) var(--radius-menu);
  box-shadow: var(--shadow-hard);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
}

.papel {
  color: var(--cor-papel-claro);
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-muted);
}

.status::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--online);
}

.status.inativo::before {
  background: var(--text-subtle);
}

/* Grande: perfil e prévia */
.grande .corpo {
  gap: 4px;
  padding: 26px 22px 22px;
}

.grande .nome {
  font-size: 22px;
}

.grande .usuario {
  font-size: 12.5px;
}

.grande .curso {
  font-size: 14px;
}

.grande .rodape {
  min-height: 44px;
  font-size: 11px;
}

.grande .rodape {
  justify-content: center;
}

/* Hover só quando é link */
.link {
  transition: transform var(--dur-media) var(--ease-saida);
}

.link:hover {
  transform: translateY(-2px);
}

.link:hover .rodape {
  box-shadow: var(--sombra-elevada);
}
</style>
