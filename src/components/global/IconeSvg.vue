<script setup lang="ts">
export type NomeIcone =
  | 'dashboard'
  | 'tarefas'
  | 'projetos'
  | 'mensagens'
  | 'equipes'
  | 'membros'
  | 'noticias'
  | 'revisoes'
  | 'acessos'
  | 'cadastros'
  | 'tags'
  | 'logs'
  | 'arquivos'
  | 'permissoes'
  | 'sair'
  | 'busca'
  | 'sino'
  | 'relogio'
  | 'info'
  | 'voltar'
  | 'copiar'
  | 'alerta'
  | 'github'
  | 'linkedin'
  | 'globo'
  | 'cadeado'
  | 'externo'
  | 'mais'
  | 'fechar'
  | 'figma'

withDefaults(defineProps<{ nome: NomeIcone; tamanho?: number }>(), { tamanho: 18 })

// Ícones de traço (viewBox 24×24), desenhados com stroke="currentColor".
const caminhos: Record<NomeIcone, string> = {
  dashboard: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
  tarefas: 'M4 4h16v16H4zM8.5 12l2.5 2.5 4.5-5',
  projetos: 'M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.5h8.5A1.5 1.5 0 0 1 21 9v9.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z',
  mensagens: 'M4 5h16v11H9l-5 4z',
  equipes: 'M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM2.5 20a6.5 6.5 0 0 1 13 0M16 4.3a3.5 3.5 0 0 1 0 6.4M18.5 14.5A6.5 6.5 0 0 1 21.5 20',
  membros: 'M3 5h18v14H3zM9 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5.5 16a3.5 3.5 0 0 1 7 0M15 9.5h3.5M15 13h3.5',
  noticias: 'M5 4h12v16H6.5A1.5 1.5 0 0 1 5 18.5zM17 8h2v10.5a1.5 1.5 0 0 1-3 0M8 8h6M8 11.5h6M8 15h4',
  revisoes: 'M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6zM9 12l2 2 4-4',
  acessos: 'M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6',
  cadastros: 'M4 6h16M4 12h16M4 18h10',
  tags: 'M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8a1.4 1.4 0 0 1 0 2l-7 7a1.4 1.4 0 0 1-2 0zM8 8h.01',
  logs: 'M5 7l5 5-5 5M12 18h7',
  arquivos: 'M12 15V4M7.5 8.5L12 4l4.5 4.5M4 15v4.5h16V15',
  permissoes: 'M5 11h14v10H5zM8 11V7.5a4 4 0 0 1 8 0V11',
  sair: 'M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10',
  busca: 'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM20 20l-4.8-4.8',
  sino: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20.5a2 2 0 0 0 4 0',
  relogio: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  info: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01',
  voltar: 'M19 12H5M11 6l-6 6 6 6',
  copiar: 'M9 9h11v11H9zM5 15H4V4h11v1',
  alerta: 'M12 3l9.5 17h-19zM12 10v4M12 17h.01',
  github:
    'M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21',
  linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  globo: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18',
  cadeado: 'M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3',
  externo: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  mais: 'M12 5v14M5 12h14',
  fechar: 'M6 6l12 12M18 6L6 18',
  figma:
    'M9 3h3v6H9a3 3 0 0 1 0-6zM12 3h3a3 3 0 0 1 0 6h-3zM9 9h3v6H9a3 3 0 0 1 0-6zM15 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zM9 15h3v3a3 3 0 1 1-3-3z',
}
</script>

<template>
  <svg
    :width="tamanho"
    :height="tamanho"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path :d="caminhos[nome]" />
  </svg>
</template>
