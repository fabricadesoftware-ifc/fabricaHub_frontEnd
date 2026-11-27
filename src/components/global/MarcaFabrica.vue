<script setup lang="ts">
import { logoFabrica as logo } from '@/utils/logo'
</script>

<template>
  <div class="marca">
    <RouterLink to="/" class="topo" aria-label="FabricaHUB, ir para o Dashboard">
      <img v-if="logo" :src="logo" alt="" width="72" height="50" class="logo" />
      <span v-else class="logo logo-reserva" aria-hidden="true">FÁBRICA</span>
      <span class="textos">
        <span class="nome">Fabrica<span class="hub">HUB</span></span>
        <span class="local">IFC · ARAQUARI</span>
      </span>
    </RouterLink>
    <div class="divisoria" aria-hidden="true">
      <span class="bolinha laranja" />
      <span class="bolinha turquesa" />
      <span class="bolinha vermelha" />
      <span class="bolinha azul" />
      <span class="traco" />
    </div>
  </div>
</template>

<style scoped>
.marca {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.topo {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text);
  text-decoration: none;
}

.logo {
  flex-shrink: 0;
  width: 72px;
  height: 50px;
  object-fit: contain;
}

.logo-reserva {
  display: grid;
  place-items: center;
  background: #fff;
  border-radius: 6px;
  color: #000;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .04em;
}

.textos {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.nome {
  font-size: 19px;
  font-weight: 800;
  line-height: 1.2;
}

.hub {
  color: var(--brand-orange);
}

.local {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.divisoria {
  display: flex;
  align-items: center;
  gap: 5px;
}

.bolinha {
  flex-shrink: 0;
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.laranja { background: var(--brand-orange); }
.turquesa { background: var(--brand-teal); }
.vermelha { background: var(--brand-red); }
.azul { background: var(--brand-blue); }

.traco {
  flex: 1;
  height: 1px;
  margin-left: 4px;
  background: var(--border);
}
</style>
