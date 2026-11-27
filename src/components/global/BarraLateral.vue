<script setup lang="ts">
import Cracha from '@/components/global/Cracha.vue'
import ItemMenu from '@/components/global/ItemMenu.vue'
import MarcaFabrica from '@/components/global/MarcaFabrica.vue'
import PastaProjeto from '@/components/global/PastaProjeto.vue'
import PortaEtiqueta from '@/components/global/PortaEtiqueta.vue'
import { useMenuLateral } from '@/composables/useMenuLateral'
import { useRole } from '@/composables/useRole'
import { useLogin } from '@/composables/useLogin'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { trocarConta } = useLogin()
const { papel } = useRole()
const { secoes, pastas } = useMenuLateral()
</script>

<template>
  <aside class="barra-lateral">
    <MarcaFabrica />

    <nav class="navegacao" aria-label="Menu principal">
      <section v-for="(secao, i) in secoes" :key="secao.etiqueta" class="secao" :aria-labelledby="`secao-${i}`">
        <PortaEtiqueta :id="`secao-${i}`" :texto="secao.etiqueta" />
        <ul class="itens">
          <li v-for="item in secao.itens" :key="item.rotulo">
            <ItemMenu v-bind="item" />
          </li>
        </ul>
      </section>

      <section v-if="pastas.length" class="secao" aria-labelledby="secao-projetos">
        <PortaEtiqueta id="secao-projetos" :texto="`0${secoes.length + 1} · MEUS PROJETOS`" />
        <ul class="pastas">
          <li v-for="pasta in pastas" :key="pasta.id">
            <PastaProjeto v-bind="pasta" />
          </li>
        </ul>
      </section>
    </nav>

    <Cracha
      v-if="auth.usuario"
      class="cracha"
      :nome="auth.usuario.nome"
      :funcao="auth.usuario.funcao"
      :online="auth.usuario.online"
      :papel="papel"
      @sair="trocarConta"
    />
  </aside>
</template>

<style scoped>
.barra-lateral {
  display: flex;
  flex-direction: column;
  gap: 22px;
  padding: 20px 14px;
  background: var(--sidebar);
  border-right: 1px solid var(--border);
}

.navegacao {
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.secao {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.itens,
.pastas {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.itens {
  gap: 2px;
}

.pastas {
  gap: 10px;
}

.cracha {
  margin-top: auto;
}

@media (max-width: 799px) {
  .barra-lateral {
    border-right: 0;
    border-bottom: 1px solid var(--border);
  }
}
</style>
