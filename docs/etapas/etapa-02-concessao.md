# Etapa 2 — Concessão

Estado: não iniciada. Só começa com a etapa 1 verde e commitada.

## Contexto e tempo

Entidade, repositório, `POST /concessoes`, `GET /modulos/cardapio`. Fecha com o critério 3. Testes passam pela API. Sem seed SQL.

Tabela `concessao`: `id`, `pessoa`, `modulo`, `path`, `direito`, `ativa`. Path aceito: `/modulos/cardapio`. Direito aceito: `ACESSO`. Toda linha persistida nasce com `ativa = true`.

- Início: —
- Fim: —
- Tempo estimado: 60–90 minutos.
- Tempo real: —
- Estouro: —

## Erro ou dificuldade

—

## Tentativa que falhou

—

## Tradeoff e decisão

—

## Solução

—

## CAR

1. —
2. —
3. —

## Critério 3

Ainda aberto.

- `POST /concessoes` seguido de `GET /modulos/cardapio?pessoa=Ana` responde `{ "permitido": true }`.
- Sem concessão, o mesmo GET responde `{ "permitido": false }`.
