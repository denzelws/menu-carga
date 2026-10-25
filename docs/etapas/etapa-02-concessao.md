# Etapa 2 — Concessão

Estado: fechada. `mvn test` verde, com `ConcessaoApiTest`.

## Contexto e tempo

Entidade, repositório, `POST /concessoes`, `GET /modulos/menu`. Fecha com o critério 3. Testes passam pela API. Sem seed SQL.

Tabela `concessao`: `id`, `pessoa`, `modulo`, `path`, `direito`, `ativa`. Path aceito: `/modulos/menu`. Direito aceito: `ACESSO`. Toda linha persistida nasce com `ativa = true`.

- Início: 20 de outubro de 2026.
- Fim: 20 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

Primeira execução de `ConcessaoApiTest`, antes das rotas: status 404. Mensagem: `No static resource concessoes` e `No static resource modulos/cardapio`.

## Tentativa que falhou

Nenhuma. O vermelho era o teste da etapa sem controller.

## Tradeoff e decisão

`@Valid` no `POST /concessoes`. O record `NovaConcessao` recusa campo em branco, path diferente de `/modulos/menu` e direito diferente de `ACESSO`. O service só grava e força `ativa = true`.

## Solução

- `src/test/java/menucarga/ConcessaoApiTest.java`
- `src/main/java/menucarga/Concessao.java`
- `src/main/java/menucarga/ConcessaoRepository.java`
- `src/main/java/menucarga/ConcessaoService.java`
- `src/main/java/menucarga/ConcessaoController.java`

## CAR

1. A concessão só vale com pessoa, módulo, path `/modulos/menu` e direito `ACESSO`, e nasce ativa.
2. O controller recebe o HTTP e delega; o service grava e consulta; o repositório não conhece a rota.
3. POST válido responde 201. Corpo inválido responde 400 e nada persiste. GET da Ana responde permitido true; sem concessão, false.

## Critério 3

Fechado.

- `POST /concessoes` seguido de `GET /modulos/menu?pessoa=Ana` responde `{ "permitido": true }`.
- Sem concessão, o mesmo GET responde `{ "permitido": false }`.
