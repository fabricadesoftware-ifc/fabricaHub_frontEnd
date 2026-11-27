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
  { path: 'acessos', name: 'admin-acessos', component: () => import('@/pages/admin/AdminAcessosPage.vue') },
  { path: 'membros', name: 'admin-membros', component: () => import('@/pages/admin/AdminMembrosPage.vue') },
  { path: 'projetos', name: 'admin-projetos', component: () => import('@/pages/admin/AdminProjetosPage.vue') },
  { path: 'equipes', name: 'admin-equipes', component: () => import('@/pages/admin/AdminEquipesPage.vue') },
  { path: 'tarefas', name: 'admin-tarefas', component: () => import('@/pages/admin/AdminTarefasPage.vue') },
  { path: 'noticias', name: 'admin-noticias', component: () => import('@/pages/admin/AdminNoticiasPage.vue') },
  { path: 'cadastros', name: 'admin-cadastros', component: () => import('@/pages/admin/AdminCadastrosPage.vue') },
  { path: 'tags', name: 'admin-tags', component: () => import('@/pages/admin/AdminTagsPage.vue') },
  { path: 'logs', name: 'admin-logs', component: () => import('@/pages/admin/AdminLogsPage.vue') },
  { path: 'arquivos', name: 'admin-arquivos', component: () => import('@/pages/admin/AdminArquivosPage.vue') },
  { path: 'permissoes', name: 'admin-permissoes', component: () => import('@/pages/admin/AdminPermissoesPage.vue') },
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
        component: () => import('@/pages/projects/ProjetoTarefasPage.vue'),
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
      { path: 'revisoes', name: 'revisoes', component: () => import('@/pages/tasks/RevisoesPage.vue'), meta: { roles: LIDER } },
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
  if (!podeAcessar(to, auth.usuario, useProjetosStore().lista)) return { name: 'acesso-negado' }
  return true
})

export default router
