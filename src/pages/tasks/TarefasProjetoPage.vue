<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import CartaoTarefaLider from '@/components/tasks/CartaoTarefaLider.vue'
import ColunaQuadro from '@/components/tasks/ColunaQuadro.vue'
import { useMoverTarefa } from '@/composables/useMoverTarefa'
import { useQuadroProjeto } from '@/composables/useQuadroProjeto'
import type { StatusTarefa, Tarefa } from '@/utils/tipos'

const rota = useRoute()
const idProjeto = computed(() => Number(rota.params.id))
const {
  carregar,
  carregando,
  erro,
  projeto,
  projetosLiderados,
  responsaveis,
  responsavel,
  busca,
  colunas,
  temTarefas,
  temResultado,
  temFiltro,
  limparFiltros,
  usuario,
} = useQuadroProjeto(idProjeto)
const { movendo, erroMover, destinos, mover } = useMoverTarefa()

onMounted(carregar)

const aviso = ref('')
const rotulo = computed(() => {
  const n = projetosLiderados.value.length
  return `< PRODUÇÃO /> · VOCÊ É LÍDER EM ${n} ${n === 1 ? 'PROJETO' : 'PROJETOS'}`
})

async function moverTarefa(tarefa: Tarefa, para: StatusTarefa) {
  const atualizada = await mover(tarefa, para)
  if (atualizada) aviso.value = `"${atualizada.titulo}" foi para ${para}.`
}
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Tarefas do " destaque="projeto">
      <template #acoes>
        <BotaoBase :para="{ name: 'tarefa-nova', query: { projeto: idProjeto } }">
          <IconeSvg nome="mais" :tamanho="16" /> Nova tarefa
        </BotaoBase>
      </template>
    </CabecalhoPagina>

    <div class="barra surgir" style="--ordem: 1">
      <nav class="projetos" aria-label="Projetos que você lidera">
        <RouterLink
          v-for="p in projetosLiderados"
          :key="p.id"
          :to="{ name: 'projeto-tarefas', params: { id: p.id } }"
          class="projeto"
          :class="{ ativo: p.id === idProjeto }"
          :aria-current="p.id === idProjeto ? 'page' : undefined"
        >
          <span class="ponto" :style="{ background: p.cor }" aria-hidden="true" />
          {{ p.nome }}
        </RouterLink>
      </nav>

      <div v-if="responsaveis.length" class="responsaveis" role="group" aria-labelledby="rotulo-responsavel">
        <span id="rotulo-responsavel" class="rotulo">Responsável</span>
        <button
          type="button"
          class="filtro-pessoa todos"
          :class="{ ativo: responsavel === null }"
          :aria-pressed="responsavel === null"
          @click="responsavel = null"
        >
          Todos
        </button>
        <button
          v-for="pessoa in responsaveis"
          :key="pessoa.id"
          type="button"
          class="filtro-pessoa"
          :class="{ ativo: responsavel === pessoa.id }"
          :aria-pressed="responsavel === pessoa.id"
          :aria-label="`Só as tarefas de ${pessoa.nome}`"
          :title="pessoa.nome"
          @click="responsavel = responsavel === pessoa.id ? null : pessoa.id"
        >
          <AvatarPessoa :nome="pessoa.nome" :iniciais="pessoa.iniciais" :cor="pessoa.cor" :foto="pessoa.foto" :tamanho="28" />
        </button>
      </div>

      <CampoBusca v-model="busca" class="busca" placeholder="Buscar tarefa..." label="Buscar tarefa" />
    </div>

    <p v-if="erroMover" class="erro-mover" role="alert">{{ erroMover }}</p>
    <p class="sr-only" role="status">{{ aviso }}</p>

    <div v-if="carregando" class="quadro" aria-hidden="true">
      <div v-for="i in 4" :key="i" class="coluna-esqueleto">
        <EsqueletoBloco largura="90px" altura="20px" raio="4px" />
        <EsqueletoBloco v-for="j in 2" :key="j" altura="150px" raio="8px" />
      </div>
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando o quadro…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="!projeto" titulo="Projeto não encontrado." />

    <EstadoVazio v-else-if="!temTarefas" titulo="Nenhuma tarefa neste projeto ainda." texto="Crie a primeira e escolha quem vai fazer.">
      <BotaoBase :para="{ name: 'tarefa-nova', query: { projeto: idProjeto } }" class="acao-vazio">Nova tarefa</BotaoBase>
    </EstadoVazio>

    <EstadoVazio v-else-if="!temResultado" titulo="Nenhuma tarefa encontrada." texto="Tente outra pessoa ou outra busca.">
      <BotaoBase v-if="temFiltro" variante="secundario" class="acao-vazio" @click="limparFiltros">Limpar filtros</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <div class="quadro">
        <ColunaQuadro
          v-for="(coluna, i) in colunas"
          :key="coluna.status"
          class="surgir"
          :style="{ '--ordem': i + 2 }"
          :titulo="coluna.titulo"
          :status="coluna.status"
          :quantidade="coluna.tarefas.length"
        >
          <TransitionGroup name="cartao" tag="div" class="lista-cartoes">
            <CartaoTarefaLider
              v-for="tarefa in coluna.tarefas"
              :key="tarefa.id"
              :tarefa="tarefa"
              :responsavel="usuario(tarefa.idResponsavel)"
              :destinos="destinos(tarefa)"
              :movendo="movendo === tarefa.id"
              @mover="moverTarefa(tarefa, $event)"
            />
          </TransitionGroup>
        </ColunaQuadro>
      </div>
      <p class="regra">
        <IconeSvg nome="info" :tamanho="14" />
        Como líder, você move qualquer tarefa do projeto. Passar de "Em revisão" para "Concluída" conta como aprovação.
      </p>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.barra {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 20px;
}

/* Projetos liderados: segmentado com o ponto na cor do projeto */
.projetos {
  display: flex;
  gap: 4px;
  padding: 4px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
}

.projeto {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  transition: background-color var(--dur-media), color var(--dur-media);
}

.projeto:hover {
  color: var(--text);
}

.projeto.ativo {
  border-color: var(--border);
  background: var(--surface-2);
  color: var(--text);
}

.ponto {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.responsaveis {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.rotulo {
  margin-right: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.filtro-pessoa {
  display: grid;
  place-items: center;
  min-width: 36px;
  height: 36px;
  padding: 2px;
  border: 1px solid transparent;
  border-radius: var(--radius-btn);
  background: transparent;
  cursor: pointer;
  opacity: .6;
  transition: opacity var(--dur-media), border-color var(--dur-media);
}

.filtro-pessoa:hover {
  opacity: 1;
}

.filtro-pessoa.ativo {
  border-color: rgba(255, 255, 255, .5);
  opacity: 1;
}

.filtro-pessoa.todos {
  padding: 0 10px;
  border-color: rgba(255, 255, 255, .12);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--text);
}

.filtro-pessoa.todos.ativo {
  border-color: var(--text);
  background: var(--text);
  color: var(--ink);
}

.busca {
  flex: 1 1 220px;
  max-width: 320px;
  margin-left: auto;
}

.erro-mover {
  padding: 10px 14px;
  border: 1px solid rgba(255, 32, 32, .35);
  border-radius: var(--radius-btn);
  font-size: 13px;
  color: var(--brand-red);
}

.quadro {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  align-items: start;
  gap: 16px;
}

.lista-cartoes {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.coluna-esqueleto {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  background: var(--surface);
}

.regra {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.acao-vazio {
  margin-top: 8px;
}
</style>
