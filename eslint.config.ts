import { globalIgnores } from 'eslint/config'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import pluginVue from 'eslint-plugin-vue'
import pluginOxlint from 'eslint-plugin-oxlint'
import skipFormatting from 'eslint-config-prettier/flat'

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{vue,ts,mts,tsx}'],
  },

  globalIgnores(['**/dist/**', '**/dist-ssr/**', '**/coverage/**']),

  ...pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    name: 'app/regras',
    rules: {
      // Nomes de componentes definidos na especificação do FabricaHUB.
      'vue/multi-word-component-names': ['error', { ignores: ['Carimbo', 'Cracha'] }],
      // Fluxo obrigatório: Component -> Controller -> Repository -> API.
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['@/mocks/*', '**/mocks/*'], message: 'Só repositories podem importar mocks.' },
            { group: ['axios', '@/api/*'], message: 'Só repositories podem usar Axios/API.' },
          ],
        },
      ],
    },
  },
  {
    name: 'app/camada-de-dados',
    files: ['src/repositories/**', 'src/api/**'],
    rules: { 'no-restricted-imports': 'off' },
  },

  ...pluginOxlint.buildFromOxlintConfigFile('.oxlintrc.json'),

  skipFormatting,
)
