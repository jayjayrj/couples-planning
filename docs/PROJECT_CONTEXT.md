# Project Context

## Visão Geral

O Couples Planning é um sistema de planejamento financeiro voltado para casais ou famílias (households).

O objetivo do sistema é permitir que membros de um mesmo household acompanhem receitas, despesas, metas financeiras e projeções futuras de forma colaborativa.

Cada usuário pertence a um ou mais households e os dados financeiros são sempre isolados por household.

---

## Principais Conceitos

### Household

O household representa uma unidade familiar ou grupo financeiro compartilhado.

Todos os dados financeiros são associados a um household:

- contas
- receitas
- despesas
- metas
- projeções

---

### Contas (Accounts)

As contas representam locais onde o dinheiro está armazenado ou movimentado.

Tipos de contas suportados:

- CHECKING (conta corrente)
- SAVINGS (poupança)
- CREDIT_CARD (cartão de crédito)
- CASH (dinheiro)

Cada conta possui:

- nome
- tipo
- saldo atual

---

### Receitas (Income)

Representam entradas de dinheiro.

Podem ser:

- únicas
- recorrentes (mensais)

Campos principais:

- descrição
- valor
- conta associada
- tipo de recorrência
- data inicial
- data final (opcional)

---

### Despesas (Expense)

Representam saídas de dinheiro.

Podem ser:

- despesas únicas
- despesas recorrentes
- despesas parceladas

Campos principais:

- descrição
- valor
- conta
- recorrência
- data

---

### Ledger

O sistema utiliza um ledger interno para registrar movimentações financeiras.

Toda criação de receita ou despesa gera um lançamento correspondente no ledger.

Isso permite manter consistência no saldo das contas.

---

## Importação de Dados Financeiros

O sistema possui suporte à importação de transações financeiras a partir de documentos PDF, como faturas de cartão de crédito ou extratos bancários.

### Pipeline de Importação

1. Usuário envia um PDF pela interface web
2. Backend tenta extrair texto usando Apache PDFBox
3. Se o PDF não possuir texto (documento escaneado), é utilizado OCR
4. O OCR utiliza Tesseract via Tess4J
5. O texto extraído é dividido em linhas
6. Um parser determinístico identifica possíveis transações
7. O backend gera um preview das transações
8. O usuário seleciona quais transações deseja importar
9. O backend cria despesas ou receitas correspondentes

---

### Preview de Importação

Endpoint:


POST /api/imports/pdf/preview


Responsabilidades:

- extrair texto do PDF
- detectar tipo de documento
- parsear transações
- detectar possíveis duplicidades
- retornar preview para o frontend

---

### Confirmação de Importação

Endpoint:


POST /api/imports/pdf/confirm


Responsabilidades:

- receber itens selecionados
- criar despesas ou receitas
- marcar despesas como pagas
- atualizar o ledger

---

### Tecnologias utilizadas

- Apache PDFBox
- Tesseract OCR (Tess4J)
- Parser determinístico baseado em regex
- Detecção de duplicidade baseada em histórico de transações

---

### Fluxo da Interface

1. Usuário seleciona conta destino
2. Usuário envia o arquivo PDF
3. Sistema gera preview das transações encontradas
4. Usuário seleciona quais transações deseja importar
5. Usuário confirma a importação

Recursos da interface:

- seleção individual de itens
- selecionar todos
- limpar seleção
- destaque para possíveis duplicidades