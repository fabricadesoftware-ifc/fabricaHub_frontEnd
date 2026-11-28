<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import { useRevisoes } from '@/composables/useRevisoes'
import { dataHora, diaMes, diasAte, tempoRelativo } from '@/utils/datas'

const rota = useRoute()
const { carregar, carregando, erro, pendentes, aberta, abrir, comentario, revisar, revisando, erroRevisao, ultimaDecisao, revisadasHoje } =
  useRevisoes()

onMounted(async () => {
  await carregar()
  // Atalho "Revisar entrega" do quadro (?tarefa=41)
  const id = Number(rota.query.tarefa)
  if (id && pendentes.value.some((p) => p.tarefa.id === id)) abrir(id)
})

const rotulo = computed(() => `< PRANCHETA DE REVISÃO /> · ${pendentes.value.length} ${pendentes.value.length === 1 ? 'PENDENTE' : 'PENDENTES'}`)

function enviadaEm(iso?: string) {
  if (!iso) return '—'
  const dias = diasAte(iso)
  const hora = dataHora(iso).split(' · ')[1]
  if (dias === 0) return `hoje, ${hora}`
  if (dias === -1) return `ontem, ${hora}`
  return dataHora(iso)
}

/** Link do PR no repositório do projeto (quando os dois existem). */
const prUrl = computed(() => {
  const repo = aberta.value?.projeto.repositorio
  const pr = aberta.value?.tarefa.pr
  return repo && pr ? `${repo}/pull/${pr}` : undefined
})
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" :rotulo="rotulo" titulo="Revisões">
      <template #acoes>
        <span class="placar">HOJE · {{ revisadasHoje }} {{ revisadasHoje === 1 ? 'REVISADA' : 'REVISADAS' }}</span>
      </template>
    </CabecalhoPagina>

    <div v-if="carregando" class="mesa" aria-hidden="true">
      <div class="fila">
        <EsqueletoBloco v-for="i in 3" :key="i" altura="80px" raio="8px" />
      </div>
      <EsqueletoBloco altura="420px" raio="12px" />
    </div>
    <p v-if="carregando" class="sr-only" role="status">Carregando revisões…</p>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio
      v-else-if="!pendentes.length"
      titulo="Nada para revisar."
      texto="Quando alguém mandar uma tarefa para revisão nos seus projetos, ela aparece aqui."
    />

    <div v-else class="mesa surgir" style="--ordem: 1">
      <!-- Fila de entregas -->
      <ul class="fila" aria-label="Entregas aguardando revisão">
        <li v-for="item in pendentes" :key="item.tarefa.id">
          <button
            type="button"
            class="entrega"
            :class="{ ativa: aberta?.tarefa.id === item.tarefa.id }"
            :aria-current="aberta?.tarefa.id === item.tarefa.id ? 'true' : undefined"
            @click="abrir(item.tarefa.id)"
          >
            <span class="entrega-topo">
              <span>#{{ item.tarefa.id }} · {{ item.projeto.nome.toUpperCase() }}</span>
              <span>{{ tempoRelativo(item.tarefa.enviadaEm ?? item.tarefa.criadaEm).toUpperCase() }}</span>
            </span>
            <span class="entrega-titulo">{{ item.tarefa.titulo }}</span>
            <span class="entrega-rodape">
              <span class="pessoa">
                <AvatarPessoa
                  :nome="item.responsavel?.nome ?? '?'"
                  :iniciais="item.responsavel?.iniciais"
                  :cor="item.responsavel?.cor"
                  :foto="item.responsavel?.foto"
                  :tamanho="20"
                  forma="circulo"
                />
                {{ item.responsavel?.nome ?? '—' }}
              </span>
              <span v-if="(item.tarefa.entregas ?? 1) > 1" class="reentrega">{{ item.tarefa.entregas }}ª ENTREGA</span>
            </span>
          </button>
        </li>
      </ul>

      <!-- Prancheta -->
      <section v-if="aberta" class="prancheta" :aria-label="`Revisão de ${aberta.tarefa.titulo}`">
        <span class="prendedor" aria-hidden="true" />
        <div class="folha">
          <header class="folha-topo">
            <span class="folha-rotulo">#{{ aberta.tarefa.id }} · {{ aberta.projeto.nome.toUpperCase() }}</span>
            <RouterLink :to="{ name: 'tarefa', params: { id: aberta.tarefa.id } }" class="abrir">Abrir tarefa completa →</RouterLink>
          </header>
          <h2 class="folha-titulo">{{ aberta.tarefa.titulo }}</h2>
          <p class="folha-meta">
            <span>Responsável: <strong>{{ aberta.responsavel?.nome ?? '—' }}</strong></span>
            <span>Função: <strong>{{ aberta.tarefa.funcao }}</strong></span>
            <span>Enviada para revisão: <strong>{{ enviadaEm(aberta.tarefa.enviadaEm) }}</strong></span>
          </p>

          <div class="dados">
            <component
              :is="prUrl ? 'a' : 'div'"
              class="dado"
              v-bind="prUrl ? { href: prUrl, target: '_blank', rel: 'noopener noreferrer' } : {}"
            >
              <IconeSvg nome="pr" :tamanho="16" />
              <span>
                <span class="dado-valor">{{ aberta.tarefa.pr ? `PR #${aberta.tarefa.pr}` : 'Sem PR' }}</span>
                <span class="dado-sub">{{ aberta.tarefa.branch }}</span>
              </span>
            </component>
            <div class="dado">
              <span>
                <span class="dado-rotulo">Previsão</span>
                <span class="dado-valor">{{ aberta.tarefa.prazo ? diaMes(aberta.tarefa.prazo) : '—' }}</span>
              </span>
            </div>
          </div>

          <figure v-if="aberta.tarefa.notaEntrega" class="nota">
            <figcaption>Nota de {{ aberta.responsavel?.nome ?? 'quem entregou' }}</figcaption>
            <blockquote>{{ aberta.tarefa.notaEntrega }}</blockquote>
          </figure>

          <label class="campo">
            <span class="rotulo">Comentário (obrigatório para devolver)</span>
            <textarea
              v-model="comentario"
              rows="4"
              placeholder="O que ficou bom, ou o que precisa mudar."
              :aria-invalid="!!erroRevisao && !comentario.trim()"
              aria-describedby="erro-revisao"
            />
          </label>

          <p v-if="erroRevisao" id="erro-revisao" class="erro" role="alert">{{ erroRevisao }}</p>

          <div class="decisao">
            <BotaoBase variante="sucesso" :disabled="revisando" @click="revisar('aprovar')">Aprovar e concluir</BotaoBase>
            <BotaoBase variante="perigo" :disabled="revisando" @click="revisar('devolver')">Devolver para ajustes</BotaoBase>
          </div>

          <!-- Carimbo da decisão -->
          <div v-if="ultimaDecisao" class="carimbo-decisao" role="status">
            <Carimbo
              :texto="ultimaDecisao.decisao === 'aprovar' ? 'Aprovado' : 'Devolvido'"
              :tipo="ultimaDecisao.decisao === 'aprovar' ? 'aprovado' : 'devolvido'"
              :assinatura="new Date().toLocaleDateString('pt-BR')"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.placar {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--accent);
}

