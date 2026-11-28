<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { FUNCOES, PRIORIDADES, TAMANHOS, useNovaTarefa } from '@/composables/useNovaTarefa'
import { diaMes } from '@/utils/datas'

const rota = useRoute()
const router = useRouter()
const idProjeto = computed(() => (rota.query.projeto ? Number(rota.query.projeto) : null))
const { carregar, carregando, projeto, form, membros, responsavel, numero, erros, tentouEnviar, enviando, erro, criar, marcarBranchEditada } =
  useNovaTarefa(idProjeto)

onMounted(carregar)

const responsavelTexto = computed({
  get: () => (form.idResponsavel === null ? '' : String(form.idResponsavel)),
  set: (valor: string) => (form.idResponsavel = valor ? Number(valor) : null),
})

const voltarPara = computed(() => (projeto.value ? { name: 'projeto-tarefas', params: { id: projeto.value.id } } : { name: 'dashboard' }))

async function enviar() {
  const nova = await criar()
  if (nova) router.push({ name: 'projeto-tarefas', params: { id: nova.idProjeto } })
}
</script>

<template>
  <div class="pagina">
    <TrilhaNavegacao class="surgir" :itens="[{ texto: 'Tarefas do projeto', para: voltarPara }, { texto: 'Nova tarefa' }]" />

    <CabecalhoPagina
      class="surgir"
      style="--ordem: 1"
      :rotulo="`< NOVA FICHA /> · ${projeto?.nome.toUpperCase() ?? ''}`"
      titulo="Nova "
      destaque="tarefa"
    />

    <div v-if="carregando" class="colunas" aria-hidden="true">
      <EsqueletoBloco altura="520px" raio="12px" />
      <EsqueletoBloco altura="220px" raio="8px" />
    </div>

    <EstadoVazio v-else-if="!projeto" titulo="Você não lidera nenhum projeto." texto="Só o líder do projeto cria tarefas." />

    <div v-else class="colunas">
      <form class="formulario surgir" style="--ordem: 2" novalidate @submit.prevent="enviar">
        <section class="bloco">
          <RotuloSecao rotulo="[01] O QUE FAZER" />
          <label class="campo">
            <span class="rotulo">Título *</span>
            <input
              v-model="form.titulo"
              placeholder="Ex.: Tela de turmas no celular"
              :aria-invalid="tentouEnviar && !!erros.titulo"
              aria-describedby="erro-titulo"
              required
            />
            <span v-if="tentouEnviar && erros.titulo" id="erro-titulo" class="erro-campo">{{ erros.titulo }}</span>
          </label>
          <label class="campo">
            <span class="rotulo">Descrição</span>
            <textarea v-model="form.descricao" rows="4" placeholder="O que precisa ficar pronto e como conferir." />
          </label>
          <label class="campo">
            <span class="rotulo">Branch</span>
            <input v-model="form.branch" class="mono" aria-describedby="dica-branch" @input="marcarBranchEditada" />
            <span id="dica-branch" class="dica">Sugerida a partir do título. Pode editar.</span>
          </label>
        </section>

        <section class="bloco">
          <RotuloSecao rotulo="[02] QUEM E QUANDO" />
          <div class="trio">
            <div class="campo">
              <CampoSelect v-model="responsavelTexto" label="Responsável *" disposicao="cima" :opcoes="membros" vazio="Escolha um membro" />
              <span v-if="tentouEnviar && erros.responsavel" class="erro-campo" role="alert">{{ erros.responsavel }}</span>
            </div>
            <CampoSelect v-model="form.funcao" label="Função" disposicao="cima" :opcoes="FUNCOES" />
            <label class="campo">
              <span class="rotulo">Previsão</span>
              <input v-model="form.prazo" type="date" />
            </label>
          </div>
          <div class="dupla">
            <div class="campo">
              <span id="rotulo-prioridade" class="rotulo">Prioridade</span>
              <GrupoPilulas
                v-model="form.prioridade"
                variante="segmentado"
                label="Prioridade"
                :opcoes="PRIORIDADES.map((p) => ({ valor: p, rotulo: p }))"
              />
            </div>
            <div class="campo">
              <span class="rotulo">Tamanho</span>
              <GrupoPilulas v-model="form.tamanho" variante="segmentado" label="Tamanho" :opcoes="TAMANHOS.map((t) => ({ valor: t, rotulo: t }))" />
            </div>
          </div>
        </section>

        <p v-if="erro" class="erro" role="alert">{{ erro }}</p>

        <footer class="rodape">
          <BotaoBase variante="secundario" :para="voltarPara">Cancelar</BotaoBase>
          <BotaoBase tipo="submit" :disabled="enviando">{{ enviando ? 'Criando…' : 'Criar tarefa' }}</BotaoBase>
        </footer>
      </form>

      <!-- Prévia em tempo real: a ficha como vai aparecer no quadro -->
      <aside class="previa surgir" style="--ordem: 3" aria-label="Prévia no quadro">
        <p class="previa-rotulo">PRÉVIA NO QUADRO</p>
        <div class="ficha">
          <span class="fita" aria-hidden="true" />
          <p class="ficha-topo">
            <span>#{{ numero }} · A FAZER</span>
            <span>{{ form.prioridade.toUpperCase() }}</span>
          </p>
          <p class="ficha-titulo" :class="{ vazio: !form.titulo.trim() }">{{ form.titulo.trim() || 'Título da tarefa' }}</p>
          <p class="ficha-branch">{{ form.branch }}</p>
          <dl class="ficha-dados">
            <div>
              <dt>Responsável</dt>
              <dd>{{ responsavel?.nome ?? '—' }}</dd>
            </div>
            <div>
              <dt>Função</dt>
              <dd>{{ form.funcao }}</dd>
            </div>
            <div>
              <dt>Previsão</dt>
              <dd>{{ form.prazo ? diaMes(form.prazo) : '—' }}</dd>
            </div>
            <div>
              <dt>Tamanho</dt>
              <dd>{{ form.tamanho }}</dd>
            </div>
          </dl>
        </div>
        <p class="previa-nota">
          A tarefa entra em "A fazer". O responsável move até "Em revisão" e você aprova ou devolve em Revisões.
        </p>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
  align-items: start;
  gap: 24px;
}

