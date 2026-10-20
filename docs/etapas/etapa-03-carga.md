# Etapa 3 — Carga

Estado: não iniciada. Só começa com a etapa 2 verde e commitada.

## Contexto e tempo

Porta `LeitorDeLinhas`, implementação CSV atrás dessa porta, `POST /cargas`. Fecha com os critérios 1 e 2.

O controller não lê arquivo nem decide linha. Quem valida a linha não grava. O `Validator` roda na mão, dentro do processamento. O arquivo inteiro é validado. Persiste só as válidas, numa transação, depois da validação. Erro de linha não dá rollback.

- Início: —
- Fim: —
- Tempo estimado: 60–90 minutos.
- Tempo real: —
- Estouro: —

Se o tempo da carga estiver em risco e a rota da etapa 2 já estiver no ar, o critério 3 pode sair da semana. Os critérios 1 e 2 não saem.

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

## Critério 1

Ainda aberto. Fixture:

```csv
pessoa,modulo,path,direito
Ana,Cardapio,/modulos/cardapio,ACESSO
,Cardapio,/modulos/cardapio,ACESSO
```

`POST /cargas` responde 200, grava só a linha da Ana e devolve o erro da linha 3 com `campo obrigatorio`.

## Critério 2

Ainda aberto. Arquivo ausente, vazio ou com cabeçalho errado responde 400 `{ "error": "arquivo rejeitado" }` e a tabela fica vazia.
