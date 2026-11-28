<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useRoute } from 'vue-router'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { ROTULO_TIPO, TIPOS_ARQUIVO, useGaleriaProjeto } from '@/composables/useGaleriaProjeto'
import { useProjetosStore } from '@/stores/projetos'
import { diaMes } from '@/utils/datas'
import { logoFabrica } from '@/utils/logo'
import type { TipoArquivoGaleria } from '@/utils/tipos'

const rota = useRoute()
const projetos = useProjetosStore()
const id = computed(() => Number(rota.params.id))
const projeto = computed(() => projetos.lista.find((p) => p.id === id.value) ?? null)
const { carregar, carregando, erro, filtro, tipoEnvio, imagens, total, enviando, ocupado, aviso, enviar, trocarTipo, remover, usuario } =
  useGaleriaProjeto(id)

onMounted(carregar)

const seletor = useTemplateRef<HTMLInputElement>('seletor')
const arrastando = ref(false)
/** Imagem com a lixeira pedindo confirmação. */
const confirmando = ref<number | null>(null)

const opcoesFiltro: { valor: TipoArquivoGaleria | null; rotulo: string }[] = [
  { valor: null, rotulo: 'Todos' },
  ...TIPOS_ARQUIVO.map((t) => ({ valor: t, rotulo: ROTULO_TIPO[t] })),
]

function aoEscolher(evento: Event) {
  const campo = evento.target as HTMLInputElement
  if (campo.files) enviar(campo.files)
  campo.value = ''
}

function aoSoltar(evento: DragEvent) {
  arrastando.value = false
  if (evento.dataTransfer?.files.length) enviar(evento.dataTransfer.files)
}

async function lixeira(idImagem: number) {
  if (confirmando.value !== idImagem) {
    confirmando.value = idImagem
    return
  }
  confirmando.value = null
  await remover(idImagem)
}

/** Linha fina de cada imagem: "512 × 512 · Jota · 12/03". */
function meta(largura: number, altura: number, idAutor: number, data: string) {
  const dimensao = largura && altura ? `${largura} × ${altura}` : 'SVG'
  return `${dimensao} · ${usuario(idAutor)?.nome ?? '—'} · ${diaMes(data)}`
}
</script>

<template>
  <div class="pagina">
    <EstadoVazio v-if="!projeto" titulo="Projeto não encontrado.">
      <BotaoBase variante="secundario" :para="{ name: 'projetos' }">Voltar para Projetos</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao
        class="surgir"
        :itens="[
          { texto: 'Projetos', para: { name: 'projetos' } },
          { texto: projeto.nome, para: { name: 'projeto', params: { id: projeto.id } } },
          { texto: 'Galeria' },
        ]"
      />

      <CabecalhoPagina
        class="surgir"
        style="--ordem: 1"
        :rotulo="`< ARQUIVO DE IMAGENS /> · ${total} ${total === 1 ? 'ARQUIVO' : 'ARQUIVOS'}`"
        titulo="Galeria "
        destaque="do projeto"
      />

      <!-- Área de envio: arrastar e soltar ou escolher -->
      <div
        class="envio surgir"
        style="--ordem: 2"
        :class="{ arrastando }"
        @dragover.prevent="arrastando = true"
        @dragleave="arrastando = false"
        @drop.prevent="aoSoltar"
      >
        <span class="envio-icone" aria-hidden="true"><IconeSvg nome="arquivos" :tamanho="20" /></span>
        <div class="envio-textos">
          <p class="envio-titulo">Arraste imagens para cá ou escolha do computador</p>
          <p class="envio-dica">PNG, JPG ou SVG, até 5 MB cada. O projeto tem uma logo: enviar outra como logo substitui a atual.</p>
        </div>
        <label class="tipo-envio">
          <span class="sr-only">Enviar como</span>
          <select v-model="tipoEnvio">
            <option v-for="t in TIPOS_ARQUIVO" :key="t" :value="t">{{ ROTULO_TIPO[t] }}</option>
          </select>
        </label>
        <BotaoBase :disabled="enviando" @click="seletor?.click()">{{ enviando ? 'Enviando…' : 'Escolher arquivo' }}</BotaoBase>
        <input
          ref="seletor"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          multiple
          class="sr-only"
          tabindex="-1"
          aria-label="Escolher imagens"
          @change="aoEscolher"
        />
      </div>

      <p v-if="aviso" class="aviso" :class="aviso.tipo" :role="aviso.tipo === 'erro' ? 'alert' : 'status'">{{ aviso.texto }}</p>

      <GrupoPilulas v-model="filtro" class="surgir" style="--ordem: 3" :opcoes="opcoesFiltro" label="Filtrar por tipo" />

      <div v-if="carregando" class="grade" aria-hidden="true">
        <EsqueletoBloco v-for="i in 4" :key="i" altura="200px" raio="12px" />
      </div>
      <p v-if="carregando" class="sr-only" role="status">Carregando a galeria…</p>

      <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

      <EstadoVazio
        v-else-if="!imagens.length"
        :titulo="filtro ? 'Nenhuma imagem desse tipo.' : 'A galeria está vazia.'"
        :texto="filtro ? 'Tente outro filtro.' : 'Envie a logo, um banner e as telas do projeto.'"
      >
        <BotaoBase v-if="filtro" variante="secundario" class="limpar" @click="filtro = null">Limpar filtro</BotaoBase>
      </EstadoVazio>

      <TransitionGroup v-else tag="ul" name="cartao" class="grade">
        <li v-for="imagem in imagens" :key="imagem.id" class="imagem" :aria-busy="ocupado === imagem.id">
          <div class="miniatura">
            <img v-if="imagem.url" :src="imagem.url" :alt="imagem.arquivo" class="foto" />
            <img v-else-if="logoFabrica" :src="logoFabrica" alt="" class="exemplo" />
            <Carimbo v-if="imagem.tipo === 'LOGO'" texto="Logo atual" tipo="devolvido" tamanho="pequeno" class="carimbo" />
          </div>
          <div class="dados">
            <p class="linha">
              <span class="arquivo">{{ imagem.arquivo }}</span>
              <span class="tamanho">{{ imagem.tamanhoKb }} KB</span>
            </p>
            <p class="meta">{{ meta(imagem.largura, imagem.altura, imagem.idAutor, imagem.data) }}</p>
            <div class="controles">
              <label class="tipo">
                <span class="sr-only">Tipo de {{ imagem.arquivo }}</span>
                <select
                  :value="imagem.tipo"
                  :disabled="ocupado === imagem.id"
                  @change="trocarTipo(imagem.id, ($event.target as HTMLSelectElement).value as TipoArquivoGaleria)"
                >
                  <option v-for="t in TIPOS_ARQUIVO" :key="t" :value="t">{{ ROTULO_TIPO[t] }}</option>
                </select>
              </label>
              <button
                type="button"
                class="excluir"
                :class="{ confirmando: confirmando === imagem.id }"
                :disabled="ocupado === imagem.id"
                :aria-label="confirmando === imagem.id ? `Confirmar remoção de ${imagem.arquivo}` : `Remover ${imagem.arquivo}`"
                @click="lixeira(imagem.id)"
                @blur="confirmando = null"
              >
                <IconeSvg nome="lixeira" :tamanho="16" />
                <span v-if="confirmando === imagem.id" class="confirmar">Remover?</span>
              </button>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Envio */
