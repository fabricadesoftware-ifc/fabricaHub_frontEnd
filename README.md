# FábricaHub

Sistema institucional da Fábrica de Software responsável pela gestão de membros, projetos, squads, certificados, comunicação, integrações e gestão do conhecimento.

---

# Visão Geral

O FábricaHub será o backend central da Fábrica de Software.

A plataforma será responsável por:

* Gestão de membros
* Gestão de projetos
* Gestão de squads
* Histórico de participação
* Geração de certificados
* Integração com portal público
* Integração com controle de acesso via ESP
* Integração com GitHub
* Comunicação entre squads
* Notificações PWA
* Gestão do conhecimento com IA/RAG

---

# Arquitetura Geral

```text
                ┌──────────────────────┐
                │   Frontend Admin     │
                │     Vue 3 + PWA      │
                └──────────┬───────────┘
                           │
                           │ REST API
                           │
                ┌──────────▼───────────┐
                │    FábricaHub API    │
                │ Django REST Backend  │
                └──────────┬───────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
 PostgreSQL           Redis/Celery        Firebase
                                           FCM
        │
        ├─────────────── GitHub API
        ├─────────────── ESP Access Control
        ├─────────────── Portal Público
        └─────────────── IA/RAG
```

---

# Estrutura do Projeto

```text
fabricahub/
│
├── backend/
│   ├── apps/
│   ├── core/
│   ├── config/
│   ├── requirements/
│   ├── docker/
│   └── manage.py
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── tests/
│   └── vite.config.js
│
├── docker-compose.yml
├── README.md
└── .env.example
```

# Frontend

## Stack

* Vue 3
* Composition API
* Vue Router
* Pinia
* Vuetify
* PWA
* Firebase Cloud Messaging
* Axios
* Vite

---

# Objetivo do Frontend

O frontend administrativo será responsável por:

* Gestão da Fábrica
* Visualização de projetos
* Comunicação entre squads
* Dashboard institucional
* Controle de acessos
* Gestão de certificados
* Gestão GitHub
* Notificações

---

# Estrutura Frontend

```text
frontend/
│
├── src/
│   ├── api/
│   ├── components/
│   ├── composables/
│   ├── layouts/
│   ├── pages/
│   ├── router/
│   ├── stores/
│   ├── services/
│   ├── controllers/
│   ├── repositories/
│   ├── utils/
│   ├── plugins/
│   └── styles/
│
└── vite.config.js
```

---

# Organização Frontend

## Components

Componentes reutilizáveis da aplicação.

```text
components/
├── common/
├── members/
├── projects/
├── squads/
├── certificates/
└── github/
```

---

## Pages

Páginas principais do sistema.

```text
pages/
├── dashboard/
├── members/
├── projects/
├── squads/
├── certificates/
├── access-control/
├── communication/
└── github/
```

---

## Stores

Gerenciamento de estado global com Pinia.

```text
stores/
├── auth.store.js
├── members.store.js
├── projects.store.js
├── notifications.store.js
└── github.store.js
```

---

# API Layer

O frontend não deve fazer chamadas diretas nos componentes.

Arquitetura recomendada:

```text
Component
↓
Controller
↓
Repository
↓
Axios/API
```

---

# Convenções Frontend

## Vue

* Utilizar Vue 3
* Utilizar Composition API
* Utilizar script setup
* Componentes em PascalCase
* Props e emits em camelCase
* Componentes desacoplados da API

---

# Estrutura de Componentes

```vue
<script setup>
</script>

<template>
</template>

<style scoped>
</style>
```

---

# PWA

O sistema será distribuído também como PWA.

## Funcionalidades previstas

* Instalação no celular
* Notificações push
* Acesso rápido aos projetos
* Feed de atividades
* Comunicação entre squads

---

# Notificações

O sistema utilizará Firebase Cloud Messaging.

Exemplos:

* nova issue criada
* novo membro na squad
* menção em tópico
* certificado emitido
* atualização no projeto

---

# Docker

## Serviços previstos

```yaml
services:
  backend:
  frontend:
  postgres:
  redis:
```

---

# Segurança

## Backend

* JWT Authentication
* Controle de permissões
* Rate limiting
* Logs de auditoria
* Validação de entrada

---

## Frontend

* Controle de rotas
* Proteção por permissões
* Refresh token
* Sanitização de dados

---

# Roadmap

## V1

* Autenticação
* Membros
* Projetos
* Squads
* Tecnologias
* Participações
* Certificados
* API pública

---

## V2

* Controle de acesso
* Logs de acesso
* Dashboard institucional
* Discussões por tópico

---

## V3

* Chat em tempo real
* PWA
* Notificações Firebase

---

## V4

* Integração GitHub
* Issues
* Branches
* Webhooks
* Dashboard GitHub

---

## V5

* IA/RAG
* Onboarding inteligente
* Gestão do conhecimento
* Busca semântica

---

# Objetivos do Projeto

* Centralizar a gestão da Fábrica de Software
* Criar memória institucional
* Melhorar onboarding de membros
* Automatizar certificados
* Integrar hardware e software
* Integrar GitHub ao fluxo institucional
* Apoiar gestão dos projetos
* Construir base para IA institucional

---

# Licença

Projeto institucional da Fábrica de Software.
