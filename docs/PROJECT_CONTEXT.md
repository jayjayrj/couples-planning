Couples Planning — Project Context
Overview

Couples Planning é uma aplicação web para planejamento financeiro doméstico (household financial planning).

O sistema permite que dois parceiros organizem:

contas financeiras

receitas

despesas

projeção financeira futura

saldo consolidado do household

O objetivo é fornecer visibilidade clara sobre a situação financeira atual e futura do casal.

Architecture
Backend

Stack:

Java

Spring Boot

Spring Security

JWT Authentication

Spring Data JPA

Flyway

PostgreSQL

Arquitetura:

Controller
Service
Repository
Entity
DTO / Request / Response

O backend é multi-tenant por household.

Cada registro pertence a um household_id.

Frontend

Stack:

Next.js (App Router)

React

TypeScript

CSS simples (inline styles)

Estrutura principal:

app/
  dashboard/
  despesas/
  receitas/
  contas/
  projecao/

components/
  Sidebar
  Topbar
  Modal
  Forms
  Charts

lib/
  api.ts
  currency.ts
Core Domain
Household

Representa a unidade financeira do casal.

Um usuário pode pertencer a um ou mais households (feature futura).

Cada entidade financeira pertence a um household.

User

Usuário autenticado.

Autenticação via:

JWT

Endpoints principais:

POST /auth/register
POST /auth/login
GET  /auth/me
Financial Domain

O sistema utiliza um modelo baseado em contas financeiras + ledger de transações.

Isso garante consistência financeira e rastreabilidade.

Account

Representa uma conta financeira.

Exemplos:

Conta Corrente

Conta Poupança

Dinheiro

Cartão de crédito (futuro)

Campos principais:

id
household_id
name
type
current_balance
created_at

Tipos possíveis:

CHECKING
SAVINGS
CREDIT_CARD
CASH
Income

Representa uma receita.

Exemplo:

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

Recorrência:

ONCE
MONTHLY

Regras:

criar income gera crédito na conta

cria também AccountTransaction

Expense

Representa uma despesa planejada ou paga.

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

Status possíveis:

PENDING
PAID

Regras:

Criar despesa:

status = PENDING
não altera saldo

Marcar como paga:

status = PAID
paid_at = now
debita conta
gera AccountTransaction
Financial Ledger
AccountTransaction

Representa uma movimentação financeira real.

Essa entidade garante:

histórico financeiro

rastreabilidade

auditoria

consistência de saldo

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
Transaction Type

Define a origem da movimentação.

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

Define qual entidade originou a transação.

INCOME
EXPENSE
MANUAL
SYSTEM
Account Ledger Service

Serviço central responsável por movimentações financeiras.

AccountLedgerService

Funções principais:

credit()
debit()
reverse()

Responsabilidades:

atualizar saldo da conta

registrar transação no ledger

validar duplicidade

validar ownership do household

Reversal Logic

Ao excluir lançamentos financeiros, o sistema gera transações de estorno.

Exemplo:

Income criado:

CREDIT 5000

Income deletado:

REVERSAL DEBIT 5000

Isso mantém histórico contábil.

Concurrency Protection

Movimentações financeiras usam:

PESSIMISTIC_WRITE

na leitura da conta.

Objetivo:

evitar lost updates no saldo.

Exemplo de problema evitado:

Thread A lê saldo 1000
Thread B lê saldo 1000

A debita 100
B debita 50

Saldo correto:

850

Lock pessimista garante consistência.

Database Migrations

Gerenciadas via:

Flyway

Convenção:

V1__init.sql
V2__household.sql
V3__accounts.sql
...
V8__account_ledger.sql

Migration do ledger inclui:

account_transactions
account_id em expenses
account_id em incomes
paid_at
realized_at
Dashboard

Endpoint:

GET /dashboard/summary

Retorna:

currentBalance
totalMonthlyIncome
totalMonthlyExpense
projectedMonthEndBalance
Projection

Endpoint:

GET /projection?months=N

Calcula projeção financeira futura considerando:

receitas recorrentes

despesas recorrentes

saldo atual

Retorna:

monthly projections
forecast expenses
Frontend Pages
Dashboard

Mostra:

saldo atual

receitas do mês

despesas do mês

saldo projetado

gráfico de evolução

Contas

Permite:

criar conta

listar contas

excluir conta

Despesas

Permite:

criar despesa

marcar como paga

excluir despesa

filtros

Modal inclui:

account selection
Receitas

Permite:

criar receita

excluir receita

filtros

Modal inclui:

account selection
Projeção

Mostra:

gráfico de saldo futuro

previsão de despesas

Horizontes:

3 meses
6 meses
12 meses
Current Development Focus

Fase atual do projeto:

concluir integração financeira entre backend e frontend.

Próximos passos imediatos:

finalizar seleção de conta no frontend

mostrar conta em receitas/despesas

criar extrato por conta

melhorar UX

Long Term Vision

Evoluir Couples Planning para um SaaS financeiro para casais.

Possíveis evoluções:

categorias de despesas

metas financeiras

relatórios

exportação CSV

convites para household

multi usuário

assinaturas premium

integrações bancárias (futuro distante)