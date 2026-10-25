# Etapa 4 — Trava

Estado: fechada. `mvn test` verde, com `ConcessaoApiTest`.

## Contexto e tempo

Acrescenta o critério 4. Não mapeia `/modules/menu`. O path travado da consulta é `/modulos/menu`.

- Início: 25 de outubro de 2026.
- Fim: 25 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

Primeira execução de `menuSemPessoaRespondeOkEInglesNaoExiste`: status 400. Mensagem: `Required parameter 'pessoa' is not present`.

## Tentativa que falhou

Nenhuma. O vermelho era o `@RequestParam` obrigatório em `GET /modulos/menu`.

## Tradeoff e decisão

`pessoa` fica opcional. Sem pessoa, ou em branco, a resposta é 200 sem corpo e sem consulta. Com pessoa, o JSON continua `{ "permitido": true|false }`. A rota `/modules/menu` não é criada.

## Solução

- `src/test/java/menucarga/ConcessaoApiTest.java`
- `src/main/java/menucarga/api/controller/ConcessaoController.java`

## CAR

1. O path travado da consulta é `/modulos/menu`; `/modules/menu` não é rota.
2. O controller aceita o GET sem pessoa e só chama o service quando a pessoa vem preenchida.
3. `GET /modulos/menu` responde 200 e `GET /modules/menu` responde 404.

## Critério 4

Fechado.

- `GET /modulos/menu` responde 200.
- `GET /modules/menu` responde 404 porque essa rota não é criada.
