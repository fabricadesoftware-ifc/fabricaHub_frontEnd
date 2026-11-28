<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { resgatarTag } from '@/api/tagsAcesso'
import AuthHero from '@/components/auth/AuthHero.vue'
import Cracha from '@/components/auth/Cracha.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import { useAcessos } from '@/composables/useAcessos'
import { useLogin } from '@/composables/useLogin'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { useAuthStore } from '@/stores/auth'
import { LINK_COORDENACAO } from '@/utils/contato'

const auth = useAuthStore()
const router = useRouter()
const { trocarConta } = useLogin()
const { pedindo, pedidoEnviado, erroPedido, pedirAcesso } = useAcessos()

const codigo = ref('')
const mensagemTag = ref('')
async function usarTag() {
  if (!auth.githubUser || auth.autorizado) return
  try {
    const idUsuario = resgatarTag(codigo.value, auth.githubUser)
    auth.iniciarSessao({ ...auth.githubUser, idUsuario })
    await router.replace({ name: 'dashboard' })
  } catch (e) { mensagemTag.value = e instanceof Error ? e.message : 'Falha ao usar a tag.' }
}

const githubUser = computed(() => auth.githubUser)

function voltar() {
  // Sem página anterior no histórico do app, volta para o login.
  if (window.history.state?.back) router.back()
  else router.push({ name: 'login' })
}
</script>

<template>
  <AuthLayout>
    <AuthHero texto="O FabricaHUB é exclusivo para membros da Fábrica de Software do IFC Araquari." />

    <div class="lado">
      <Cracha variante="visitante" selo="403" rotulo="[403] ACESSO NEGADO">
        <template #icone><IconeSvg nome="permissoes" :tamanho="20" /></template>
        <template #titulo>Sua conta ainda não tem acesso</template>
        <template #selo-topo>
          <div class="carimbo-topo" aria-hidden="true">
            <Carimbo texto="Sem acesso" tipo="recusado" tamanho="pequeno" />
          </div>
        </template>

        <p class="texto">
          Você entrou com o GitHub, mas essa conta não está na lista de membros da Fábrica. Peça acesso e a
          coordenação vai analisar.
        </p>

        <div v-if="githubUser" class="conta">
          <span class="avatar" aria-hidden="true">{{ githubUser.iniciais }}</span>
          <div class="conta-dados">
            <p class="login">@{{ githubUser.login }}</p>
            <p class="via">
              <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                />
              </svg>
              conectado via GitHub
            </p>
          </div>
          <button type="button" class="link" @click="trocarConta">Trocar conta</button>
        </div>

        <form v-if="githubUser && !auth.autorizado" class="resgate" @submit.prevent="usarTag">
          <label>Tag de acesso <input v-model.trim="codigo" placeholder="Código da tag" required /></label>
          <BotaoBase variante="secundario" tipo="submit">Usar tag</BotaoBase>
          <p v-if="mensagemTag" class="erro" role="alert">{{ mensagemTag }}</p>
        </form>
        <div role="status" class="status">
          <p v-if="pedidoEnviado" class="confirmacao">✓ Pedido enviado. Avisaremos quando for aprovado.</p>
          <p v-else-if="erroPedido" class="erro">{{ erroPedido }}</p>
        </div>

        <div v-if="!pedidoEnviado" class="acoes">
          <BotaoBase variante="secundario" @click="voltar">Voltar</BotaoBase>
          <BotaoBase :disabled="pedindo || !githubUser" @click="pedirAcesso">Pedir acesso</BotaoBase>
        </div>
      </Cracha>

      <p class="ajuda">Precisa de ajuda? <a :href="LINK_COORDENACAO">Fale com a coordenação</a></p>
    </div>
  </AuthLayout>
</template>

<style scoped>
.resgate { display:flex; flex-wrap:wrap; align-items:end; gap:10px; }
.resgate label { display:grid; gap:5px; }
.resgate input { padding:10px; color:var(--text); background:var(--ink); border:1px solid var(--border); border-radius:6px; }
.lado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.carimbo-topo {
  position: absolute;
  right: -4px;
  bottom: -6px;
}

.texto {
  font-size: 13px;
  color: var(--text-muted);
}

.conta {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 6px 6px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--tile);
}

.avatar {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: var(--brand-blue);
  font-size: 11px;
  font-weight: 700;
  color: var(--text);
}

.conta-dados {
  flex: 1;
  min-width: 0;
}

.login {
  overflow: hidden;
  font-size: 13px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.via {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: var(--text-subtle);
}

.link {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 8px;
  border: 0;
  background: none;
  color: var(--accent);
  font-size: 12.5px;
  font-weight: 600;
  cursor: pointer;
}

.link:hover {
  text-decoration: underline;
}

.status:empty {
  display: none;
}

.confirmacao {
  padding: 12px 14px;
  border: 1px solid var(--online);
  border-radius: var(--radius-btn);
  background: var(--tile);
  font-size: 13px;
  font-weight: 600;
  color: var(--online);
}

.erro {
  font-size: 13px;
  color: var(--brand-red);
}

.acoes {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
  gap: 10px;
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
</style>
