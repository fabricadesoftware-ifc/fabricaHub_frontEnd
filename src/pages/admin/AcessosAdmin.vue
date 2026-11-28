<script setup lang="ts">
import { computed, ref } from 'vue'
import { pedidosAcesso, decidirPedido } from '@/api/acesso'
import { usuarios } from '@/api/usuarios'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import { papelPrincipal, papeisDoUsuario } from '@/utils/permissoes'
const aba = ref('Pendentes')
const aviso = ref('')
const auth = useAuthStore()
const projetos = useProjetosStore()
const pendentes = computed(() => pedidosAcesso.value.filter((p) => p.pendente))
const contas = ref(usuarios.filter((u) => u.ativo))
function decidir(id: number, aprovar: boolean) {
  if (!auth.usuario?.isSuper) return
  try {
    decidirPedido(id, aprovar, auth.usuario.nome)
  } catch (e) {
    aviso.value = e instanceof Error ? e.message : 'Falha ao analisar pedido.'
    return
  }
  contas.value = usuarios.filter((u) => u.ativo)
  aviso.value = aprovar ? 'Acesso autorizado.' : 'Pedido recusado.'
}
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; CONTROLE DE ENTRADA /&gt;</small>
        <h1>Acessos<span>_</span></h1>
      </div>
    </header>
    <nav class="abas" aria-label="Situação do acesso">
      <button
        v-for="a in ['Pendentes', 'Contas autorizadas']"
        :key="a"
        :aria-pressed="aba === a"
        @click="aba = a"
      >
        {{ a }} <b>{{ a === 'Pendentes' ? pendentes.length : contas.length }}</b>
      </button>
    </nav>
    <section class="painel-sis">
      <h2>{{ aba === 'Pendentes' ? 'Pedidos de acesso' : aba }}</h2>
      <template v-if="aba === 'Pendentes'"
        ><article v-for="p in pendentes" :key="p.id" class="solicitacao">
          <div>
            <small>REQUERIMENTO Nº {{ String(p.id).padStart(4, '0') }}</small>
            <h3>{{ p.nome }}</h3>
            <p>@{{ p.loginGitHub }} · {{ p.tag }}</p>
          </div>
          <div class="acoes-sis">
            <button class="principal" @click="decidir(p.id, true)">Autorizar</button
            ><button @click="decidir(p.id, false)">Recusar</button>
          </div>
        </article>
        <p v-if="!pendentes.length">Nenhum pedido pendente.</p></template
      >
      <div v-else class="rolar">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>GitHub</th>
              <th>Papel</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in contas" :key="u.id">
              <td>{{ u.nomeCompleto }}</td>
              <td>@{{ u.usuario }}</td>
              <td>{{ papelPrincipal(papeisDoUsuario(u, projetos.lista)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <p role="status">{{ aviso }}</p>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