.envio {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px dashed rgba(255, 255, 255, .2);
  border-radius: var(--radius-menu);
  background: var(--surface);
  transition: border-color var(--dur-media), background-color var(--dur-media);
}

.envio.arrastando {
  border-color: var(--accent);
  background: var(--surface-2);
}

.envio-icone {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-btn);
  background: var(--surface-2);
  color: var(--accent);
}

.envio-textos {
  flex: 1 1 280px;
  min-width: 0;
}

.envio-titulo {
  font-size: 14px;
  font-weight: 600;
}

.envio-dica {
  font-size: 12px;
  color: var(--text-muted);
}

.tipo-envio select,
.tipo select {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13px;
  cursor: pointer;
}

.tipo-envio select:focus-visible,
.tipo select:focus-visible {
  border-color: var(--accent);
}

.aviso {
  font-size: 13px;
}

.aviso.sucesso {
  color: var(--online);
}

.aviso.erro {
  color: var(--brand-red);
}

.limpar {
  margin-top: 8px;
}

/* Grade de imagens */
.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.imagem {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  background: var(--surface);
  box-shadow: var(--shadow-hard);
}

.imagem[aria-busy='true'] {
  opacity: .6;
}

.miniatura {
  position: relative;
  display: grid;
  place-items: center;
  aspect-ratio: 16 / 9;
  background: var(--ink);
  border-bottom: 1px solid var(--border);
}

.foto {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.exemplo {
  width: 30%;
  height: 50%;
  object-fit: contain;
  opacity: .85;
}

.carimbo {
  position: absolute;
  top: 12px;
  right: 12px;
}

.dados {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
}

.linha {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.arquivo {
  overflow: hidden;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tamanho,
.meta {
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.tamanho {
  flex-shrink: 0;
}

.controles {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.tipo {
  flex: 1;
  display: flex;
}

.tipo select {
  flex: 1;
  min-width: 0;
}

.excluir {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 44px;
  height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: border-color var(--dur-media), color var(--dur-media);
}

.excluir:hover,
.excluir.confirmando {
  border-color: rgba(255, 32, 32, .5);
  color: #FF6B5E;
}

.confirmar {
  font-size: 12px;
  font-weight: 600;
}
</style>
