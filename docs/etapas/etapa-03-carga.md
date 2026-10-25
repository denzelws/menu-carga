# Etapa 3 — Carga

Estado: fechada. `mvn test` verde, com `CargaApiTest`.

## Contexto e tempo

Porta `LeitorDeLinhas`, implementação CSV atrás dessa porta, `POST /cargas`. Fecha com os critérios 1 e 2.

O controller não lê arquivo nem decide linha. Quem valida a linha não grava. O `Validator` roda na mão, dentro do processamento. O arquivo inteiro é validado. Persiste só as válidas, numa transação, depois da validação. Erro de linha não dá rollback.

- Início: 25 de outubro de 2026.
- Fim: 25 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

Primeira execução de `CargaApiTest`, antes da rota: status 404. Mensagem: `No static resource cargas`.

## Tentativa que falhou

Nenhuma. O vermelho era o teste da etapa sem `POST /cargas`.

## Tradeoff e decisão

Arquivo ausente, vazio ou cabeçalho diferente: 400, nada persiste. Campo em branco, path diferente de `/modulos/menu` ou direito diferente de `ACESSO`: 200, grava as outras linhas e devolve o erro da linha. O `Validator` roda sobre `NovaConcessao`; o `ValidadorDeLinha` traduz a violação para a mensagem do lote e não grava.

## Solução

- `src/test/java/menucarga/CargaApiTest.java`
- `src/main/java/menucarga/carga/LeitorDeLinhas.java`
- `src/main/java/menucarga/carga/LeitorCsv.java`
- `src/main/java/menucarga/carga/ValidadorDeLinha.java`
- `src/main/java/menucarga/carga/CargaService.java`
- `src/main/java/menucarga/api/CargaController.java`

## CAR

1. O arquivo lido responde 200 mesmo com linha inválida; arquivo ausente, vazio ou com cabeçalho errado responde 400 e não grava.
2. O controller recebe o multipart; o CSV fica atrás de `LeitorDeLinhas`; quem valida a linha não grava; o service grava só as aceitas, depois da validação.
3. A fixture da Ana responde 200, `persisted: 1` e o erro da linha 3 com `campo obrigatorio`.

## Critério 1

Fechado. Fixture:

```csv
pessoa,modulo,path,direito
Ana,Cardapio,/modulos/menu,ACESSO
,Cardapio,/modulos/menu,ACESSO
```

`POST /cargas` responde 200, grava só a linha da Ana e devolve o erro da linha 3 com `campo obrigatorio`.

## Critério 2

Fechado. Arquivo ausente, vazio ou com cabeçalho errado responde 400 `{ "error": "arquivo rejeitado" }` e a tabela fica vazia.
