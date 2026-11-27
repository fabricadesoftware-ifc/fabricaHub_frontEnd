<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import CrachaMembro from '@/components/members/CrachaMembro.vue'
import { MAX_BIO, TIPOS_LINK, usePerfil } from '@/composables/usePerfil'
import { CURSOS, NOME_PAPEL } from '@/utils/pessoas'

const {
  carregar,
  carregando,
  erro,
  usuario,
  papel,
  form,
  alterado,
  restantes,
  salvando,
  aviso,
  descartar,
  salvar,
  adicionarLink,
  removerLink,
  trocarFoto,
  removerFoto,
} = usePerfil()

onMounted(carregar)

const seletorFoto = useTemplateRef<HTMLInputElement>('seletorFoto')
const erroFoto = ref('')

async function aoEscolherFoto(evento: Event) {
  const campo = evento.target as HTMLInputElement
  const arquivo = campo.files?.[0]
  campo.value = '' // permite escolher o mesmo arquivo de novo
  if (!arquivo) return
  erroFoto.value = (await trocarFoto(arquivo)) ?? ''
}

// O curso atual entra na lista mesmo se não estiver nas opções padrão.
const cursos = computed(() => (form.curso && !CURSOS.includes(form.curso as never) ? [form.curso, ...CURSOS] : [...CURSOS]))
const linksPreenchidos = computed(() => form.links.filter((l) => l.url.trim()).length)
const registro = computed(() => (usuario.value ? `${NOME_PAPEL[papel.value]} · Nº ${String(usuario.value.registro).padStart(3, '0')}` : ''))
</script>

<template>
  <div class="pagina">
    <CabecalhoPagina class="surgir" rotulo="< MEU CRACHÁ /> · EDITAR PERFIL" titulo="Meu " destaque="perfil" />

    <template v-if="carregando">
      <div class="colunas" aria-hidden="true">
        <EsqueletoBloco altura="300px" raio="12px" />
        <div class="formulario">
          <EsqueletoBloco altura="260px" raio="12px" />
          <EsqueletoBloco altura="150px" raio="12px" />
          <EsqueletoBloco altura="170px" raio="12px" />
        </div>
      </div>
      <p class="sr-only" role="status">Carregando o seu perfil…</p>
    </template>

    <EstadoErro v-else-if="erro || !usuario" :mensagem="erro ?? 'Não foi possível carregar o seu perfil.'" @tentar-de-novo="carregar" />

    <div v-else class="colunas">
      <!-- Prévia em tempo real -->
      <aside class="previa surgir" style="--ordem: 1" aria-label="Prévia do seu crachá">
        <p class="previa-rotulo">PRÉVIA DO SEU CRACHÁ</p>
        <CrachaMembro
          tamanho="grande"
          nivel="h2"
          :nome="usuario.nomeCompleto"
          :usuario="usuario.usuario"
          :curso="form.curso"
          :papel="papel"
          :cor="usuario.cor"
          :iniciais="usuario.iniciais"
          :foto="form.foto"
        >
          <p v-if="form.bio" class="previa-bio">{{ form.bio }}</p>
          <p class="previa-links">{{ linksPreenchidos }} {{ linksPreenchidos === 1 ? 'LINK' : 'LINKS' }}</p>
          <template #rodape>
            <span class="registro">{{ registro }}</span>
          </template>
        </CrachaMembro>
      </aside>

      <form class="formulario" novalidate @submit.prevent="salvar">
        <CartaoSecao class="surgir" style="--ordem: 2" rotulo="[01] IDENTIFICAÇÃO">
          <div class="foto">
            <AvatarPessoa :nome="usuario.nome" :iniciais="usuario.nomeCompleto.split(' ').map((p) => p[0]).slice(0, 2).join('')" :cor="usuario.cor" :foto="form.foto" :tamanho="64" />
            <div class="foto-acoes">
              <BotaoBase variante="secundario" @click="seletorFoto?.click()">Trocar foto</BotaoBase>
              <button v-if="form.foto" type="button" class="botao-texto" @click="removerFoto">Remover</button>
              <input ref="seletorFoto" type="file" accept="image/png,image/jpeg" class="sr-only" tabindex="-1" aria-label="Escolher foto" @change="aoEscolherFoto" />
            </div>
          </div>
          <p class="dica" :class="{ erro: erroFoto }" :role="erroFoto ? 'alert' : undefined">
            {{ erroFoto || 'PNG ou JPG, até 2 MB. Sem foto, usamos as suas iniciais.' }}
          </p>

          <div class="dupla">
            <label class="campo">
              <span class="campo-label">Nome</span>
              <span class="bloqueado">
                <input :value="usuario.nomeCompleto" readonly aria-describedby="aviso-github" />
                <IconeSvg nome="cadeado" :tamanho="14" />
              </span>
            </label>
            <label class="campo">
              <span class="campo-label">Usuário</span>
              <span class="bloqueado">
                <input :value="`@${usuario.usuario}`" readonly aria-describedby="aviso-github" />
                <IconeSvg nome="cadeado" :tamanho="14" />
              </span>
            </label>
          </div>
          <p id="aviso-github" class="dica">Nome e usuário vêm da sua conta do GitHub. Para mudar, altere lá.</p>

          <CampoSelect v-model="form.curso" label="Curso" disposicao="cima" :opcoes="cursos" />
        </CartaoSecao>

        <CartaoSecao class="surgir" style="--ordem: 3" rotulo="[02] BIOGRAFIA" :detalhe="`${form.bio.length}/${MAX_BIO}`">
          <label class="campo">
            <span class="sr-only">Biografia</span>
            <textarea v-model="form.bio" rows="4" :maxlength="MAX_BIO" aria-describedby="contador-bio" />
          </label>
          <p id="contador-bio" class="sr-only" aria-live="polite">{{ restantes }} caracteres restantes</p>
        </CartaoSecao>

        <CartaoSecao class="surgir" style="--ordem: 4" rotulo="[03] LINKS">
          <TransitionGroup tag="ul" name="lista" class="links">
            <li v-for="(link, i) in form.links" :key="i" class="link">
              <label class="link-tipo">
                <span class="sr-only">Tipo do link {{ i + 1 }}</span>
                <select v-model="link.tipo">
                  <option v-for="tipo in TIPOS_LINK" :key="tipo" :value="tipo">{{ tipo }}</option>
                </select>
              </label>
              <label class="link-url">
                <span class="sr-only">Endereço do link {{ i + 1 }}</span>
                <input v-model="link.url" type="url" placeholder="https://" />
              </label>
              <button type="button" class="remover" :aria-label="`Remover link ${link.tipo}`" @click="removerLink(i)">
                <IconeSvg nome="fechar" :tamanho="14" />
              </button>
            </li>
          </TransitionGroup>
          <div>
            <BotaoBase variante="secundario" @click="adicionarLink"><IconeSvg nome="mais" :tamanho="14" /> Adicionar link</BotaoBase>
          </div>
        </CartaoSecao>

        <div class="rodape surgir" style="--ordem: 5">
          <p v-if="aviso" class="aviso" :class="aviso.tipo" :role="aviso.tipo === 'erro' ? 'alert' : 'status'">{{ aviso.texto }}</p>
          <BotaoBase variante="secundario" :disabled="!alterado || salvando" @click="descartar">Descartar</BotaoBase>
          <BotaoBase tipo="submit" :disabled="!alterado || salvando">{{ salvando ? 'Salvando…' : 'Salvar alterações' }}</BotaoBase>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 280px) minmax(0, 1fr);
  align-items: start;
  gap: 24px;
}

