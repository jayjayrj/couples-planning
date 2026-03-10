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

# Phase 1 — Completar Funcionalidades Básicas

Prioridade: ALTA

Objetivo: tornar o sistema totalmente utilizável para controle financeiro básico.

---

## Accounts Page (Frontend)

Status: ✅ CONCLUÍDO

Entregue:

* listar contas
* criar conta
* excluir conta

Campos utilizados:

name
type
currentBalance

UI:

* tabela padrão igual despesas/receitas
* modal para criação

---

## Dashboard Improvements

Status: ✅ CONCLUÍDO

Entregue:

* Saldo Atual
* Total Receitas do Mês
* Total Despesas do Mês
* Saldo do Mês

---

## Expense Filters

Status: ✅ CONCLUÍDO

Entregue:

* Todas
* Pendentes
* Pagas

---

## Income Filters

Status: ✅ CONCLUÍDO

Entregue:

* Todas
* Recorrentes
* Únicas

---

# Phase 2 — Organização Financeira

Prioridade: ALTA

Objetivo: tornar o sistema realmente útil para planejamento financeiro.

---

## Expense Categories

Status: ⏸ ADIADO

Motivo:

A feature exige evolução estrutural no backend:

* nova entidade de categoria
* relacionamento com Expense
* migrations
* DTOs novos
* endpoints específicos
* ajustes em criação e listagem de despesas

Decisão atual:

Adiado temporariamente para priorizar Projeção Financeira.

Escopo futuro:

* ExpenseCategory
* categoryId/categoryName no retorno de despesas
* CRUD de categorias
* select de categoria no formulário de despesa

---

## Income Categories

Status: ⏸ ADIADO

Mesmo racional de Expense Categories.

---

## Category Reports

Status: 🔒 BLOQUEADO

Dependência:

* categorias de despesas implementadas

---

# Phase 3 — Planejamento Financeiro

Prioridade: ALTA

Objetivo: diferenciar o produto de um simples controle financeiro.

---

## Financial Projection

Status: ✅ CONCLUÍDO

Entregue:

* endpoint backend `/projection?months=N`
* cálculo de saldo futuro mês a mês
* uso de receitas e despesas recorrentes/únicas
* página dedicada no frontend

---

## Future Balance Graph

Status: ✅ CONCLUÍDO

Entregue:

* gráfico de saldo futuro
* horizonte configurável (3, 6, 12 meses)

---

## Expense Forecast

Status: ✅ CONCLUÍDO

Entregue:

* `forecastExpenses` no retorno do backend
* listagem de despesas recorrentes consideradas na projeção

Exemplo:

Netflix
R$ 55 / mês

Academia
R$ 120 / mês

---

# Phase 4 — Experiência do Usuário

Prioridade: MÉDIA

---

## Toast Notifications

Status: ⏳ PRÓXIMO CANDIDATO

Mostrar mensagens de sucesso/erro.

Exemplo:

✓ Receita criada

✓ Despesa marcada como paga

✕ Erro ao salvar

---

## Confirm Dialog Component

Status: ⏳ PRÓXIMO CANDIDATO

Substituir:

window.confirm()

Por:

modal de confirmação customizado.

Hoje usado em:

* exclusão de despesas
* exclusão de receitas
* exclusão de contas

---

## Loading Indicators

Status: ⏳ PRÓXIMO CANDIDATO

Adicionar loading em:

* botões
* tabelas
* gráficos
* trocas de horizonte da projeção

---

## Mobile Responsiveness

Status: ⏳ FUTURO PRÓXIMO

Adaptar UI para celular.

Melhorias:

* sidebar colapsável
* tabelas responsivas
* cards reorganizados

---

# Phase 5 — Recursos de SaaS

Prioridade: MÉDIA

---

## Household Invitations

Status: 🔜 FUTURO

Convidar parceiro por email.

Fluxo:

Usuário cria household
Envia convite
Outro usuário aceita

---

## Multi User Household

Status: 🔜 FUTURO

Permitir múltiplos usuários por household.

Papéis possíveis:

owner
member

---

## Audit Log

Status: 🔜 FUTURO

Registrar mudanças importantes.

Exemplo:

Usuário criou despesa
Usuário excluiu receita

---

# Phase 6 — Recursos Avançados

Prioridade: BAIXA

---

## Financial Goals

Status: 🔜 FUTURO

Criar metas financeiras.

Exemplo:

Meta:

Viagem
R$ 10.000

Progresso:

R$ 3.200 / R$ 10.000

---

## CSV Export

Status: 🔜 FUTURO

Exportar dados financeiros.

* Despesas
* Receitas
* Relatórios

---

## Reports

Status: 🔜 FUTURO

Relatórios financeiros completos.

* Mensal
* Anual
* Por categoria

---

# Phase 7 — Produto SaaS Completo

Prioridade: FUTURO

---

## Subscription Plans

Plano gratuito
Plano premium

---

## Stripe Integration

Pagamentos.

---

## Multi Household

Um usuário gerenciar múltiplos households.

---

# Recommended Immediate Next Step

Próxima implementação recomendada:

1️⃣ **Toast Notifications**

Depois:

2️⃣ **Confirm Dialog Component**

3️⃣ **Loading Indicators**

4️⃣ **Mobile Responsiveness**

---

# Why this order now

Após a entrega de contas, filtros e projeção, o maior ganho incremental agora está em UX e refinamento de produto.

Esse bloco melhora:

* percepção de qualidade
* feedback de ações do usuário
* experiência de uso no dia a dia
* preparação para uso em produção
