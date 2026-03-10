# Couples Planning — Next Steps Roadmap

Este documento define os próximos passos de desenvolvimento do Couples Planning.

O objetivo é evoluir o sistema de forma incremental, entregando valor contínuo enquanto a base técnica cresce de maneira organizada.

---

# Current Status

Funcionalidades já implementadas:

AUTH
- registro
- login
- JWT
- auth/me

HOUSEHOLD
- criação
- seleção de household ativo

ACCOUNTS (Backend)
- CRUD completo

EXPENSES
- listar despesas
- criar despesa
- recorrência mensal
- marcar como paga
- excluir despesa

INCOMES
- listar receitas
- criar receita
- excluir receita

FRONTEND
- login
- dashboard
- sidebar
- topbar
- páginas:
  - despesas
  - receitas
- modais para criação
- ações com ícones
- tooltips

---

# Phase 1 — Completar Funcionalidades Básicas

Prioridade: ALTA

Objetivo: tornar o sistema totalmente utilizável para controle financeiro básico.

---

## Accounts Page (Frontend)

Criar tela de contas.

Funcionalidades:

- listar contas
- criar conta
- excluir conta

Campos:

name
type
initialBalance

UI:

tabela padrão igual despesas/receitas
modal para criação

---

## Dashboard Improvements

Melhorar a tela inicial com dados reais.

Adicionar cards:

Saldo Atual
Total Receitas
Total Despesas
Saldo do Mês

Exemplo:

Saldo Atual
R$ 3.250

Receitas
R$ 8.000

Despesas
R$ 4.750

Saldo do mês
R$ 3.250

---

## Expense Filters

Adicionar filtros na página de despesas.

Filtros:

Todas
Pendentes
Pagas

Possível UI:

[ Todas ] [ Pendentes ] [ Pagas ]

---

## Income Filters

Mesma lógica para receitas.

Filtros:

Todas
Recorrentes
Únicas

---

# Phase 2 — Organização Financeira

Prioridade: ALTA

Objetivo: tornar o sistema realmente útil para planejamento financeiro.

---

## Expense Categories

Criar categorias de despesas.

Exemplos:

Moradia
Alimentação
Transporte
Lazer
Saúde
Educação

Campos:

id
name
householdId

Relacionamento:

expense → category

---

## Income Categories

Categorias para receitas.

Exemplos:

Salário
Freelance
Investimentos
Outros

---

## Category Reports

Mostrar distribuição de despesas por categoria.

Possível gráfico:

Pizza Chart

Exemplo:

Moradia 40%
Alimentação 25%
Transporte 10%

---

# Phase 3 — Planejamento Financeiro

Prioridade: ALTA

Objetivo: diferenciar o produto de um simples controle financeiro.

---

## Financial Projection

Tela de projeção financeira futura.

Exemplo:

Saldo atual: R$ 3.000

Projeção:

Mês 1 → R$ 4.200
Mês 2 → R$ 5.100
Mês 3 → R$ 6.000

Baseado em:

receitas recorrentes
despesas recorrentes

---

## Future Balance Graph

Adicionar gráfico:

Saldo futuro mês a mês.

---

## Expense Forecast

Mostrar impacto das despesas recorrentes.

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

Mostrar mensagens de sucesso/erro.

Exemplo:

✓ Receita criada

✓ Despesa marcada como paga

✕ Erro ao salvar

---

## Confirm Dialog Component

Substituir:

window.confirm()

Por:

modal de confirmação customizado.

---

## Loading Indicators

Adicionar loading:

botões
tabelas
gráficos

---

## Mobile Responsiveness

Adaptar UI para celular.

Melhorias:

sidebar colapsável
tabelas responsivas
cards reorganizados

---

# Phase 5 — Recursos de SaaS

Prioridade: MÉDIA

---

## Household Invitations

Convidar parceiro por email.

Fluxo:

Usuário cria household
Envia convite
Outro usuário aceita

---

## Multi User Household

Permitir múltiplos usuários por household.

Papéis possíveis:

owner
member

---

## Audit Log

Registrar mudanças importantes.

Exemplo:

Usuário criou despesa
Usuário excluiu receita

---

# Phase 6 — Recursos Avançados

Prioridade: BAIXA

---

## Financial Goals

Criar metas financeiras.

Exemplo:

Meta:

Viagem
R$ 10.000

Progresso:

R$ 3.200 / R$ 10.000

---

## CSV Export

Exportar dados financeiros.

Despesas
Receitas
Relatórios

---

## Reports

Relatórios financeiros completos.

Mensal
Anual
Por categoria

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

# Immediate Next Step

Próxima implementação recomendada:

1️⃣ Criar **Accounts Page no frontend**

Depois:

2️⃣ Melhorar **Dashboard**

3️⃣ Implementar **Expense Categories**