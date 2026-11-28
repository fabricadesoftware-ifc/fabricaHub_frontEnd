<script setup lang="ts">
import { computed, ref } from 'vue'
import CabecalhoPagina from '@/components/global/CabecalhoPagina.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import FichaContador from '@/components/global/FichaContador.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import EstadoErro from '@/components/global/EstadoErro.vue'
import EsqueletoBloco from '@/components/global/EsqueletoBloco.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import { fontesGestao as fontes, useCargaGestao } from '@/composables/useGestao'
import { useAuthStore } from '@/stores/auth'
import { dataCabecalho, dataHora, saudacao } from '@/utils/datas'

const props = defineProps<{ secao?: 'acessos' | 'logs' }>()
const auth = useAuthStore()
const agora = new Date()
const busca = ref('')
const titulos = { acessos: 'Requerimentos de acesso', logs: 'Logs de gestão' }
const atalhos = [
  { nome: 'Novo projeto', rota: 'admin-projetos-criar' },
  { nome: 'Nova equipe', rota: 'admin-equipes-criar' },
  { nome: 'Nova notícia', rota: 'admin-noticias-criar' },
  { nome: 'Membros', rota: 'admin-membros' },
]
const { dado, carregando, erro, carregar } = useCargaGestao(async () => {
  const [membros, projetos, equipes, acessos, logs] = await Promise.all([
    fontes.membros(), fontes.projetos(), fontes.equipes(), fontes.acessos(), fontes.logs(),
  ])
  return { membros, projetos, equipes, acessos, logs }
})
const pendentes = computed(() => dado.value?.acessos.filter(p => p.pendente) ?? [])
const pedidos = computed(() => props.secao ? dado.value?.acessos ?? [] : pendentes.value.slice(0, 3))
const ativos = computed(() => dado.value?.membros.filter(m => m.ativo).length ?? 0)
const nomes = computed(() => new Map(dado.value?.membros.map(m => [m.id, m.nome])))
const resultados = computed(() => {
  const termo = busca.value.trim().toLocaleLowerCase()
  if (!termo || !dado.value) return []
  return [
    ...dado.value.membros.map(m => ({ nome: m.nomeCompleto, busca: m.nomeCompleto + ' ' + m.nome + ' ' + m.usuario, tipo: 'Membro', rota: 'admin-membros-editar', id: m.id })),
    ...dado.value.projetos.map(p => ({ nome: p.nome, busca: p.nome, tipo: 'Projeto', rota: 'projeto', id: p.id })),
  ].filter(item => item.busca.toLocaleLowerCase().includes(termo))
})
</script>

