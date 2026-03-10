Couples Planning — Architecture Overview
Purpose

Couples Planning é uma aplicação web para planejamento financeiro doméstico.

O objetivo do sistema é permitir que um casal:

organize contas financeiras

registre receitas

registre despesas

visualize saldo consolidado

projetar a situação financeira futura

O sistema foi projetado para evoluir para um SaaS financeiro para casais.

High-Level Architecture

O sistema segue uma arquitetura cliente-servidor.

Frontend (Next.js)
        ↓
Backend API (Spring Boot)
        ↓
Database (PostgreSQL)
Backend Architecture

Stack:

Java
Spring Boot
Spring Security
JWT Authentication
Spring Data JPA
Flyway
PostgreSQL

Estrutura de camadas:

Controller
   ↓
Service
   ↓
Repository
   ↓
Database

Responsabilidades:

Layer	Responsibility
Controller	expõe endpoints REST
Service	regras de negócio
Repository	acesso ao banco
Entity	mapeamento JPA
DTO	requests/responses da API
Multi-Tenancy Model

O sistema é multi-tenant por household.

Um household representa a unidade financeira de um casal.

Todas as entidades financeiras possuem:

household_id

Isso garante isolamento entre casais.

Authentication

Autenticação baseada em JWT.

Fluxo:

POST /auth/login
        ↓
JWT Token
        ↓
Token enviado em todas as requisições

Endpoints principais:

POST /auth/register
POST /auth/login
GET  /auth/me
Core Domain Model

O domínio financeiro do sistema é baseado em:

Accounts
+
Financial Ledger

Isso garante consistência financeira.

Account

Representa uma conta financeira.

Exemplos:

Conta corrente

Poupança

Dinheiro

Cartão de crédito (futuro)

Campos principais:

id
household_id
name
type
current_balance
created_at

Tipos:

CHECKING
SAVINGS
CREDIT_CARD
CASH
Income

Representa uma receita.

Exemplos:

salário

freelance

aluguel recebido

Campos principais:

id
household_id
account_id
description
amount
recurrence_type
start_date
end_date
day_of_month
realized_at
created_at

Regras:

Criar income:

credit account
create ledger transaction
Expense

Representa uma despesa.

Campos principais:

id
household_id
account_id
description
amount
recurrence_type
start_date
end_date
day_of_month
status
paid_at
created_at

Status:

PENDING
PAID

Regras:

Criar despesa:

status = PENDING
não altera saldo

Marcar como paga:

status = PAID
debita conta
cria ledger transaction
Financial Ledger

Para garantir consistência financeira o sistema utiliza um ledger de transações.

Entidade:

AccountTransaction

Campos principais:

id
household_id
account_id
type
direction
amount
transaction_date
reference_type
reference_id
description
created_at
Transaction Types
INCOME
EXPENSE
TRANSFER_IN
TRANSFER_OUT
ADJUSTMENT
REVERSAL
Transaction Direction

Define impacto no saldo.

CREDIT
DEBIT
Reference Type

Indica a origem da transação.

INCOME
EXPENSE
MANUAL
SYSTEM
Ledger Service

Toda movimentação financeira passa por:

AccountLedgerService

Funções principais:

credit()
debit()
reverse()

Responsabilidades:

atualizar saldo da conta

registrar transação

prevenir duplicidade

validar household ownership

Reversal Strategy

Ao excluir lançamentos financeiros o sistema cria transações de reversão.

Exemplo:

Income criado

CREDIT 5000
Income deletado

REVERSAL DEBIT 5000

Isso preserva histórico contábil.

Concurrency Strategy

Para evitar inconsistência de saldo, o sistema usa:

PESSIMISTIC_WRITE

ao carregar contas durante movimentações financeiras.

Isso evita race conditions.

Database Management

Migrações controladas por:

Flyway

Convenção:

V1__init.sql
V2__auth.sql
V3__household.sql
V4__accounts.sql
...
V8__account_ledger.sql
Frontend Architecture

Stack:

Next.js (App Router)
React
TypeScript

Estrutura principal:

app/
  dashboard
  despesas
  receitas
  contas
  projecao

components/
  forms
  layout
  modal
  charts

lib/
  api.ts
  currency.ts
Frontend Responsibilities

Frontend é responsável por:

autenticação

navegação

formulários

visualização de dados

gráficos

interação com API

Toda lógica de negócio permanece no backend.

API Communication

Comunicação via REST.

Helper principal:

lib/api.ts

Exemplo:

apiFetch("/expenses")

Inclui automaticamente:

Authorization: Bearer TOKEN
Key Endpoints

Auth:

POST /auth/register
POST /auth/login
GET  /auth/me

Accounts:

GET /accounts
POST /accounts
DELETE /accounts/{id}

Expenses:

GET /expenses
POST /expenses
PATCH /expenses/{id}/pay
DELETE /expenses/{id}

Incomes:

GET /incomes
POST /incomes
DELETE /incomes/{id}

Dashboard:

GET /dashboard/summary

Projection:

GET /projection?months=N
Future Architecture Evolution

O sistema foi projetado para evoluir para:

Financial SaaS

Possíveis evoluções:

categorias de despesas

extrato financeiro

relatórios

metas financeiras

exportação CSV

convites para household

multi usuários

planos de assinatura

integração bancária

Design Principles

O projeto segue estes princípios:

Simplicidade

Evitar complexidade desnecessária.

Domínio consistente

Saldo sempre derivado de transações financeiras.

Evolução incremental

Cada feature adiciona valor sem quebrar a base existente.

Backend como fonte de verdade

Toda regra financeira fica no backend.

Current Focus

A fase atual do projeto está focada em:

completar integração financeira

Próximos passos principais:

finalizar seleção de conta no frontend

mostrar conta em receitas/despesas

criar extrato por conta

melhorar UX

Summary

Couples Planning utiliza um modelo baseado em:

Accounts
+
Ledger Transactions

Esse modelo garante:

consistência financeira

histórico completo

auditabilidade

escalabilidade para features futuras