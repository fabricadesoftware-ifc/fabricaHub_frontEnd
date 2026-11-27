<script setup lang="ts">
import Carimbo from '@/components/global/Carimbo.vue'
</script>

<template>
  <main class="erro">
    <Carimbo texto="Não encontrada" assinatura="ERRO · 404" tipo="devolvido" />
    <h1>Esta página não existe</h1>
    <p>O endereço pode ter mudado ou sido digitado errado.</p>
    <RouterLink to="/" class="voltar">Voltar ao Dashboard</RouterLink>
  </main>
</template>

<style scoped>
.erro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  min-height: 100vh;
  padding: 24px 16px;
  text-align: center;
}

h1 {
  margin-top: 16px;
  font-size: 22px;
  font-weight: 600;
}

p {
  max-width: 420px;
  font-size: 14px;
  color: var(--text-muted);
}

.voltar {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
  padding: 0 20px;
  border-radius: var(--radius-btn);
  background: var(--brand-orange);
  box-shadow: 0 3px 0 #8A3205;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}
</style>
