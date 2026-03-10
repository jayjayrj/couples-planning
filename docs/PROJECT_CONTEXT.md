# Couples Planning — Project Context

## Overview

Couples Planning é um sistema SaaS para planejamento financeiro de casais.
Ele permite gerenciar receitas, despesas, contas e projeções financeiras dentro de um household compartilhado.

O sistema possui backend em **Java + Spring Boot** e frontend em **Next.js + React + TypeScript**.

---

# Architecture

## Backend

Stack:

* Java 21
* Spring Boot
* Spring Security
* JWT Authentication
* PostgreSQL
* Maven
* Docker

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

* Next.js
* React
* TypeScript
* App Router
* CSS inline styling

Estrutura:

app
components
lib

Componentes principais:

Sidebar
Topbar
Modal
AuthGuard
ProjectionChart
SummaryCard

---

# Project Structure

couples-planning
│
├─ backend
│  └─ couples-planning-api
│
├─ frontend
│  └─ couples-planning-web
│
└─ docs
├─ PROJECT_CONTEXT.md
└─ NEXT_STEPS.md

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

* criação de household
* seleção de household ativo
* associação de usuários

---

## Accounts

CRUD de contas financeiras.

Exemplos:

Conta corrente
Conta poupança
Cartão

Campos expostos no retorno atual:

* id
* name
* type
* currentBalance

---

## Expenses

Funcionalidades:

* listar despesas
* criar despesa
* despesa recorrente
* marcar como paga
* excluir despesa

Campos principais:

description
amount
recurrenceType
startDate
endDate
dayOfMonth
status

Status:

PENDING
PAID

---

## Incomes

Funcionalidades:

* listar receitas
* criar receita
* receita recorrente
* excluir receita

Campos principais:

description
amount
recurrenceType
startDate
endDate
dayOfMonth

---

## Projection

Backend já implementado para projeção financeira.

Endpoint:

GET /projection?months=6

Capacidades atuais:

* calcular saldo atual a partir das contas do household
* projetar saldo mês a mês
* considerar receitas recorrentes e únicas
* considerar despesas pendentes recorrentes e únicas
* limitar horizonte de projeção entre 1 e 60 meses
* retornar lista de despesas recorrentes consideradas no forecast

Resposta atual:

* currentBalance
* projection[]
* forecastExpenses[]

Campos de projection:

month
balance

Campos de forecastExpenses:

id
description
amount
dayOfMonth

---

# Frontend Features Implemented

## Authentication

* login page
* armazenamento de JWT
* `AuthGuard` para rotas protegidas

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
Projeção

---

## Dashboard

Exibe:

* saldo atual
* receitas do mês
* despesas do mês
* saldo do mês
* gráfico financeiro

Consome:

* `/dashboard/summary`
* `/projection?months=6`

---

## Accounts Page

Rota:

`/contas`

Funcionalidades:

* listagem de contas
* criação via modal
* exclusão de conta

UI:

* tabela estilizada
* ações com ícones
* modal de criação
* integração com `/accounts`

Observação:

A tabela usa `currentBalance` retornado pela API.

---

## Expenses Page

Rota:

`/despesas`

Funcionalidades:

* listagem de despesas
* criação via modal
* marcar como paga
* excluir despesa
* filtros por status

Filtros:

* Todas
* Pendentes
* Pagas

UI:

* tabela estilizada
* badges de status
* ações com ícones
* tooltip nas ações

---

## Incomes Page

Rota:

`/receitas`

Funcionalidades:

* listagem de receitas
* criação via modal
* exclusão de receita
* filtros por recorrência

Filtros:

* Todas
* Recorrentes
* Únicas

UI:

* tabela estilizada
* ações com ícones
* modal de criação

---

## Projection Page

Rota:

`/projecao`

Funcionalidades:

* exibir saldo atual
* selecionar horizonte de projeção (3, 6, 12 meses)
* exibir gráfico de evolução do saldo
* exibir tabela com saldo projetado por mês
* exibir despesas recorrentes consideradas no forecast

Consome:

`/projection?months=N`

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

## Filter Pills

Padrão visual adotado para filtros de listagem:

* botões arredondados
* estado ativo em roxo
* estado inativo em branco

Usado em:

* Despesas
* Receitas
* Projeção (horizonte de meses)

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

# Current Product Scope

O produto já cobre um fluxo funcional de controle financeiro básico com visão de projeção futura.

Fluxos já utilizáveis:

* autenticação
* seleção de household
* cadastro de contas
* cadastro e pagamento de despesas
* cadastro de receitas
* dashboard com resumo financeiro
* projeção financeira futura

---

# Deferred / Not Yet Implemented

Itens planejados, mas ainda não implementados:

* categorias de despesas
* categorias de receitas
* relatórios por categoria
* metas financeiras
* convites por email
* multi-user household completo
* audit log
* exportação CSV

Observação:

Categorias foram deliberadamente adiadas para priorizar a evolução de projeção financeira e forecast.
