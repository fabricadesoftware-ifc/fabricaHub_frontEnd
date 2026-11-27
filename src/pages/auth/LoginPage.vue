<script setup lang="ts">
import AuthHero from '@/components/auth/AuthHero.vue'
import Cracha from '@/components/auth/Cracha.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import { useLogin } from '@/composables/useLogin'
import AuthLayout from '@/layouts/AuthLayout.vue'
import { LINK_COORDENACAO } from '@/utils/contato'

const { entrando, entrarComGitHub } = useLogin()

const fichas = [
  { rotulo: '[01] TAREFAS', texto: 'Do "a fazer" à revisão' },
  { rotulo: '[02] PROJETOS', texto: 'Membros, galeria e status' },
  { rotulo: '[03] EQUIPES', texto: 'Quem está em cada time' },
  { rotulo: '[04] NOTÍCIAS', texto: 'Avisos e eventos da Fábrica' },
]

// Código de barras decorativo do rodapé do crachá: [x, largura]
const barras = [1, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 3].reduce<[number, number][]>(
  (acc, largura) => {
    const ultimo = acc.at(-1)
    const x = ultimo ? ultimo[0] + ultimo[1] + 1 : 0
    acc.push([x, largura])
    return acc
  },
  [],
)
</script>

<template>
  <AuthLayout>
    <AuthHero texto="Acompanhe o que está em andamento, converse com a equipe e veja as novidades da Fábrica.">
      <ul class="mini-fichas">
        <li v-for="ficha in fichas" :key="ficha.rotulo" class="mini-ficha">
          <span class="mini-rotulo">{{ ficha.rotulo }}</span>
          <span class="mini-texto">{{ ficha.texto }}</span>
        </li>
      </ul>
    </AuthHero>

    <div class="lado">
      <Cracha selo="IFC" rotulo="[01] ENTRAR">
        <template #titulo>Entre no Fabrica<span class="hub">HUB</span></template>

        <p class="texto">O sistema interno da Fábrica de Software. Use sua conta GitHub para continuar.</p>

        <p class="aviso">
          <IconeSvg nome="permissoes" :tamanho="14" class="aviso-icone" />
          Acesso restrito a membros autorizados da Fábrica.
        </p>

        <div class="acao">
          <BotaoBase bloco :disabled="entrando" @click="entrarComGitHub">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
            {{ entrando ? 'Redirecionando para o GitHub…' : 'Entrar com GitHub →' }}
          </BotaoBase>
          <p class="nota">Você será redirecionado para o GitHub.</p>
        </div>

        <template #rodape>
          <div class="rodape-cracha">
            <svg class="codigo-barras" width="58" height="18" viewBox="0 0 58 18" aria-hidden="true">
              <rect v-for="([x, largura], i) in barras" :key="i" :x="x" y="0" :width="largura" height="18" />
            </svg>
            <span class="numero">Nº — · ARAQUARI</span>
          </div>
        </template>
      </Cracha>

      <p class="ajuda">Precisa de ajuda? <a :href="LINK_COORDENACAO">Fale com a coordenação</a></p>
    </div>
  </AuthLayout>
</template>

<style scoped>
.mini-fichas {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px 14px;
  margin: 18px 0 0;
  padding: 0;
  list-style: none;
}

.mini-ficha {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: var(--surface);
  border-radius: 0 10px 10px 10px;
  box-shadow: var(--shadow-hard);
}

/* Aba da mini ficha */
.mini-ficha::before {
  content: '';
  position: absolute;
  left: 0;
  bottom: 100%;
  width: 64px;
  height: 10px;
  background: inherit;
  border-radius: 6px 6px 0 0;
}

.mini-rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .1em;
  color: var(--accent);
}

.mini-texto {
  font-size: 13px;
  color: var(--text-muted);
}

.lado {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
}

.hub {
  color: var(--brand-orange);
}

.texto {
  font-size: 13px;
  color: var(--text-muted);
}

.aviso {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--tile);
  font-size: 12px;
  color: var(--text-muted);
}

.aviso-icone {
  flex-shrink: 0;
  color: var(--text-subtle);
}

.acao {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.nota {
  font-size: 11.5px;
  text-align: center;
  color: var(--text-subtle);
}

.rodape-cracha {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.codigo-barras {
  fill: var(--text-muted);
}

.numero {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: .14em;
  color: var(--text-subtle);
}

.ajuda {
  font-size: 12.5px;
  color: var(--text-muted);
  text-align: center;
}

.ajuda a {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}

.ajuda a:hover {
  text-decoration: underline;
}

@media (max-width: 599px) {
  .mini-fichas {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
