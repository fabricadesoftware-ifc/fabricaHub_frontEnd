<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import RotuloSecao from '@/components/global/RotuloSecao.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { MAX_DESCRICAO, useEditarProjeto } from '@/composables/useEditarProjeto'
import { STATUS_PROJETO } from '@/composables/useListaProjetos'
import { useAuthStore } from '@/stores/auth'
import { logoFabrica } from '@/utils/logo'

const rota = useRoute()
const auth = useAuthStore()
const id = computed(() => Number(rota.params.id))
const { carregar, carregando, projeto, form, alterado, tecnologias, erroNome, salvando, aviso, alternarTecnologia, descartar, salvar, lider, orientador } =
  useEditarProjeto(id)

onMounted(carregar)

const estado = computed(() => (salvando.value ? 'SALVANDO…' : alterado.value ? 'ALTERAÇÕES NÃO SALVAS' : 'SALVO'))
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
          { texto: 'Editar' },
        ]"
      />

      <CabecalhoPagina class="surgir" style="--ordem: 1" :rotulo="`< EDITAR FICHA DO PROJETO /> · ${estado}`" titulo="Editar " destaque="projeto" />

      <div class="colunas">
        <form class="formulario surgir" style="--ordem: 2" novalidate @submit.prevent="salvar">
          <section class="bloco">
            <RotuloSecao rotulo="[01] IDENTIFICAÇÃO" />
            <div class="identidade">
              <span class="capa">
                <img v-if="logoFabrica" :src="logoFabrica" :alt="`Imagem do projeto ${projeto.nome}`" />
                <span v-else aria-hidden="true">{{ projeto.sigla }}</span>
              </span>
              <label class="campo cresce">
                <span class="rotulo">Nome *</span>
                <input v-model="form.nome" :aria-invalid="!!erroNome" aria-describedby="erro-nome" required />
                <span v-if="erroNome" id="erro-nome" class="erro-campo">{{ erroNome }}</span>
              </label>
            </div>
            <label class="campo">
              <span class="rotulo">Descrição</span>
              <textarea v-model="form.descricao" rows="4" :maxlength="MAX_DESCRICAO" aria-describedby="contador-descricao" />
              <span id="contador-descricao" class="contador">{{ form.descricao.length }}/{{ MAX_DESCRICAO }}</span>
            </label>
            <CampoSelect v-model="form.status" label="Status" disposicao="cima" :opcoes="STATUS_PROJETO" class="status" />
          </section>

          <section class="bloco">
            <RotuloSecao rotulo="[02] TECNOLOGIAS" />
            <div class="tecnologias" role="group" aria-label="Tecnologias do projeto">
              <button
                v-for="tec in tecnologias"
                :key="tec"
                type="button"
                class="tec"
                :class="{ ativa: form.tecnologias.includes(tec) }"
                :aria-pressed="form.tecnologias.includes(tec)"
                @click="alternarTecnologia(tec)"
              >
                {{ tec }}
              </button>
            </div>
          </section>

          <section class="bloco">
            <RotuloSecao rotulo="[03] LINKS" />
            <div class="dupla">
              <label class="campo">
                <span class="rotulo">Repositório</span>
                <input v-model="form.repositorio" type="url" class="mono" placeholder="https://github.com/..." />
              </label>
              <label class="campo">
                <span class="rotulo">Figma</span>
                <input v-model="form.figma" type="url" class="mono" placeholder="https://figma.com/..." />
              </label>
            </div>
          </section>

          <footer class="rodape">
            <p v-if="aviso" class="aviso" :class="aviso.tipo" :role="aviso.tipo === 'erro' ? 'alert' : 'status'">{{ aviso.texto }}</p>
            <BotaoBase variante="secundario" :disabled="!alterado || salvando" @click="descartar">Cancelar</BotaoBase>
            <BotaoBase tipo="submit" :disabled="!alterado || salvando || !!erroNome">{{ salvando ? 'Salvando…' : 'Salvar alterações' }}</BotaoBase>
          </footer>
        </form>

        <aside class="lateral">
          <section class="responsaveis surgir" style="--ordem: 3" aria-labelledby="titulo-responsaveis">
            <RotuloSecao rotulo="[04] RESPONSÁVEIS"><span id="titulo-responsaveis" class="sr-only">Responsáveis</span></RotuloSecao>
            <template v-if="carregando">
              <EsqueletoBloco v-for="i in 2" :key="i" altura="40px" raio="8px" />
            </template>
            <template v-else>
              <div v-for="pessoa in [{ papel: 'Líder', usuario: lider }, { papel: 'Orientador', usuario: orientador }]" :key="pessoa.papel" class="responsavel">
                <AvatarPessoa
                  :nome="pessoa.usuario?.nome ?? '?'"
                  :iniciais="pessoa.usuario?.iniciais"
                  :cor="pessoa.usuario?.cor"
                  :foto="pessoa.usuario?.foto"
                  :tamanho="32"
                  forma="circulo"
                />
                <span class="responsavel-textos">
                  <span class="responsavel-papel">{{ pessoa.papel }}</span>
                  <span class="responsavel-nome">
                    {{ pessoa.usuario?.nome ?? '—' }}<template v-if="pessoa.usuario?.id === auth.usuario?.id"> (você)</template>
                  </span>
                </span>
                <IconeSvg nome="cadeado" :tamanho="14" class="cadeado" />
              </div>
            </template>
            <p class="nota">Só o admin troca o líder e o orientador.</p>
          </section>

          <CartaoSecao class="surgir" style="--ordem: 4" rotulo="[05] OUTRAS AÇÕES">
            <nav class="acoes" aria-label="Outras ações do projeto">
              <RouterLink :to="{ name: 'projeto-membros', params: { id: projeto.id } }" class="acao">Membros e funções <span aria-hidden="true">→</span></RouterLink>
              <RouterLink :to="{ name: 'projeto-galeria', params: { id: projeto.id } }" class="acao">Galeria do projeto <span aria-hidden="true">→</span></RouterLink>
            </nav>
          </CartaoSecao>
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

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 300px);
  align-items: start;
  gap: 24px;
}

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

