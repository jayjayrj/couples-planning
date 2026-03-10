PROJECT_CONTEXT.md
# Couples Planning — Project Context

## Overview

Couples Planning é um sistema SaaS para planejamento financeiro de casais.  
Ele permite gerenciar receitas, despesas, contas e projeções financeiras dentro de um household compartilhado.

O sistema possui backend em **Java + Spring Boot** e frontend em **Next.js + React + TypeScript**.

---

# Architecture

## Backend

Stack:

- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- PostgreSQL
- Maven
- Docker

Arquitetura baseada em camadas:


controller
service
repository
entity
dto
security
exception
config


---

## Frontend

Stack:

- Next.js
- React
- TypeScript
- App Router
- CSS inline styling

Estrutura:


app
components
lib


Componentes principais:


Sidebar
Topbar
Modal
AuthGuard


---

# Project Structure


couples-planning
│
├─ backend
│ └─ couples-planning-api
│
├─ frontend
│ └─ couples-planning-web
│
└─ docs
└─ PROJECT_CONTEXT.md


---

# Backend Features Implemented

## Authentication

Endpoints:


POST /auth/register
POST /auth/login
GET /auth/me


Autenticação via:


JWT Token


Fluxo:


Login → JWT → Header Authorization → Backend valida


---

## Household

Funcionalidades:

- criação de household
- seleção de household ativo
- associação de usuários

---

## Accounts

CRUD de contas financeiras.

Exemplo:


Conta corrente
Conta poupança
Cartão


---

## Expenses

Funcionalidades:

- listar despesas
- criar despesa
- despesa recorrente
- marcar como paga
- excluir despesa

Campos principais:


description
amount
recurrenceType
startDate
dayOfMonth
status


Status:


PENDING
PAID


---

## Incomes

Funcionalidades:

- listar receitas
- criar receita
- receita recorrente
- excluir receita

Campos principais:


description
amount
recurrenceType
startDate
dayOfMonth


---

# Frontend Features Implemented

## Authentication

- login page
- armazenamento de JWT
- `AuthGuard` para rotas protegidas

---

## Layout

Layout padrão do sistema:


Sidebar
Topbar
Main Content


Sidebar contém:


Dashboard
Contas
Despesas
Receitas


---

## Dashboard

Exibe:


saldo atual
receitas
despesas
projeção


Com gráfico financeiro.

---

## Expenses Page

Funcionalidades:

- listagem de despesas
- criação via modal
- marcar como paga
- excluir despesa

UI:

- tabela estilizada
- badges de status
- ações com ícones
- tooltip nas ações

---

## Incomes Page

Funcionalidades:

- listagem de receitas
- criação via modal
- exclusão de receita

UI igual ao padrão de despesas.

---

# UI Patterns

## Toolbar Buttons

Botões de ação com ícone:


Nova
↻ Recarregar


Com tooltip.

---

## Table Actions

Ações nas tabelas:


✓ marcar como paga
🗑 excluir


Estados:


ativo → colorido
desabilitado → cinza


Hover:


fundo circular
leve animação


---

# Development Environment

Backend:


mvn spring-boot:run


Frontend:


npm run dev


Ou ambos:


npm run dev:all


---

# Database

Banco:


PostgreSQL


Gerenciamento via:


DBeaver


---

# Tools

Ferramentas utilizadas:


IntelliJ
Postman
Docker Desktop
DBeaver
Git
Node.js


---

# Current UI Style

Estilo visual inspirado em:


Fintech dashboards
Linear
Stripe
Notion


Características:


layout clean
cards suaves
ações com ícones
tooltips
cores sem exagero


---

# Next Planned Features

Próximas evoluções naturais:

### Accounts Page (Frontend)

- listar contas
- criar conta
- excluir conta

---

### Dashboard Improvements

Adicionar:


total receitas
total despesas
saldo do mês


---

### Expense Filters

Filtros na tela:


Todas
Pendentes
Pagas


---

### Financial Projection

Tela futura:


projeção financeira futura


---

# Future SaaS Features

Possíveis evoluções do produto:


multi-household
convites por email
metas financeiras
categorias de despesas
relatórios
exportação CSV


---

