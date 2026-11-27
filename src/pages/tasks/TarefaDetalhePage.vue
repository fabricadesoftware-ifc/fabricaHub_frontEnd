<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import AcoesTarefa from '@/components/tasks/AcoesTarefa.vue'
import DadosTarefa from '@/components/tasks/DadosTarefa.vue'
import DiscussaoTarefa from '@/components/tasks/DiscussaoTarefa.vue'
import EsqueletoTarefa from '@/components/tasks/EsqueletoTarefa.vue'
import HistoricoTarefa from '@/components/tasks/HistoricoTarefa.vue'
import { useTarefa } from '@/composables/useTarefa'

const rota = useRoute()
const id = computed(() => Number(rota.params.id))

const {
  tarefa,
  projeto,
  comentarios,
  historico,
  carregando,
  erro,
  naoEncontrada,
  carregar,
  usuario,
  comentando,
  erroComentario,
  comentar,
  movendo,
  erroMover,
  destinosPossiveis,
  mover,
} = useTarefa(id)

const totalComentarios = computed(() =>
  comentarios.value.length === 1 ? '1 comentário' : `${comentarios.value.length} comentários`,
)
</script>

<template>
  <EsqueletoTarefa v-if="carregando" />

  <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

  <EstadoVazio
    v-else-if="naoEncontrada || !tarefa"
    titulo="Tarefa não encontrada."
    texto="Ela pode ter sido removida ou o endereço está errado."
  >
    <BotaoBase variante="secundario" :para="{ name: 'tarefas' }">Voltar para Minhas tarefas</BotaoBase>
  </EstadoVazio>

  <div v-else class="ficha">
    <CabecalhoPagina class="surgir" :rotulo="`< FICHA DA TAREFA /> · #${tarefa.id}`" :titulo="tarefa.titulo">
      <template #antes>
        <nav class="trilha" aria-label="Você está em">
          <RouterLink :to="{ name: 'tarefas' }">Minhas tarefas</RouterLink>
          <span aria-hidden="true">/</span>
          <span>{{ projeto?.nome ?? 'Projeto' }}</span>
          <span aria-hidden="true">/</span>
          <span aria-current="page">#{{ tarefa.id }}</span>
        </nav>
      </template>
      <template #depois>
        <div class="etiquetas">
          <PilulaStatus :status="tarefa.status" />
          <PilulaStatus :status="tarefa.prioridade" />
          <PilulaStatus v-for="tag in tarefa.tags" :key="tag" :status="tag" cor="var(--brand-teal)" />
        </div>
      </template>
      <template #acoes>
        <AcoesTarefa
          layout="cabecalho"
          :tarefa="tarefa"
          :destinos="destinosPossiveis"
          :movendo="movendo === tarefa.id"
          @mover="mover"
        />
      </template>
    </CabecalhoPagina>

    <p v-if="erroMover" class="erro-mover" role="alert">{{ erroMover }}</p>

    <div class="colunas">
      <div class="principal">
        <CartaoSecao class="surgir" style="--ordem: 1" rotulo="[01] DESCRIÇÃO">
          <p class="descricao">{{ tarefa.descricao }}</p>
        </CartaoSecao>

        <CartaoSecao class="surgir" style="--ordem: 2" variante="caderno" rotulo="[02] CADERNO" titulo="Discussão" :detalhe="totalComentarios">
          <DiscussaoTarefa
            :comentarios="comentarios"
            :usuario="usuario"
            :comentar="comentar"
            :enviando="comentando"
            :erro="erroComentario"
          />
        </CartaoSecao>
      </div>

      <div class="lateral">
        <CartaoSecao class="surgir" style="--ordem: 2" rotulo="[03] DADOS">
          <DadosTarefa :tarefa="tarefa" :projeto="projeto" :nome-criador="usuario(tarefa.idCriador)?.nome" />
        </CartaoSecao>

        <CartaoSecao class="surgir" style="--ordem: 3" variante="recibo" rotulo="[04] RECIBO" titulo="Histórico">
          <HistoricoTarefa :eventos="historico" :usuario="usuario" />
        </CartaoSecao>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ficha {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.trilha {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--text-subtle);
}

.trilha a {
  color: var(--text-muted);
  text-decoration: none;
}

.trilha a:hover {
  text-decoration: underline;
}

.etiquetas {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.erro-mover {
  padding: 10px 14px;
  border: 1px solid rgba(255, 32, 32, .35);
  border-radius: var(--radius-btn);
  font-size: 13px;
  color: var(--brand-red);
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 320px);
  align-items: start;
  gap: 20px;
}

.principal,
.lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.descricao {
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-muted);
}

@media (max-width: 999px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