.mesa {
  display: grid;
  grid-template-columns: minmax(0, 300px) minmax(0, 1fr);
  align-items: start;
  gap: 20px;
}

/* Fila */
.fila {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.entrega {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface);
  text-align: left;
  cursor: pointer;
  transition: border-color var(--dur-media), background-color var(--dur-media);
}

.entrega:hover {
  border-color: rgba(255, 255, 255, .16);
}

.entrega.ativa {
  border-color: rgba(255, 255, 255, .28);
  background: var(--surface-2);
}

.entrega-topo {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

.entrega-titulo {
  font-size: 13.5px;
  font-weight: 600;
  line-height: 1.35;
}

.entrega-rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pessoa {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.pessoa :deep(.circulo) {
  border-color: transparent;
}

.reentrega {
  padding: 1px 6px;
  border: 1px solid rgba(255, 107, 94, .5);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .08em;
  color: #FF6B5E;
}

/* Prancheta: folha presa por um prendedor de metal */
.prancheta {
  position: relative;
  padding-top: 14px;
}

.prendedor {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 1;
  width: 96px;
  height: 28px;
  transform: translateX(-50%);
  border-radius: 6px;
  background: #8D929B; /* metal */
  box-shadow: inset 0 -5px 0 #5E636B;
}

.folha {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px 24px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.folha-topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.folha-rotulo {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--accent);
}

.abrir {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.abrir:hover {
  text-decoration: underline;
}

.folha-titulo {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.25;
}

.folha-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  margin-top: -8px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.folha-meta strong {
  font-weight: 600;
  color: var(--text);
}

.dados {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.dado {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 56px;
  padding: 8px 16px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface-2);
  color: var(--text-muted);
  text-decoration: none;
}

a.dado:hover {
  border-color: rgba(255, 255, 255, .2);
}

.dado > span {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.dado-rotulo {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.dado-valor {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--text);
}

.dado-sub {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nota {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin: 0;
  padding: 12px 16px;
  border-radius: var(--radius-btn);
  background: var(--surface-2);
}

.nota figcaption {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.nota blockquote {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

textarea {
  min-height: 96px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13.5px;
  line-height: 1.5;
  resize: vertical;
  transition: border-color var(--dur-media);
}

textarea:focus-visible {
  border-color: var(--accent);
}

textarea[aria-invalid='true'] {
  border-color: rgba(255, 32, 32, .6);
}

.erro {
  margin-top: -8px;
  font-size: 12.5px;
  color: #FF6B5E;
}

.decisao {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.carimbo-decisao {
  position: absolute;
  right: 32px;
  bottom: 24px;
  pointer-events: none;
}

@media (max-width: 899px) {
  .mesa {
    grid-template-columns: minmax(0, 1fr);
  }

  .folha {
    padding: 28px 16px 16px;
  }
}
</style>
