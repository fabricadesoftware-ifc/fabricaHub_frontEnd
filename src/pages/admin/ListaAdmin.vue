<script setup lang="ts">
import { computed, ref } from 'vue'
import PaginaGestao from '@/components/global/PaginaGestao.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CampoBusca from '@/components/global/CampoBusca.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import CartaoSecao from '@/components/global/CartaoSecao.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import PilulaStatus from '@/components/global/PilulaStatus.vue'
import { fontesGestao as fontes, useCargaGestao } from '@/composables/useGestao'
import { papelPrincipal, papeisDoUsuario } from '@/utils/permissoes'

const titulos = { membros: 'Membros', projetos: 'Projetos', equipes: 'Equipes', noticias: 'Notícias' }
const criar = { projetos: 'Novo projeto', equipes: 'Nova equipe', noticias: 'Nova notícia' }
const props = defineProps<{ area: keyof typeof titulos }>()
interface Linha {
  id: number
  nome: string
  detalhe: string
  status: string
  papel?: string
  cor?: string
  foto?: string | null
}
const busca = ref('')
const status = ref('')
const papel = ref('')
const { dado, carregando, erro, carregar } = useCargaGestao<Linha[]>(async () => {
  switch (props.area) {
    case 'membros': {
      const [pessoas, projetos] = await Promise.all([fontes.membros(), fontes.projetos()])
      return pessoas.map((u) => {
        const role = papelPrincipal(papeisDoUsuario(u, projetos))
        const papel = { admin: 'Admin', lider: 'Líder', membro: 'Membro' }[role]
        return {
          id: u.id,
          nome: u.nomeCompleto,
          detalhe: ['@' + u.usuario, papel, u.funcao, ...(u.tags ?? [])].join(' · '),
          status: u.ativo ? 'Ativo' : 'Inativo',
          papel,
          cor: u.cor,
          foto: u.foto,
        }
      })
    }
    case 'projetos': {
      const [projetos, membros] = await Promise.all([fontes.projetos(), fontes.membros()])
      return projetos.map((p) => ({
        id: p.id,
        nome: p.nome,
        detalhe: 'Líder · ' + (membros.find((m) => m.id === p.idLead)?.nome ?? '—'),
        status: p.status,
      }))
    }
    case 'equipes':
      return (await fontes.equipes()).map((e) => ({
        id: e.id,
        nome: e.nome,
        detalhe: e.idsProjetos.length + ' projetos vinculados',
        status: e.idsMembros.length + ' membros',
      }))
    case 'noticias':
      return (await fontes.noticias()).map((n) => ({
        id: n.id,
        nome: n.titulo,
        detalhe: n.autor + ' · ' + n.data.split('-').reverse().join('/'),
        status: n.categoria,
      }))
  }
})
const linhas = computed(() =>
  (dado.value ?? []).filter(
    (l) =>
      (!status.value || status.value === l.status) &&
      (!papel.value || papel.value === l.papel) &&
      (l.nome + ' ' + l.detalhe).toLocaleLowerCase().includes(busca.value.trim().toLocaleLowerCase()),
  ),
)
</script>
<template>
  <PaginaGestao :titulo="titulos[area]" rotulo="GESTÃO" :carregando="carregando" :erro="erro" @recarregar="carregar">
    <template v-if="area !== 'membros'" #acoes>
      <BotaoBase :para="{ name: 'admin-' + area + '-criar' }">{{ criar[area] }}</BotaoBase>
    </template>
    <CartaoSecao rotulo="[01] CADASTRO" :titulo="titulos[area]" variante="caderno" :detalhe="linhas.length + ' registros'">
      <div class="filtros">
        <CampoBusca v-model="busca" :placeholder="'Buscar ' + titulos[area].toLowerCase() + '…'" />
        <template v-if="area === 'membros'">
          <CampoSelect v-model="status" label="Status" vazio="Todos" :opcoes="['Ativo', 'Inativo']" />
          <CampoSelect v-model="papel" label="Papel" vazio="Todos" :opcoes="['Admin', 'Líder', 'Membro']" />
        </template>
      </div>
      <EstadoVazio v-if="!linhas.length" titulo="Nenhum registro encontrado." />
      <div v-for="l in linhas" :key="l.id" class="linha">
        <AvatarPessoa v-if="area === 'membros'" :nome="l.nome" :foto="l.foto" :cor="l.cor" />
        <div class="identidade">
          <strong>{{ l.nome }}</strong>
          <small>{{ l.detalhe }}</small>
        </div>
        <PilulaStatus :status="l.status" />
        <RouterLink class="link" :aria-label="'Editar ' + l.nome" :to="{ name: 'admin-' + area + '-editar', params: { id: l.id } }">
          Editar →
        </RouterLink>
      </div>
    </CartaoSecao>
  </PaginaGestao>
</template>
