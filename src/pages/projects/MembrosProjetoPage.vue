<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import Carimbo from '@/components/global/Carimbo.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import FichaContador from '@/components/global/FichaContador.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { useMembrosProjeto } from '@/composables/useMembrosProjeto'
import { FUNCOES } from '@/composables/useNovaTarefa'
import { useAuthStore } from '@/stores/auth'
import { mesAno } from '@/utils/datas'
import { cursoCurto } from '@/utils/pessoas'

const rota = useRoute()
const auth = useAuthStore()
const id = computed(() => Number(rota.params.id))
const { carregar, carregando, erro, projeto, linhas, porFuncao, disponiveis, ocupado, aviso, adicionar, trocarFuncao, remover } =
  useMembrosProjeto(id)

onMounted(carregar)

// Formulário de adicionar (abre no topo da tabela)
const adicionando = ref(false)
const novoMembro = ref('')
const novaFuncao = ref('Front-end')
/** Quem está com o "Remover" pedindo confirmação. */
const confirmando = ref<number | null>(null)

async function confirmarAdicao() {
  if (!novoMembro.value) return
  if (await adicionar(Number(novoMembro.value), novaFuncao.value)) {
    novoMembro.value = ''
    adicionando.value = false
  }
}

async function confirmarRemocao(idUsuario: number) {
  if (confirmando.value !== idUsuario) {
    confirmando.value = idUsuario
    return
  }
  confirmando.value = null
  await remover(idUsuario)
}

/** Funções da lista mais a atual (caso seja uma função fora do padrão). */
function funcoesPara(atual: string) {
  return FUNCOES.includes(atual) ? FUNCOES : [atual, ...FUNCOES]
}
</script>