<template>
  <div class="painel surgir">
    <CabecalhoPagina
      :rotulo="secao ? '< ADMINISTRAÇÃO />' : '< SALA DA COORDENAÇÃO /> · ' + dataCabecalho(agora)"
      :titulo="secao ? titulos[secao] : saudacao(agora) + ', '"
      :destaque="secao ? '_' : (auth.usuario?.nome ?? 'Admin') + '_'"
    >
      <template v-if="!secao" #acoes>
        <div class="busca" @keydown.esc="busca = ''">
          <CampoBusca v-model="busca" label="Buscar membro ou projeto" placeholder="Buscar membro, projeto..." />
          <div v-if="busca.trim() && dado" class="resultados">
            <RouterLink v-for="item in resultados" :key="item.rota + item.id" :to="{ name: item.rota, params: { id: item.id } }">
              {{ item.nome }} <small>{{ item.tipo }}</small>
            </RouterLink>
            <p v-if="!resultados.length">Nenhum resultado.</p>
          </div>
        </div>
        <BotaoBase :para="{ name: 'admin-projetos-criar' }">+ Novo projeto</BotaoBase>
      </template>
    </CabecalhoPagina>

    <EsqueletoBloco v-if="carregando" altura="160px" aria-label="Carregando painel" aria-busy="true" />
    <EstadoErro v-else-if="erro" :mensagem="erro" @tentar-de-novo="carregar" />
    <template v-else-if="dado">
      <div v-if="!secao" class="contadores">
        <FichaContador label="[01] Membros" :numero="dado.membros.length" :descricao="ativos + ' ativos · ' + (dado.membros.length - ativos) + ' inativos'" />
        <FichaContador label="[02] Projetos" :numero="dado.projetos.length" :descricao="dado.projetos.filter(p => p.status === 'Em andamento').length + ' em andamento'" />
        <FichaContador label="[03] Equipes" :numero="dado.equipes.length" :descricao="dado.equipes.reduce((total, e) => total + e.idsMembros.length, 0) + ' vínculos ativos'" />
        <FichaContador label="[04] Acessos" :numero="pendentes.length" descricao="pedidos aguardando análise" destaque />
      </div>

      <div class="grade" :class="{ unica: secao }">
        <div v-if="secao !== 'logs'" class="coluna">
          <CartaoSecao rotulo="[05] BANDEJA DE ENTRADA" titulo="Pedidos de acesso" variante="aberto" :link="secao ? undefined : { para: { name: 'admin-acessos' }, texto: 'Ver todos →' }">
            <div class="bandeja">
              <article v-for="p in pedidos" :key="p.id" class="pedido">
                <header><span>Requerimento de acesso</span><span>Nº {{ String(p.id).padStart(4, '0') }}</span></header>
                <dl>
                  <div><dt>Nome</dt><dd><strong>{{ p.nome }}</strong></dd></div>
                  <div><dt>Perfil solicitado</dt><dd>{{ p.tag }}</dd></div>
                  <div v-if="p.loginGitHub"><dt>GitHub</dt><dd>@{{ p.loginGitHub }}</dd></div>
                </dl>
                <span class="situacao" :class="{ pendente: p.pendente }">{{ p.pendente ? 'Pendente' : 'Analisado' }}</span>
              </article>
              <EstadoVazio v-if="!pedidos.length" compacto titulo="Nenhum pedido de acesso." />
            </div>
          </CartaoSecao>

          <CartaoSecao v-if="!secao" class="livro" rotulo="[06] LIVRO DE REGISTRO" titulo="Projetos" variante="caderno" :link="{ para: { name: 'admin-projetos' }, texto: 'Gerenciar →' }">
            <div v-if="dado.projetos.length" class="tabela">
              <table>
                <caption class="sr-only">Registro de projetos</caption>
                <thead><tr><th>Nº</th><th>Projeto</th><th>Líder</th><th>Orientador</th><th>Status</th><th>Membros</th></tr></thead>
                <tbody><tr v-for="p in dado.projetos" :key="p.id">
                  <td>{{ String(p.id).padStart(2, '0') }}</td>
                  <td><RouterLink :to="{ name: 'projeto', params: { id: p.id } }"><i :style="{ background: p.cor }" />{{ p.nome }}</RouterLink></td>
                  <td>{{ nomes.get(p.idLead) ?? '—' }}</td><td>{{ nomes.get(p.idOrientador) ?? '—' }}</td>
                  <td><PilulaStatus :status="p.status" /></td><td>{{ p.membros.length }}</td>
                </tr></tbody>
              </table>
            </div>
            <EstadoVazio v-else compacto titulo="Nenhum projeto cadastrado." />
          </CartaoSecao>
        </div>

        <div v-if="secao !== 'acessos'" class="coluna">
          <CartaoSecao v-if="!secao" rotulo="[07] ATALHOS" variante="aberto">
            <nav aria-label="Atalhos de gestão" class="gavetas">
              <RouterLink v-for="a in atalhos" :key="a.rota" :to="{ name: a.rota }"><span>{{ a.nome }}</span></RouterLink>
            </nav>
          </CartaoSecao>
          <CartaoSecao rotulo="[08] IMPRESSORA DE LOGS" variante="aberto" :link="secao ? undefined : { para: { name: 'admin-logs' }, texto: 'Abrir →' }">
            <div class="impressora">
              <ol v-if="dado.logs.length" class="bobina">
                <li v-for="(log, i) in secao ? dado.logs : dado.logs.slice(0, 6)" :key="i">
                  <time :datetime="log.em">{{ dataHora(log.em) }}</time>
                  <span><strong>{{ log.autor }}</strong> · {{ log.acao }}</span>
                </li>
              </ol>
              <EstadoVazio v-else compacto titulo="Nenhuma operação registrada." />
            </div>
          </CartaoSecao>
          <CartaoSecao v-if="!secao" rotulo="[09] QUADRO DE EQUIPES" variante="aberto" :link="{ para: { name: 'admin-equipes' }, texto: 'Gerenciar →' }">
            <div class="quadro">
              <RouterLink v-for="e in dado.equipes" :key="e.id" :to="{ name: 'admin-equipes-editar', params: { id: e.id } }" :style="{ '--equipe': e.cor }">
                <strong>{{ e.nome }}</strong><span>{{ e.idsMembros.length }} membros</span>
              </RouterLink>
              <EstadoVazio v-if="!dado.equipes.length" compacto titulo="Nenhuma equipe cadastrada." />
            </div>
          </CartaoSecao>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.painel { display: grid; gap: 24px; container-type: inline-size; min-width: 0; }