/* Prévia */
.previa {
  position: sticky;
  top: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.previa-rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-align: center;
  color: var(--text-subtle);
}

.previa-bio {
  margin-top: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--text-muted);
  overflow-wrap: anywhere;
}

.previa-links {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  color: var(--text-subtle);
}

.registro {
  color: var(--cor-papel-claro);
}

/* Formulário */
.formulario {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 0;
}

.formulario :deep(.corpo) {
  gap: 14px;
}

.foto {
  display: flex;
  align-items: center;
  gap: 16px;
}

.foto-acoes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.botao-texto {
  min-height: 44px;
  padding: 0 12px;
  border: 0;
  border-radius: var(--radius-btn);
  background: transparent;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-muted);
  cursor: pointer;
}

.botao-texto:hover {
  background: rgba(255, 255, 255, .04);
  color: var(--text);
}

.dica {
  margin-top: -6px;
  font-size: 12px;
  color: var(--text-subtle);
}

.dica.erro {
  color: var(--brand-red);
}

.dupla {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.campo-label {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

input,
textarea,
select {
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13.5px;
  transition: border-color var(--dur-media);
}

input:focus-visible,
textarea:focus-visible,
select:focus-visible {
  border-color: var(--accent);
}

textarea {
  min-height: 96px;
  padding: 10px 12px;
  line-height: 1.5;
  resize: vertical;
}

.bloqueado {
  position: relative;
  display: flex;
  align-items: center;
}

.bloqueado input {
  flex: 1;
  min-width: 0;
  padding-right: 36px;
  background: var(--surface-2);
  color: var(--text-muted);
  cursor: not-allowed;
}

.bloqueado svg {
  position: absolute;
  right: 12px;
  color: var(--text-subtle);
}

.links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.links:empty {
  display: none;
}

.link {
  display: grid;
  grid-template-columns: minmax(110px, 160px) minmax(0, 1fr) 44px;
  gap: 8px;
}

.link-tipo select,
.link-url input {
  width: 100%;
}

.link-url input {
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.remover {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.remover:hover {
  border-color: rgba(255, 32, 32, .5);
  color: var(--brand-red);
}

.rodape {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.aviso {
  flex: 1 1 240px;
  font-size: 13px;
}

.aviso.sucesso {
  color: var(--online);
}

.aviso.erro {
  color: var(--brand-red);
}

@media (max-width: 899px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }

  .previa {
    position: static;
    max-width: 340px;
    width: 100%;
    margin: 0 auto;
  }
}

@media (max-width: 499px) {
  .link {
    grid-template-columns: minmax(0, 1fr) 44px;
  }

  .link-url {
    grid-column: 1 / 2;
    grid-row: 2;
  }
}
</style>