<template>
  <div class="pagina">
    <template v-if="carregando">
      <div class="carregando-pagina" aria-hidden="true">
        <EsqueletoBloco largura="220px" altura="12px" />
        <EsqueletoBloco largura="280px" altura="30px" />
        <div class="fichas">
          <EsqueletoBloco v-for="i in 3" :key="i" altura="72px" raio="8px" />
        </div>
        <EsqueletoBloco altura="380px" raio="12px" />
      </div>
      <p class="sr-only" role="status">Carregando os membros…</p>
    </template>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="!projeto" titulo="Projeto não encontrado.">
      <BotaoBase variante="secundario" :para="{ name: 'projetos' }">Voltar para Projetos</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao
        class="surgir"
        :itens="[
          { texto: 'Projetos', para: { name: 'projetos' } },
          { texto: projeto.nome, para: { name: 'projeto', params: { id: projeto.id } } },
          { texto: 'Membros' },
        ]"
      />

      <CabecalhoPagina
        class="surgir"
        style="--ordem: 1"
        :rotulo="`< QUADRO DE PESSOAL /> · ${projeto.nome.toUpperCase()}`"
        titulo="Membros do "
        destaque="projeto"
      >
        <template #acoes>
          <BotaoBase :aria-expanded="adicionando" aria-controls="form-adicionar" @click="adicionando = !adicionando">
            <IconeSvg nome="mais" :tamanho="16" /> Adicionar membro
          </BotaoBase>
        </template>
      </CabecalhoPagina>

      <section class="fichas surgir" style="--ordem: 2" aria-label="Pessoas por função">
        <FichaContador v-for="item in porFuncao" :key="item.funcao" compacto :numero="item.total" :label="item.funcao" />
      </section>

      <p v-if="aviso" class="aviso" :class="aviso.tipo" :role="aviso.tipo === 'erro' ? 'alert' : 'status'">{{ aviso.texto }}</p>

      <section class="tabela-cartao surgir" style="--ordem: 3" aria-label="Membros do projeto">
        <form v-if="adicionando" id="form-adicionar" class="adicionar" @submit.prevent="confirmarAdicao">
          <CampoSelect
            v-model="novoMembro"
            label="Pessoa"
            disposicao="cima"
            :opcoes="disponiveis"
            :vazio="disponiveis.length ? 'Escolha alguém' : 'Todo mundo já está no projeto'"
          />
          <CampoSelect v-model="novaFuncao" label="Função" disposicao="cima" :opcoes="FUNCOES" />
          <div class="adicionar-acoes">
            <BotaoBase variante="secundario" @click="adicionando = false">Cancelar</BotaoBase>
            <BotaoBase tipo="submit" :disabled="!novoMembro || ocupado !== null">Adicionar</BotaoBase>
          </div>
        </form>

        <div class="rolagem">
          <table class="tabela">
            <caption class="sr-only">Membros de {{ projeto.nome }}, função, entrada e tarefas abertas</caption>
            <thead>
              <tr>
                <th scope="col">Membro</th>
                <th scope="col">Função no projeto</th>
                <th scope="col">Desde</th>
                <th scope="col">Abertas</th>
                <th scope="col" class="direita">Ações</th>
              </tr>
            </thead>
            <TransitionGroup tag="tbody" name="lista">
              <tr v-for="linha in linhas" :key="linha.idUsuario" :aria-busy="ocupado === linha.idUsuario">
                <td>
                  <span class="membro">
                    <AvatarPessoa
                      :nome="linha.usuario.nome"
                      :iniciais="linha.usuario.iniciais"
                      :cor="linha.usuario.cor"
                      :foto="linha.usuario.foto"
                      :tamanho="32"
                      forma="circulo"
                    />
                    <span class="membro-textos">
                      <span class="membro-linha">
                        <RouterLink :to="{ name: 'membro', params: { id: linha.idUsuario } }" class="membro-nome">{{ linha.usuario.nome }}</RouterLink>
                        <Carimbo
                          v-if="linha.lider"
                          :texto="linha.idUsuario === auth.usuario?.id ? 'Líder · você' : 'Líder'"
                          tipo="devolvido"
                          tamanho="pequeno"
                          class="carimbo"
                        />
                      </span>
                      <span class="membro-curso">{{ cursoCurto(linha.usuario.curso) }}</span>
                    </span>
                  </span>
                </td>
                <td>
                  <label class="sr-only" :for="`funcao-${linha.idUsuario}`">Função de {{ linha.usuario.nome }}</label>
                  <select
                    :id="`funcao-${linha.idUsuario}`"
                    class="funcao"
                    :value="linha.funcao"
                    :disabled="ocupado === linha.idUsuario"
                    @change="trocarFuncao(linha.idUsuario, ($event.target as HTMLSelectElement).value)"
                  >
                    <option v-for="f in funcoesPara(linha.funcao)" :key="f" :value="f">{{ f }}</option>
                  </select>
                </td>
                <td class="mono">{{ linha.desde ? mesAno(linha.desde) : '—' }}</td>
                <td class="mono" :class="{ destaque: linha.abertas > 2 }">{{ linha.abertas }}</td>
                <td class="direita">
                  <BotaoBase
                    v-if="!linha.lider"
                    :variante="confirmando === linha.idUsuario ? 'perigo' : 'secundario'"
                    class="remover"
                    :disabled="ocupado === linha.idUsuario"
                    :aria-label="confirmando === linha.idUsuario ? `Confirmar remoção de ${linha.usuario.nome}` : `Remover ${linha.usuario.nome}`"
                    @click="confirmarRemocao(linha.idUsuario)"
                    @blur="confirmando = null"
                  >
                    {{ confirmando === linha.idUsuario ? 'Confirmar' : 'Remover' }}
                  </BotaoBase>
                </td>
              </tr>
            </TransitionGroup>
          </table>
        </div>
        <p class="nota">O líder não pode ser removido nem trocado por aqui. Para isso, fale com a coordenação.</p>
      </section>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.fichas {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 4px 16px;
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

.tabela-cartao {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px 20px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  box-shadow: var(--shadow-hard);
}

.adicionar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 200px) auto;
  align-items: end;
  gap: 12px;
  padding: 16px;
  border: 1px dashed rgba(255, 255, 255, .16);
  border-radius: var(--radius-btn);
}

.adicionar-acoes {
  display: flex;
  gap: 8px;
}

.rolagem {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 13px;
}

th {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .12em;
  text-align: left;
  text-transform: uppercase;
  color: var(--text-subtle);
}

td {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border);
}

tbody tr:last-child td {
  border-bottom: 0;
}

tr[aria-busy='true'] {
  opacity: .6;
}

.direita {
  text-align: right;
}

.membro {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
}

.membro :deep(.circulo) {
  border-color: transparent;
}

.membro-textos {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.membro-linha {
  display: flex;
  align-items: center;
  gap: 12px;
}

.membro-nome {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.membro-nome:hover {
  text-decoration: underline;
}

.carimbo {
  animation: none;
}

.membro-curso {
  font-size: 11.5px;
  color: var(--text-subtle);
}

.funcao {
  min-width: 140px;
  min-height: 40px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13px;
  cursor: pointer;
}

.funcao:focus-visible {
  border-color: var(--accent);
}

.mono {
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-muted);
}

.mono.destaque {
  color: var(--accent);
}

.remover {
  min-height: 36px;
  padding: 0 12px;
  font-size: 12.5px;
}

.nota {
  font-size: 12px;
  color: var(--text-subtle);
}

.carregando-pagina {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.carregando-pagina :deep(.esqueleto) {
  max-width: 100%;
}

@media (max-width: 699px) {
  .adicionar {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
