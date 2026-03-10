# Couples Planning — Next Steps Roadmap

Este documento define os próximos passos de desenvolvimento do Couples Planning.

O objetivo é evoluir o sistema de forma incremental, entregando valor contínuo enquanto a base técnica cresce de maneira organizada.

---

# Current Status

Funcionalidades já implementadas:

AUTH

* registro
* login
* JWT
* auth/me

HOUSEHOLD

* criação
* seleção de household ativo

ACCOUNTS

* CRUD completo no backend
* listagem no frontend
* criação no frontend
* exclusão no frontend

EXPENSES

* listar despesas
* criar despesa
* recorrência mensal
* marcar como paga
* excluir despesa
* filtros: Todas / Pendentes / Pagas

INCOMES

* listar receitas
* criar receita
* excluir receita
* filtros: Todas / Recorrentes / Únicas

DASHBOARD

* saldo atual
* receitas do mês
* despesas do mês
* saldo do mês
* gráfico financeiro

PROJECTION

* endpoint `/projection?months=N`
* projeção financeira mês a mês
* gráfico de saldo futuro
* página dedicada de projeção
* seletor de horizonte (3 / 6 / 12 meses)
* expense forecast com despesas recorrentes consideradas

FRONTEND

* login
* dashboard
* sidebar
* topbar
* páginas:
  * despesas
  * receitas
  * contas
  * projeção
* modais para criação
* ações com ícones
* tooltips

---

# Important Domain Discovery

Durante a evolução do projeto foi identificado um ponto estrutural importante:

## Situação anterior

O sistema possuía:

* `Account.currentBalance`
* `Expense`
* `Income`

Mas receitas e despesas não possuíam vínculo com conta.

Consequências:

* criar receita não creditava conta
* criar despesa não debitava conta
* marcar despesa como paga não debitava conta
* saldo das contas ficava desacoplado dos lançamentos

Isso fazia o produto funcionar mais como um **planner financeiro** do que como um **sistema financeiro consistente por conta**.

---

# Financial Domain Refactor

Prioridade: ALTA

Objetivo: tornar o sistema financeiramente consistente e preparar a base para extrato, auditoria e evolução SaaS.

---

## Account-linked Incomes and Expenses (Backend)

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* `Expense` com `accountId`
* `Income` com `accountId`
* `Expense` com `paidAt`
* `Income` com `realizedAt`
* requests atualizados para receber `accountId`
* responses atualizados para retornar `accountId`

Regras atuais:

* criar receita credita a conta vinculada
* criar despesa continua como `PENDING`
* marcar despesa como paga debita a conta vinculada

---

## Financial Ledger / Account Transactions

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* nova entidade `AccountTransaction`
* registro de movimentações financeiras por conta
* tipos de transação para crédito/débito
* vínculo por `referenceType` e `referenceId`
* migration inicial criada e aplicada
* validação contra duplicidade por referência
* controle transacional centralizado em `AccountLedgerService`

Objetivo atingido:

* saldo da conta passa a refletir movimentações reais
* base pronta para extrato financeiro
* base pronta para auditoria e reversão

---

## Delete Reversal Logic

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* exclusão de receita com estorno financeiro
* exclusão de despesa paga com estorno financeiro
* preservação da consistência entre ledger e saldo da conta

Resultado:

* deletar receita não deixa saldo incorreto
* deletar despesa paga não deixa saldo incorreto

---

## Concurrency Protection on Account Balance

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* lock pessimista no carregamento da conta para movimentação
* proteção contra race condition / lost update
* índice único para evitar duplicidade de transação por referência

Objetivo:

* evitar inconsistência de saldo em operações concorrentes

---

# Phase 1 — Completar Integração Conta + Lançamentos

Prioridade: ALTA

Objetivo: concluir a integração do novo domínio financeiro no frontend.

---

## Expense Form with Account Selection

Status: ⏳ EM ANDAMENTO

Backend: ✅ pronto  
Frontend form: ✅ componentes ajustados  
Página de despesas: ⏳ precisa concluir integração final

Escopo:

* carregar contas via `/accounts`
* exibir select de conta no modal de despesa
* enviar `accountId` no payload
* bloquear criação quando não houver contas cadastradas

Arquivos envolvidos:

* `components/NewExpenseForm.tsx`
* `app/despesas/page.tsx`

---

## Income Form with Account Selection

Status: ⏳ EM ANDAMENTO

Backend: ✅ pronto  
Frontend form: ✅ componentes ajustados  
Página de receitas: ⏳ precisa concluir integração final

Escopo:

* carregar contas via `/accounts`
* exibir select de conta no modal de receita
* enviar `accountId` no payload
* bloquear criação quando não houver contas cadastradas

Arquivos envolvidos:

* `components/NewIncomeForm.tsx`
* `app/receitas/page.tsx`

---

## Show Account on Expense and Income Tables

Status: ⏳ PRÓXIMO

Objetivo:

mostrar na listagem qual conta foi utilizada em cada receita/despesa.

Sugestão:

* backend retornar `accountName` em `ExpenseResponse`
* backend retornar `accountName` em `IncomeResponse`
* frontend adicionar coluna "Conta" nas tabelas

Exemplo:

* Supermercado — Conta Corrente
* Salário — Nubank

---

# Phase 2 — Financial Visibility

Prioridade: ALTA

Objetivo: transformar a nova base de ledger em valor visível para o usuário.

---

## Account Statement / Transaction History

Status: ⏳ PRÓXIMO CANDIDATO

Nova feature sugerida:

```http
GET /accounts/{id}/transactions