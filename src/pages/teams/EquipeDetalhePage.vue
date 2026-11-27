<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import EtiquetaEquipe from '@/components/global/EtiquetaEquipe.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import TrilhaNavegacao from '@/components/global/TrilhaNavegacao.vue'
import { useEquipeDetalhe } from '@/composables/useEquipeDetalhe'
import { mesAno, periodo } from '@/utils/datas'
import { cursoCurto } from '@/utils/pessoas'

const rota = useRoute()
const id = computed(() => Number(rota.params.id))
const { carregar, carregando, erro, naoEncontrada, equipe, souMembro, mostrarEx, linhas, quantidadeEx, projetos } =
  useEquipeDetalhe(id)

onMounted(carregar)
</script>

<template>
  <div class="pagina">
    <template v-if="carregando">
      <div class="carregando-pagina" aria-hidden="true">
        <EsqueletoBloco largura="160px" altura="12px" />
        <EsqueletoBloco largura="140px" altura="10px" />
        <EsqueletoBloco largura="220px" altura="28px" />
        <div class="colunas">
          <EsqueletoBloco altura="320px" raio="12px" />
          <EsqueletoBloco altura="180px" raio="12px" />
        </div>
      </div>
      <p class="sr-only" role="status">Carregando a equipe…</p>
    </template>

    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />

    <EstadoVazio v-else-if="naoEncontrada || !equipe" titulo="Equipe não encontrada." texto="Ela pode ter sido removida.">
      <BotaoBase variante="secundario" :para="{ name: 'equipes' }">Voltar para Equipes</BotaoBase>
    </EstadoVazio>

    <template v-else>
      <TrilhaNavegacao class="surgir" :itens="[{ texto: 'Equipes', para: { name: 'equipes' } }, { texto: equipe.nome }]" />

      <CabecalhoPagina class="surgir" style="--ordem: 1" :rotulo="`< EQUIPE /> · DESDE ${mesAno(equipe.desde)}`" :titulo="equipe.nome">
        <template #icone>
          <span class="marcador" :style="{ background: equipe.cor }" aria-hidden="true" />
        </template>
        <template v-if="souMembro" #acoes>
          <PilulaStatus status="Você faz parte" cor="var(--accent)" />
        </template>
      </CabecalhoPagina>

      <div class="colunas">
        <CartaoSecao class="surgir" style="--ordem: 2" rotulo="[01] REGISTRO" titulo="Membros e período">
          <template v-if="quantidadeEx" #acao>
            <BotaoBase variante="secundario" :aria-pressed="mostrarEx" @click="mostrarEx = !mostrarEx">
              {{ mostrarEx ? 'Esconder ex-membros' : 'Mostrar ex-membros' }}
            </BotaoBase>
          </template>
          <div v-if="linhas.length" class="rolagem">
            <table class="tabela">
              <caption class="sr-only">Membros da equipe {{ equipe.nome }} e período de cada um</caption>
              <thead>
                <tr>
                  <th scope="col">Membro</th>
                  <th scope="col">Curso</th>
                  <th scope="col">Período</th>
                  <th scope="col" class="direita">Situação</th>
                </tr>
              </thead>
              <TransitionGroup tag="tbody" name="lista">
                <tr v-for="linha in linhas" :key="linha.id" :class="{ ex: !linha.atual }">
                  <td>
                    <span class="membro">
                      <AvatarPessoa :nome="linha.usuario.nome" :iniciais="linha.usuario.iniciais" :cor="linha.usuario.cor" :foto="linha.usuario.foto" :tamanho="26" />
                      <RouterLink :to="{ name: 'membro', params: { id: linha.usuario.id } }">{{ linha.usuario.nome }}</RouterLink>
                    </span>
                  </td>
                  <td class="suave">{{ cursoCurto(linha.usuario.curso) }}</td>
                  <td class="mono">{{ periodo(linha.inicio, linha.fim) }}</td>
                  <td class="direita">
                    <PilulaStatus :status="linha.atual ? 'Atual' : 'Saiu'" :cor="linha.atual ? 'var(--online)' : 'var(--text-subtle)'" />
                  </td>
                </tr>
              </TransitionGroup>
            </table>
          </div>
          <EstadoVazio v-else compacto titulo="Ninguém na equipe agora." />
        </CartaoSecao>

        <CartaoSecao class="surgir" style="--ordem: 3" rotulo="[02] ARQUIVO" titulo="Projetos da equipe">
          <ul v-if="projetos.length" class="lista">
            <li v-for="{ projeto, vinculo } in projetos" :key="projeto.id">
              <EtiquetaEquipe
                :nome="projeto.nome"
                :cor="projeto.cor"
                :para="{ name: 'projeto', params: { id: projeto.id } }"
                :detalhe="periodo(vinculo.inicio, vinculo.fim)"
              />
            </li>
          </ul>
          <EstadoVazio v-else compacto titulo="Nenhum projeto ainda." />
        </CartaoSecao>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pagina {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.marcador {
  display: block;
  width: 14px;
  height: 14px;
  margin-top: 22px;
  border-radius: 3px;
}

.colunas {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 340px);
  align-items: start;
  gap: 20px;
}

/* Só a tabela rola na horizontal */
.rolagem {
  overflow-x: auto;
}

.tabela {
  width: 100%;
  min-width: 520px;
  border-collapse: collapse;
  font-size: 13px;
}

th {
  padding: 8px 10px;
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
  padding: 8px 10px;
  border-bottom: 1px solid var(--border);
}

tbody tr:last-child td {
  border-bottom: 0;
}

.direita {
  text-align: right;
}

.membro {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 36px;
}

.membro a {
  font-weight: 600;
  color: var(--text);
  text-decoration: none;
}

.membro a:hover {
  text-decoration: underline;
}

.suave {
  color: var(--text-muted);
}

.mono {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  color: var(--text-muted);
}

.ex {
  opacity: .7;
}

.lista {
  margin: 0;
  padding: 0;
  list-style: none;
}

.carregando-pagina {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.carregando-pagina :deep(.esqueleto) {
  max-width: 100%;
}

@media (max-width: 899px) {
  .colunas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
