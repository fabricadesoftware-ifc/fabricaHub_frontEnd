import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
import { useAuth } from '@/composables/useAuth'
import { podeAcessar } from '@/utils/permissoes'
import { useAuthStore } from '@/stores/auth'
import { useProjetosStore } from '@/stores/projetos'
import type { Papel } from '@/utils/tipos'

declare module 'vue-router' {
  interface RouteMeta {
    /** Papéis que podem acessar. Sem `roles`, qualquer usuário logado acessa. */
    roles?: Papel[]
    /** Exige liderar o projeto de `:id` (admin passa direto). */
    liderDoProjeto?: boolean
    publica?: boolean
    /** Exige sessão autorizada, mas a própria página faz a carga dos dados (tela de carregamento). */
    carregaDados?: boolean
  }
}



const LIDER: Papel[] = ['lider', 'admin']
const ADMIN: Papel[] = ['admin']

const rotasAdmin: RouteRecordRaw[] = [
  { path: '', name: 'admin-dashboard', component: () => import('@/pages/admin/PainelAdmin.vue') },
  { path: 'acessos', name: 'admin-acessos', component: () => import('@/pages/admin/AcessosAdmin.vue') },
  { path: 'membros', name: 'admin-membros', component: () => import('@/pages/members/MembrosPage.vue'), props: { gestao: true } },
  { path: 'membros/:id/editar', name: 'admin-membros-editar', component: () => import('@/pages/admin/MembroAdmin.vue') },
  { path: 'projetos', name: 'admin-projetos', component: () => import('@/pages/projects/ProjetosPage.vue'), props: { gestao: true } },
  { path: 'projetos/novo', name: 'admin-projetos-criar', component: () => import('@/pages/admin/ProjetoAdmin.vue') },
  { path: 'projetos/:id/editar', name: 'admin-projetos-editar', component: () => import('@/pages/admin/ProjetoAdmin.vue') },
  { path: 'equipes', name: 'admin-equipes', component: () => import('@/pages/teams/EquipesPage.vue'), props: { gestao: true } },
  { path: 'equipes/nova', name: 'admin-equipes-criar', component: () => import('@/pages/admin/EquipeAdmin.vue') },
  { path: 'equipes/:id/editar', name: 'admin-equipes-editar', component: () => import('@/pages/admin/EquipeAdmin.vue') },
  { path: 'tarefas', name: 'admin-tarefas', component: () => import('@/pages/tasks/TarefasPage.vue'), props: { gestao: true } },
  { path: 'noticias', name: 'admin-noticias', component: () => import('@/pages/news/NoticiasPage.vue'), props: { gestao: true } },
  { path: 'noticias/nova', name: 'admin-noticias-criar', component: () => import('@/pages/admin/NoticiaAdmin.vue') },
  { path: 'noticias/:id/editar', name: 'admin-noticias-editar', component: () => import('@/pages/admin/NoticiaAdmin.vue') },
  { path: 'cadastros', name: 'admin-cadastros', component: () => import('@/pages/admin/CadastrosAdmin.vue') },
  { path: 'tags', name: 'admin-tags', component: () => import('@/pages/admin/TagsAdmin.vue') },
  { path: 'logs', name: 'admin-logs', component: () => import('@/pages/admin/LogsAdmin.vue') },
  { path: 'arquivos', name: 'admin-arquivos', component: () => import('@/pages/admin/ArquivosAdmin.vue') },
  { path: 'permissoes', name: 'admin-permissoes', component: () => import('@/pages/admin/PermissoesAdmin.vue') },
]

