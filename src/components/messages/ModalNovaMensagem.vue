<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import CampoSelect from '@/components/global/CampoSelect.vue'
import GrupoPilulas from '@/components/global/GrupoPilulas.vue'
import IconeSvg from '@/components/global/IconeSvg.vue'
import type { TipoConversa } from '@/utils/tipos'

type Opcao = { valor: string; rotulo: string }

/**
 * Nova mensagem para um membro, uma equipe ou um projeto.
 * Usa <dialog> nativo: foco preso no modal, Esc fecha e o foco volta para quem abriu.
 */
const props = defineProps<{
  destinatarios: Record<TipoConversa, Opcao[]>
  /** Destinatário já escolhido ao abrir (ex.: "Enviar mensagem" no perfil). */
  inicial?: { tipo: TipoConversa; idAlvo: number } | null
  enviando: boolean
  erro: string
}>()

const emit = defineEmits<{ enviar: [tipo: TipoConversa, idAlvo: number, texto: string] }>()
const aberto = defineModel<boolean>({ required: true })

const dialogo = useTemplateRef<HTMLDialogElement>('dialogo')
const tipo = ref<TipoConversa>('direta')
const alvo = ref('')
const texto = ref('')

const opcoesTipo: { valor: TipoConversa; rotulo: string }[] = [
  { valor: 'direta', rotulo: 'Membro' },
  { valor: 'equipe', rotulo: 'Equipe' },
  { valor: 'projeto', rotulo: 'Projeto' },
]

const rotuloAlvo = computed(() => ({ direta: 'Para quem', equipe: 'Equipe', projeto: 'Projeto' })[tipo.value])
const podeEnviar = computed(() => !!alvo.value && !!texto.value.trim() && !props.enviando)

watch(aberto, (valor) => {
  if (valor) {
    tipo.value = props.inicial?.tipo ?? 'direta'
    alvo.value = props.inicial ? String(props.inicial.idAlvo) : ''
    texto.value = ''
    dialogo.value?.showModal()
  } else {
    dialogo.value?.close()
  }
})

// Trocar o tipo limpa o destinatário (as listas são diferentes).
watch(tipo, (_novo, antigo) => {
  if (antigo && !(props.inicial && props.inicial.tipo === tipo.value)) alvo.value = ''
})

function enviar() {
  if (podeEnviar.value) emit('enviar', tipo.value, Number(alvo.value), texto.value.trim())
}
</script>

<template>
  <dialog ref="dialogo" class="modal" aria-labelledby="titulo-nova-mensagem" @close="aberto = false">
    <form class="conteudo" method="dialog" @submit.prevent="enviar">
      <header class="cabecalho">
        <h2 id="titulo-nova-mensagem">Nova mensagem</h2>
        <button type="button" class="fechar" aria-label="Fechar" @click="aberto = false">
          <IconeSvg nome="fechar" :tamanho="16" />
        </button>
      </header>

      <GrupoPilulas v-model="tipo" :opcoes="opcoesTipo" label="Tipo de destinatário" />
      <CampoSelect
        :key="tipo"
        v-model="alvo"
        :label="rotuloAlvo"
        disposicao="cima"
        :opcoes="destinatarios[tipo]"
        vazio="Escolha…"
      />

      <label class="campo">
        <span class="rotulo">Mensagem</span>
        <textarea v-model="texto" rows="5" placeholder="Escreva a mensagem" @keydown.ctrl.enter="enviar" />
      </label>

      <p v-if="erro" class="erro" role="alert">{{ erro }}</p>

      <footer class="rodape">
        <BotaoBase variante="secundario" @click="aberto = false">Cancelar</BotaoBase>
        <BotaoBase tipo="submit" :disabled="!podeEnviar">{{ enviando ? 'Enviando…' : 'Enviar' }}</BotaoBase>
      </footer>
    </form>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(520px, calc(100vw - 32px));
  padding: 0;
  border: 1px solid var(--border);
  border-radius: var(--radius-menu);
  background: var(--surface);
  color: var(--text);
  box-shadow: var(--shadow-hard);
}

.modal::backdrop {
  background: rgba(0, 0, 0, .6);
}

.modal[open] {
  animation: surgir var(--dur-media) var(--ease-saida);
}

.conteudo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
}

.cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

h2 {
  font-size: 18px;
  font-weight: 600;
}

.fechar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-right: -8px;
  border: 0;
  border-radius: var(--radius-btn);
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}

.fechar:hover {
  background: rgba(255, 255, 255, .06);
  color: var(--text);
}

.campo {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rotulo {
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: .14em;
  text-transform: uppercase;
  color: var(--text-subtle);
}

textarea {
  min-height: 112px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius-btn);
  background: var(--ink);
  font-size: 13.5px;
  line-height: 1.5;
  resize: vertical;
}

textarea:focus-visible {
  border-color: var(--accent);
}

.erro {
  font-size: 13px;
  color: var(--brand-red);
}

.rodape {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