/* Formulário */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 20px 24px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.bloco {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

input,
textarea {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13.5px;
  transition: border-color var(--dur-media);
}

textarea {
  min-height: 96px;
  padding: 12px;
  line-height: 1.5;
  resize: vertical;
}

input:focus-visible,
textarea:focus-visible {
  border-color: var(--accent);
}

input[aria-invalid='true'] {
  border-color: rgba(255, 32, 32, .6);
}

input::placeholder,
textarea::placeholder {
  color: var(--text-subtle);
}

.mono {
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.dica {
  font-size: 12px;
  color: var(--text-subtle);
}

.erro-campo {
  font-size: 12px;
  color: #FF6B5E;
}

.trio {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
}

.dupla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.erro {
  font-size: 13px;
  color: var(--brand-red);
}

.rodape {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

/* Prévia: ficha de papel presa com fita */
.previa {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.previa-rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  color: var(--accent);
}

.ficha {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px 16px 16px;
  border-radius: 4px;
  background: var(--papel-ficha);
  color: var(--tinta);
  box-shadow: var(--shadow-hard);
  transform: rotate(1deg);
}

.fita {
  position: absolute;
  top: -8px;
  left: 50%;
  width: 64px;
  height: 16px;
  transform: translateX(-50%) rotate(-3deg);
  background: var(--cortica);
  opacity: .85;
}

.ficha-topo {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--tinta-suave);
}

.ficha-titulo {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.ficha-titulo.vazio {
  color: var(--tinta-suave);
}

.ficha-branch {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--tinta-suave);
  overflow-wrap: anywhere;
}

.ficha-dados {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 12px;
  margin: 8px 0 0;
  padding-top: 12px;
  border-top: 1px dashed rgba(43, 38, 32, .25);
}

.ficha-dados dt {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--tinta-suave);
}

.ficha-dados dd {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.previa-nota {
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
}

@media (max-width: 899px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }

  .previa {
    position: static;
  }
}
</style>
