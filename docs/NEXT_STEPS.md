# Couples Planning — Next Steps Roadmap

Este documento consolida o estado atual do projeto e os próximos passos imediatos.

---

# Current Status

## AUTH

Implementado:

* registro
* login
* JWT
* `GET /auth/me`
* login carregando households do usuário após autenticação
* household ativo salvo no `localStorage`

## HOUSEHOLD

Implementado:

* criação de household
* listagem de households do usuário
* carregamento do household ativo no frontend de forma dinâmica
* nome do household exibido no Topbar a partir da API

## USER PROFILE / AVATAR

Implementado ou em andamento avançado:

* Topbar preparado para exibir avatar do usuário
* fallback para inicial do nome quando não houver foto
* backend preparado para evoluir `avatarUrl` no usuário
* fluxo de cadastro no frontend com campo de foto opcional

Pendente para fechamento completo:

* persistir upload de avatar ponta a ponta
* garantir exposição pública do arquivo salvo
* validar retorno de `avatarUrl` no `/auth/me`

## ACCOUNTS

Implementado:

* CRUD completo no backend
* listagem no frontend
* criação no frontend
* exclusão no frontend

## EXPENSES

Implementado:

* listar despesas
* criar despesa
* recorrência mensal
* marcar como paga
* excluir despesa
* filtros: Todas / Pendentes / Pagas
* suporte a `accountId` no backend
* suporte a `accountName` na listagem/frontend

## INCOMES

Implementado:

* listar receitas
* criar receita
* excluir receita
* filtros: Todas / Recorrentes / Únicas
* suporte a `accountId` no backend
* suporte a `accountName` na listagem/frontend

## DASHBOARD

Implementado:

* saldo atual
* receitas do mês
* despesas do mês
* saldo do mês
* gráfico financeiro

## PROJECTION

Implementado:

* endpoint `/projection?months=N`
* projeção financeira mês a mês
* gráfico de saldo futuro
* página dedicada de projeção
* seletor de horizonte (3 / 6 / 12 meses)
* despesas recorrentes consideradas na projeção

## FRONTEND / UX

Implementado:

* login
* página de cadastro
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
* correção do household hardcoded no topo
* correção do `householdId` hardcoded no login
* correção de contraste no mobile nas páginas internas

---

# Important Domain Discovery

Durante a evolução do projeto foi identificado um ponto estrutural importante.

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

Isso fazia o produto funcionar mais como um planner financeiro do que como um sistema financeiro consistente por conta.

---

# Financial Domain Refactor

Prioridade: ALTA

Objetivo: tornar o sistema financeiramente consistente e preparar a base para extrato, auditoria e evolução SaaS.

## Account-linked Incomes and Expenses

Status: ✅ IMPLEMENTADO

Entregue:

* `Expense` com `accountId`
* `Income` com `accountId`
* `Expense` com `paidAt`
* `Income` com `realizedAt`
* requests atualizados para receber `accountId`
* responses com dados de conta para exibição no frontend

Regras atuais:

* criar receita credita a conta vinculada
* criar despesa continua como `PENDING`
* marcar despesa como paga debita a conta vinculada

## Financial Ledger / Account Transactions

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* entidade `AccountTransaction`
* ledger por conta
* crédito/débito por tipo de transação
* `referenceType` e `referenceId`
* migration aplicada
* validação contra duplicidade por referência
* centralização no `AccountLedgerService`

Resultado:

* saldo passa a refletir movimentações reais
* base pronta para extrato financeiro
* base pronta para auditoria e reversão

## Delete Reversal Logic

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* exclusão de receita com estorno financeiro
* exclusão de despesa paga com estorno financeiro
* preservação da consistência entre ledger e saldo

## Concurrency Protection

Status: ✅ IMPLEMENTADO NO BACKEND

Entregue:

* `PESSIMISTIC_WRITE` nas movimentações da conta
* proteção contra race condition / lost update
* índice único para evitar duplicidade por referência

---

# Current Priority

## 1. Fechar cadastro com avatar ponta a ponta

Status: ⏳ EM ANDAMENTO

Objetivo:

* permitir novo usuário criar conta
* subir foto opcional
* exibir foto real no Topbar

Checklist:

* confirmar migration de `avatar_url`
* concluir endpoint `POST /users/me/avatar`
* expor `/uploads/**`
* retornar `avatarUrl` em `GET /auth/me`
* enviar avatar após cadastro no frontend
* validar exibição da foto no Topbar

## 2. Revisar household inicial pós-cadastro

Status: ⏳ PRÓXIMO

Objetivo:

* garantir que usuário recém-criado tenha household utilizável logo após registro

Opções:

* criar household padrão automaticamente no backend
* ou criar fluxo explícito de criação/seleção após cadastro

Recomendação:

* criar household padrão automático para reduzir atrito de onboarding

---

# Phase 1 — Financial Visibility

Prioridade: ALTA

## Account Statement / Transaction History

Status: ⏳ PRÓXIMO CANDIDATO

Nova feature sugerida:

```http
GET /accounts/{id}/transactions
```

Objetivo:

* mostrar extrato por conta
* listar créditos, débitos e reversões
* dar visibilidade ao ledger já existente

Escopo inicial:

* endpoint paginado
* tabela no frontend
* filtros por período
* descrição, tipo, direção, valor e data

## Dashboard Improvements

Status: ⏳ PRÓXIMO CANDIDATO

Sugestões:

* resumo por conta
* últimos lançamentos
* atalhos para criar receita/despesa
* alertas de contas sem saldo

---

# Phase 2 — UX / Product Evolution

Prioridade: MÉDIA

## Melhorias de onboarding

* validação melhor de erros no cadastro
* preview da foto antes do envio
* mensagem clara quando usuário não possuir household
* seleção de household quando houver múltiplos

## Melhorias de responsividade

* revisar tabelas no mobile
* revisar toolbar das páginas internas
* melhorar experiência de upload de foto no mobile

## Households multiusuário

* convite de parceiro
* associação de múltiplos usuários ao mesmo household
* gestão de membros

---

# Longer Term

Possíveis evoluções futuras:

* categorias de despesas e receitas
* metas financeiras
* relatórios
* exportação CSV
* convites para household
* multi usuários completos
* planos de assinatura
* integrações bancárias

---

# Immediate Next Action

Próxima ação recomendada:

**finalizar o fluxo de avatar ponta a ponta e validar o Topbar com foto real do usuário.**
