<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { useNoticiaDetalhe } from '@/composables/useNoticiaDetalhe'
import { dataCompleta, dataMinuscula, diaMes } from '@/utils/datas'

/** Coordenação (Peraza) recebe as dúvidas sobre as notícias. */
const ID_COORDENACAO = 3

const rota = useRoute()
const id = computed(() => Number(rota.params.id))
const { carregar, carregando, erro, naoEncontrada, noticia, minutos, outras, agenda } = useNoticiaDetalhe(id)

onMounted(carregar)

/** O quadro "quando / onde / quem" entra depois do primeiro parágrafo do corpo. */
const blocosAntes = computed(() => noticia.value?.blocos.slice(0, 1) ?? [])
const blocosDepois = computed(() => noticia.value?.blocos.slice(1) ?? [])
const iniciaisAutor = computed(() =>
  (noticia.value?.autor ?? '')
    .split(' ')
    .filter((p) => p.length > 2)
    .map((p) => p[0])
    .slice(0, 2)
    .join(''),
)

const avisoCopia = ref('')

async function copiarLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    avisoCopia.value = 'Link copiado.'
  } catch {
    avisoCopia.value = 'Não foi possível copiar. Copie o endereço da barra do navegador.'
  }
}
</script>

<template>
  <div class="pagina">
    <template v-if="carregando">
      <div class="leitura" aria-hidden="true">
        <div class="artigo carregando-artigo">
          <EsqueletoBloco largura="200px" altura="11px" />
          <EsqueletoBloco largura="85%" altura="34px" />
          <EsqueletoBloco largura="260px" altura="24px" />
          <EsqueletoBloco altura="14px" />
          <EsqueletoBloco largura="90%" altura="14px" />
          <EsqueletoBloco altura="72px" raio="8px" />
          <EsqueletoBloco largura="80%" altura="14px" />
        </div>
        <div class="lateral">
          <EsqueletoBloco altura="200px" raio="12px" />
          <EsqueletoBloco altura="150px" raio="12px" />
        </div>
      </div>
      <p class="sr-only" role="status">Carregando a notícia…</p>
    </template>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="naoEncontrada || !noticia" titulo="Notícia não encontrada." texto="Ela pode ter sido retirada do jornal.">
      <BotaoBase variante="secundario" :para="{ name: 'noticias' }">Voltar para Notícias</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao class="surgir" :itens="[{ texto: 'Notícias', para: { name: 'noticias' } }, { texto: noticia.categoria }]" />

      <div class="leitura">
        <article class="artigo surgir" style="--ordem: 1">
          <header class="cabecalho">
            <div class="linha-topo">
              <RotuloSecao :rotulo="`${noticia.categoria} · JORNAL DA FÁBRICA`" />
              <span class="tempo">{{ minutos }} MIN DE LEITURA</span>
            </div>
            <h1 class="titulo">{{ noticia.titulo }}</h1>
            <p class="autoria">
              <AvatarPessoa :nome="noticia.autor" :iniciais="iniciaisAutor" cor="#2A2AFF" :tamanho="28" forma="circulo" />
              <strong>{{ noticia.autor }}</strong>
              <span>· publicado em {{ dataCompleta(noticia.data) }}</span>
            </p>
          </header>

          <p class="lide">{{ noticia.lide }}</p>

          <template v-for="(bloco, i) in blocosAntes" :key="`a${i}`">
            <h2 v-if="bloco.tipo === 'intertitulo'" class="intertitulo">{{ bloco.texto }}</h2>
            <p v-else class="paragrafo">{{ bloco.texto }}</p>
          </template>

          <dl v-if="noticia.evento" class="ficha-evento">
            <div>
              <dt>Quando</dt>
              <dd>{{ diaMes(noticia.evento.data) }} · {{ noticia.evento.hora }}</dd>
            </div>
            <div>
              <dt>Onde</dt>
              <dd>{{ noticia.evento.local }}</dd>
            </div>
            <div>
              <dt>Quem apresenta</dt>
              <dd>{{ noticia.evento.quem }}</dd>
            </div>
          </dl>

          <template v-for="(bloco, i) in blocosDepois" :key="`d${i}`">
            <h2 v-if="bloco.tipo === 'intertitulo'" class="intertitulo">{{ bloco.texto }}</h2>
            <p v-else class="paragrafo">{{ bloco.texto }}</p>
          </template>

          <footer class="rodape">
            <BotaoBase variante="secundario" @click="copiarLink">Copiar link</BotaoBase>
            <RouterLink :to="{ name: 'mensagens', query: { para: ID_COORDENACAO } }" class="perguntar">Perguntar à coordenação →</RouterLink>
            <p class="aviso-copia" role="status">{{ avisoCopia }}</p>
          </footer>
        </article>

        <aside class="lateral" aria-label="Mais do jornal">
          <CartaoSecao class="surgir" style="--ordem: 2" rotulo="[01] OUTRAS NOTÍCIAS">
            <ul v-if="outras.length" class="outras">
              <li v-for="outra in outras" :key="outra.id">
                <span class="outra-data">{{ dataMinuscula(outra.data) }}</span>
                <RouterLink :to="{ name: 'noticia', params: { id: outra.id } }" class="outra-titulo">{{ outra.titulo }}</RouterLink>
              </li>
            </ul>
            <p v-else class="vazio-lateral">Nenhuma outra notícia.</p>
          </CartaoSecao>

          <section class="agenda surgir" style="--ordem: 3" aria-labelledby="titulo-proximos">
            <RotuloSecao rotulo="[02] PRÓXIMOS NA AGENDA"><span id="titulo-proximos" class="sr-only">Próximos na agenda</span></RotuloSecao>
            <ul v-if="agenda.length" class="proximos">
              <li v-for="evento in agenda" :key="evento.id">
                <span class="proximo-data">{{ diaMes(evento.data) }}</span>
                <span class="proximo-textos">
                  <span class="proximo-titulo">{{ evento.titulo }}</span>
                  <span class="proximo-meta">{{ [evento.hora, evento.local].filter(Boolean).join(' · ') }}</span>
                </span>
              </li>
            </ul>
            <p v-else class="vazio-lateral">Nenhum evento marcado.</p>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.leitura {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
  align-items: start;
  gap: 20px;
}

.lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

/* Artigo */
.artigo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 28px 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.carregando-artigo :deep(.esqueleto) {
  max-width: 100%;
}

.cabecalho {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.linha-topo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.tempo {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--text-subtle);
}

.titulo {
  max-width: 24ch;
  font-size: clamp(26px, 3.4vw, 36px);
  font-weight: 700;
  line-height: 1.15;
}

.autoria {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  font-size: 12.5px;
  color: var(--text-muted);
}

.autoria strong {
  font-weight: 600;
  color: var(--text);
}

.autoria :deep(.circulo) {
  border-color: transparent;
}

.lide {
  max-width: 68ch;
  font-size: 17px;
  font-weight: 500;
  line-height: 1.6;
}

.paragrafo {
  max-width: 68ch;
  font-size: 14.5px;
  line-height: 1.7;
  color: var(--text-muted);
}

.intertitulo {
  margin-top: 8px;
  font-size: 18px;
  font-weight: 600;
}

.ficha-evento {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  margin: 4px 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--surface-2);
}

.ficha-evento div {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
}

.ficha-evento div + div {
  border-left: 1px solid var(--border);
}

.ficha-evento dt {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.ficha-evento dd {
  margin: 0;
  font-size: 13.5px;
  font-weight: 600;
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 24px;
  margin-top: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.perguntar {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  text-decoration: none;
}

.perguntar:hover {
  text-decoration: underline;
}

.aviso-copia {
  font-size: 12.5px;
  color: var(--text-muted);
}

.aviso-copia:empty {
  display: none;
}

/* Lateral */
.outras,
.proximos {
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 0;
  list-style: none;
}

.outras li {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px 0;
}

.outras li + li {
  border-top: 1px solid var(--border);
}

.outra-data {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.outra-titulo {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text);
  text-decoration: none;
}

.outra-titulo:hover {
  text-decoration: underline;
}

.agenda {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--surface-pasta);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.proximos {
  gap: 12px;
}

.proximos li {
  display: flex;
  align-items: baseline;
  gap: 16px;
}

.proximo-data {
  flex-shrink: 0;
  width: 44px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 700;
  color: var(--accent);
}

.proximo-textos {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.proximo-titulo {
  font-size: 13px;
  font-weight: 600;
}

.proximo-meta {
  font-size: 11.5px;
  color: var(--text-muted);
}

.vazio-lateral {
  font-size: 13px;
  color: var(--text-muted);
}

@media (max-width: 899px) {
  .leitura {
    grid-template-columns: minmax(0, 1fr);
  }

  .artigo {
    padding: 20px;
  }

  .ficha-evento div + div {
    border-left: 0;
    border-top: 1px solid var(--border);
  }
}
</style>