.identidade {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.capa {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: var(--radius-menu);
  background: var(--text);
  box-shadow: var(--shadow-hard);
  font-size: 26px;
  font-weight: 700;
  color: var(--ink);
}

.capa img {
  width: 78%;
  height: 78%;
  object-fit: contain;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.cresce {
  flex: 1;
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
  min-height: 112px;
  padding: 12px;
  line-height: 1.55;
  resize: vertical;
}

input:focus-visible,
textarea:focus-visible {
  border-color: var(--accent);
}

input[aria-invalid='true'] {
  border-color: rgba(255, 32, 32, .6);
}

.mono {
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.contador {
  align-self: flex-end;
  font-family: var(--font-mono);
  font-size: 10.5px;
  color: var(--text-subtle);
}

.erro-campo {
  font-size: 12px;
  color: #FF6B5E;
}

.status {
  max-width: 260px;
}

.tecnologias {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tec {
  min-height: 36px;
  padding: 0 12px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  background: transparent;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
  transition: background-color var(--dur-media), color var(--dur-media), border-color var(--dur-media);
}

.tec:hover {
  border-color: rgba(255, 255, 255, .24);
  color: var(--text);
}

.tec.ativa {
  border-color: var(--text);
  background: var(--text);
  color: var(--ink);
}

.dupla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.aviso {
  flex: 1 1 200px;
  font-size: 13px;
}

.aviso.sucesso {
  color: var(--online);
}

.aviso.erro {
  color: var(--brand-red);
}

/* Lateral */
.lateral {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.responsaveis {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  background: var(--surface-pasta);
  border: 1px solid rgba(255, 255, 255, .06);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.responsavel {
  display: flex;
  align-items: center;
  gap: 12px;
}

.responsavel :deep(.circulo) {
  border-color: transparent;
}

.responsavel-textos {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.responsavel-papel {
  font-family: var(--font-mono);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

.responsavel-nome {
  font-size: 13.5px;
  font-weight: 600;
}

.cadeado {
  color: var(--text-subtle);
}

.nota {
  font-size: 12px;
  color: var(--text-subtle);
}

.acoes {
  display: flex;
  flex-direction: column;
}

.acao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 44px;
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.acao + .acao {
  border-top: 1px solid var(--border);
}

.acao:hover {
  color: var(--accent);
}

@media (max-width: 899px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