const routes: RouteRecordRaw[] = [
  // Públicas
  { path: '/login', name: 'login', component: () => import('@/pages/auth/LoginPage.vue'), meta: { publica: true } },
  { path: '/redirecionando', name: 'redirecionando', component: () => import('@/pages/auth/RedirecionandoPage.vue'), meta: { publica: true } },
  {
    path: '/carregando',
    name: 'carregando',
    component: () => import('@/pages/auth/CarregandoPage.vue'),
    meta: { carregaDados: true },
  },
  { path: '/403', name: 'acesso-negado', component: () => import('@/pages/auth/AcessoNegadoPage.vue'), meta: { publica: true } },

  {
    path: '/',
    component: AppLayout,
    children: [
      // Todos
      { path: '', name: 'dashboard', component: () => import('@/pages/dashboard/DashboardPage.vue') },
      { path: 'tarefas', name: 'tarefas', component: () => import('@/pages/tasks/TarefasPage.vue') },
      { path: 'tarefas/nova', name: 'tarefa-nova', component: () => import('@/pages/tasks/NovaTarefaPage.vue'), meta: { roles: LIDER } },
      { path: 'tarefas/:id', name: 'tarefa', component: () => import('@/pages/tasks/TarefaDetalhePage.vue') },
      { path: 'projetos', name: 'projetos', component: () => import('@/pages/projects/ProjetosPage.vue') },
      { path: 'projetos/:id', name: 'projeto', component: () => import('@/pages/projects/ProjetoDetalhePage.vue') },
      {
        path: 'projetos/:id/tarefas',
        name: 'projeto-tarefas',
        component: () => import('@/pages/tasks/TarefasProjetoPage.vue'),
        meta: { roles: LIDER, liderDoProjeto: true },
      },
      {
        path: 'projetos/:id/membros',
        name: 'projeto-membros',
        component: () => import('@/pages/projects/MembrosProjetoPage.vue'),
        meta: { roles: LIDER, liderDoProjeto: true },
      },
      {
        path: 'projetos/:id/editar',
        name: 'projeto-editar',
        component: () => import('@/pages/projects/EditarProjetoPage.vue'),
        meta: { roles: LIDER, liderDoProjeto: true },
      },
      {
        path: 'projetos/:id/galeria',
        name: 'projeto-galeria',
        component: () => import('@/pages/projects/GaleriaProjetoPage.vue'),
        meta: { roles: LIDER, liderDoProjeto: true },
      },
      { path: 'equipes', name: 'equipes', component: () => import('@/pages/teams/EquipesPage.vue') },
      { path: 'equipes/:id', name: 'equipe', component: () => import('@/pages/teams/EquipeDetalhePage.vue') },
      { path: 'mensagens', name: 'mensagens', component: () => import('@/pages/messages/MensagensPage.vue') },
      { path: 'noticias', name: 'noticias', component: () => import('@/pages/news/NoticiasPage.vue') },
      { path: 'noticias/:id', name: 'noticia', component: () => import('@/pages/news/NoticiaDetalhePage.vue') },
      { path: 'membros', name: 'membros', component: () => import('@/pages/members/MembrosPage.vue') },
      { path: 'membros/:id', name: 'membro', component: () => import('@/pages/members/MembroDetalhePage.vue') },
      { path: 'perfil', name: 'perfil', component: () => import('@/pages/members/PerfilPage.vue') },
      // Líder
      { path: 'revisoes', name: 'revisoes', component: () => import('@/pages/reviews/RevisoesPage.vue'), meta: { roles: LIDER } },
      // Admin
      { path: 'admin', meta: { roles: ADMIN }, children: rotasAdmin },
    ],
  },

  { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: () => import('@/pages/auth/NaoEncontradaPage.vue'), meta: { publica: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

let atalhoDevAplicado = false

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  const { aplicarAtalhoDev, garantirCarregado } = useAuth()
  if (!atalhoDevAplicado) {
    atalhoDevAplicado = true
    await aplicarAtalhoDev()
  }
  if (to.meta.publica) return true
  if (!auth.logado) return { name: 'login' }
  if (!auth.autorizado) return { name: 'acesso-negado' }
  if (to.meta.carregaDados) return true
  await garantirCarregado()
  if (to.name === 'dashboard' && auth.usuario?.isSuper) return { name: 'admin-dashboard' }
  if (!podeAcessar(to, auth.usuario, useProjetosStore().lista)) return { name: 'acesso-negado' }
  return true
})

export default router