.busca { position: relative; width: min(220px, 100%); }
.busca :deep(kbd) { display: none; }
.resultados { position: absolute; inset: calc(100% + 5px) 0 auto; z-index: 3; max-height: 280px; overflow: auto; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; box-shadow: var(--shadow-hard); }
.resultados a, .resultados p { display: block; padding: 10px; font-size: 13px; }
.resultados small { display: block; color: var(--text-muted); }
.painel a { color: inherit; text-decoration: none; }
.resultados a:hover, .resultados a:focus-visible { background: var(--ink); }
.contadores { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.grade { display: grid; grid-template-columns: minmax(0, 2.35fr) minmax(245px, 1fr); gap: 22px; }
.grade.unica { grid-template-columns: 1fr; }
.coluna { display: grid; align-content: start; gap: 22px; min-width: 0; }
.bandeja, .gavetas, .quadro { display: grid; gap: 10px; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 12px; box-shadow: var(--shadow-hard); }
.pedido { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 10px 16px; padding: 14px; border-top: 2px dashed var(--border); border-radius: 4px 4px 8px 8px; background: var(--surface-2); box-shadow: var(--shadow-hard); }
.pedido header, dt, th, .situacao, .gavetas span { font: 700 10px var(--font-mono); letter-spacing: .07em; text-transform: uppercase; }
.pedido header { grid-column: 1 / -1; display: flex; justify-content: space-between; gap: 8px; color: var(--text-muted); }
dl { display: flex; flex-wrap: wrap; gap: 8px 16px; margin: 0; }
dl div { flex: 1 1 90px; padding-bottom: 4px; border-bottom: 1px solid var(--border); }
dt, th { color: var(--text-muted); }
dd { margin: 3px 0 0; font-size: 13px; overflow-wrap: anywhere; }
.situacao { padding: 8px 10px; border-radius: 5px; background: var(--tile); }
.pendente { background: var(--brand-orange); color: #201007; }
.livro :deep(.corpo) { padding: 0; }
.tabela { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 12px; }
td, th { padding: 12px 9px; text-align: left; border-bottom: 1px solid var(--border); }
td:first-child { color: var(--text-subtle); font-family: var(--font-mono); }
td:last-child, th:last-child { text-align: right; }
td a { font-weight: 700; }
td a:hover { text-decoration: underline; }
td i { display: inline-block; width: 7px; height: 7px; margin-right: 6px; border-radius: 2px; }
.gavetas { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gavetas a { display: grid; place-items: center; gap: 8px; padding: 12px 4px 8px; background: var(--surface-2); border-radius: 6px; box-shadow: var(--shadow-hard); }
.gavetas span { padding: 4px; background: var(--tile); border: 1px solid #51545c; border-radius: 3px; text-align: center; }
.gavetas a::after { content: ''; width: 35%; height: 5px; background: #898d96; border-radius: 4px; box-shadow: 0 2px #43464d; }
.gavetas a:hover span { color: var(--accent); }
.impressora { padding: 0 9px 6px; border-top: 12px solid var(--surface-2); background: var(--surface); border-radius: 9px 9px 0 0; box-shadow: var(--shadow-hard); }
.bobina { list-style: none; padding: 0 12px 16px; margin: 0; border-inline: 6px dotted var(--ink); background: #1a2621; }
.bobina li { display: grid; gap: 4px; padding: 10px 0; border-bottom: 1px dashed #35423c; font: 11px/1.5 var(--font-mono); overflow-wrap: anywhere; }
.bobina time { color: #9fc6ae; }
.quadro { grid-template-columns: repeat(auto-fit, minmax(70px, 1fr)); padding-top: 28px; background: linear-gradient(#352b23, #352b23) center 12px / 92% 7px no-repeat, #211b16; }
.quadro a { display: grid; align-content: center; position: relative; gap: 4px; text-align: center; min-height: 68px; padding: 10px 4px 6px; border-radius: 6px; background: var(--equipe); color: white; text-shadow: 0 1px 3px #252020; font-size: 12px; overflow-wrap: anywhere; transform: rotate(-3deg); box-shadow: var(--shadow-hard); }
.quadro a:nth-child(even) { transform: rotate(3deg); }
.quadro a::before { content: ''; position: absolute; top: -14px; left: 50%; width: 2px; height: 19px; background: #8d8379; }
.quadro span { font: 10px var(--font-mono); }
@container (max-width: 760px) { .grade { grid-template-columns: 1fr; } }
@container (max-width: 600px) { .contadores { grid-template-columns: repeat(2, minmax(0, 1fr)); } .pedido { grid-template-columns: 1fr; } .situacao { justify-self: start; } }
</style>
