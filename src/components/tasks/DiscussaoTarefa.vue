<script setup lang="ts">
import { ref } from 'vue'
import AvatarPessoa from '@/components/global/AvatarPessoa.vue'
import BotaoBase from '@/components/global/BotaoBase.vue'
import EstadoVazio from '@/components/global/EstadoVazio.vue'
import { dataHora } from '@/utils/datas'
import type { ComentarioTarefa, Usuario } from '@/utils/tipos'

const props = withDefaults(
  defineProps<{
    comentarios: ComentarioTarefa[]
    usuario: (id: number) => Usuario | undefined
    /** Envia o comentário; devolve true se deu certo (o campo é limpo). */
    comentar: (texto: string) => Promise<boolean>
    enviando?: boolean
    erro?: string | null
  }>(),
  { enviando: false, erro: null },
)

const texto = ref('')

async function enviar() {
  if (await props.comentar(texto.value)) texto.value = ''
}
</script>

<template>
  <div class="discussao">
    <TransitionGroup v-if="comentarios.length" tag="ul" name="lista" class="lista">
      <li v-for="comentario in comentarios" :key="comentario.id" class="comentario">
        <AvatarPessoa
          :nome="usuario(comentario.idAutor)?.nome ?? '?'"
          :cor="usuario(comentario.idAutor)?.cor"
          :tamanho="30"
        />
        <div class="conteudo">
          <p class="autor">
            {{ usuario(comentario.idAutor)?.nome ?? 'Alguém' }}
            <span class="data">{{ dataHora(comentario.em) }}</span>
          </p>
          <p class="texto">{{ comentario.texto }}</p>
        </div>
      </li>
    </TransitionGroup>
    <EstadoVazio v-else compacto titulo="Ninguém comentou ainda." texto="Tire uma dúvida ou conte como está indo." />

    <form class="formulario" @submit.prevent="enviar">
      <label for="novo-comentario" class="rotulo">Novo comentário</label>
      <textarea
        id="novo-comentario"
        v-model="texto"
        rows="3"
        placeholder="Escreva uma dúvida ou atualização..."
        :disabled="enviando"
      />
      <p v-if="erro" class="erro" role="alert">{{ erro }}</p>
      <BotaoBase tipo="submit" class="enviar" :disabled="enviando || !texto.trim()">Comentar</BotaoBase>
    </form>
  </div>
</template>

<style scoped>
.discussao {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.lista {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.comentario {
  display: flex;
  gap: 12px;
}

.conteudo {
  min-width: 0;
}

.autor {
  font-size: 13px;
  font-weight: 700;
}

.data {
  margin-left: 6px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 400;
  color: var(--text-subtle);
}

.texto {
  font-size: 13px;
  color: var(--text-muted);
}

.formulario {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
}

.rotulo {
  font-size: 12px;
  color: var(--text-muted);
}

textarea {
  resize: vertical;
  padding: 10px 12px;
  border: 1px solid rgba(255, 255, 255, .12);
  border-radius: var(--radius-btn);
  background: var(--tile);
  font-size: 13px;
}

textarea:focus {
  outline: none;
  border-color: var(--accent);
}

textarea::placeholder {
  color: var(--text-subtle);
}

.erro {
  font-size: 12.5px;
  color: var(--brand-red);
}

.enviar {
  align-self: flex-end;
}
</style>
