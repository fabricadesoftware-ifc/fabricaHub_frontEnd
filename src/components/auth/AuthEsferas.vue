<template>
  <div class="esferas" aria-hidden="true">
    <span class="esfera vermelha" />
    <span class="esfera azul" />
    <span class="esfera turquesa" />
    <span class="esfera laranja" />
  </div>
</template>

<style scoped>
/* Único lugar do sistema com gradiente (volume das esferas). */
.esferas {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.esfera {
  position: absolute;
  border-radius: 50%;
}

.vermelha {
  top: 11%;
  right: 9%;
  width: 72px;
  height: 72px;
  background: radial-gradient(circle at 32% 28%, #FF8A8A 0%, #FF2020 55%, #A30F0F 100%);
}

.azul {
  top: 27%;
  right: 5%;
  width: 34px;
  height: 34px;
  background: radial-gradient(circle at 32% 28%, #8C8CFF 0%, #2A2AFF 55%, #12128C 100%);
}

/* Fica atrás do canto inferior esquerdo do crachá, sem cobrir o texto de ajuda. */
.turquesa {
  top: 64%;
  left: 59%;
  width: 104px;
  height: 104px;
  background: radial-gradient(circle at 32% 28%, #7FE3E1 0%, #12B0AE 55%, #08605F 100%);
}

.laranja {
  right: -120px;
  bottom: -190px;
  width: 440px;
  height: 440px;
  background: radial-gradient(circle at 30% 26%, #FFA766 0%, #FF6600 50%, #A84200 100%);
}

/* Colunas empilhadas: o crachá fica embaixo, centralizado. */
@media (max-width: 899px) {
  /* Encostada na borda esquerda, ao lado do crachá, longe dos textos. */
  .turquesa {
    top: auto;
    bottom: 30%;
    left: -44px;
  }
}

@media (max-width: 599px) {
  .vermelha {
    top: 9%;
    right: 6%;
    width: 44px;
    height: 44px;
  }

  .azul {
    top: 15%;
    right: 3%;
    width: 22px;
    height: 22px;
  }

  .turquesa {
    width: 64px;
    height: 64px;
  }

  .laranja {
    right: -110px;
    bottom: -130px;
    width: 260px;
    height: 260px;
  }
}
</style>
