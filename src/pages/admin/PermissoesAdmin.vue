<script setup lang="ts">
const papeis = ['Membro', 'Líder', 'Admin']
const grupos = [
  {
    nome: 'Tarefas',
    itens: [
      ['Ver tarefas do projeto', '✓', '✓', '✓'],
      ['Mover as próprias tarefas até Em revisão', 'Própria', 'Própria', 'Própria'],
      ['Mover qualquer tarefa do projeto', '—', 'Projeto', 'Projeto¹'],
      ['Criar tarefas e revisar entregas', '—', 'Projeto', 'Projeto¹'],
      ['Ver todas as tarefas da Fábrica', '—', '—', '✓'],
    ],
  },
  {
    nome: 'Projetos',
    itens: [
      ['Ver projetos e detalhes', '✓', '✓', '✓'],
      ['Editar dados do projeto', '—', 'Projeto', '✓'],
      ['Gerenciar membros e galeria', '—', 'Projeto', '✓'],
      ['Criar projetos e atribuir liderança', '—', '—', '✓'],
    ],
  },
  {
    nome: 'Pessoas e equipes',
    itens: [
      ['Ver membros e equipes', '✓', '✓', '✓'],
      ['Editar o próprio perfil', '✓', '✓', '✓'],
      ['Editar cadastro de outros membros', '—', '—', '✓'],
      ['Criar e editar equipes', '—', '—', '✓'],
    ],
  },
  {
    nome: 'Comunicação',
    itens: [
      ['Enviar mensagens', '✓', '✓', '✓'],
      ['Ler notícias', '✓', '✓', '✓'],
      ['Publicar notícias', '—', '—', '✓'],
    ],
  },
  {
    nome: 'Sistema',
    itens: [
      ['Autorizar acessos', '—', '—', '✓'],
      ['Administrar tags de acesso', '—', '—', '✓'],
      ['Gerenciar cadastros', '—', '—', '✓'],
      ['Consultar e exportar auditoria', '—', '—', '✓'],
      ['Enviar e gerenciar arquivos', '—', '—', '✓'],
      ['Consultar permissões', '—', '—', '✓'],
    ],
  },
]
const linhas = grupos.flatMap((g) => g.itens)
</script>
<template>
  <div class="sistema">
    <header>
      <div>
        <small>&lt; REGIMENTO /&gt; · O QUE CADA PAPEL PODE FAZER</small>
        <h1>Permissões<span>_</span></h1>
      </div>
      <span class="selo">Somente leitura</span>
    </header>
    <div class="resumo-papeis">
      <section v-for="(p, i) in papeis" :key="p" class="painel-sis">
        <small
          ><strong>{{ p }}</strong
          ><b>{{ linhas.filter((l) => l[i + 1] !== '—').length }}/{{ linhas.length }}</b></small
        >
        <p>
          {{
            [
              'Comunidade, tarefas próprias e perfil.',
              'Gestão dos projetos que lidera.',
              'Administração da Fábrica e do sistema.',
            ][i]
          }}
        </p>
      </section>
    </div>
    <section class="painel-sis rolar">
      <table class="matriz">
        <thead>
          <tr>
            <th>Permissão</th>
            <th v-for="p in papeis" :key="p">{{ p }}</th>
          </tr>
        </thead>
        <tbody v-for="(g, i) in grupos" :key="g.nome">
          <tr>
            <th colspan="4" class="indice">[0{{ i + 1 }}] {{ g.nome }}</th>
          </tr>
          <tr v-for="l in g.itens" :key="l[0]">
            <td>{{ l[0] }}</td>
            <td v-for="(v, j) in l.slice(1)" :key="j">
              <span
                :class="{ ok: v === '✓', selo: v !== '✓' && v !== '—' }"
                :aria-label="v === '✓' ? 'Permitido' : v === '—' ? 'Sem permissão' : v"
                >{{ v }}</span
              >
            </td>
          </tr>
        </tbody>
      </table>
      <p class="nota">
        Projeto indica os projetos liderados. ¹ Ações de liderança exigem que o administrador também
        lidere o projeto.
      </p>
    </section>
  </div>
</template>

<style src="@/styles/sistema.css"></style>
