# Evolução A — trava de duplicidade

Estado: fechada. `mvn test` verde, 11 testes, 0 falhas.

## Contexto e tempo

Uma pessoa não ganha duas concessões ativas para o mesmo path. Vale no `POST /concessoes` e no `POST /cargas`.

- Início: 25 de outubro de 2026.
- Fim: 25 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

Os dois testes nasceram vermelhos: o segundo POST da Ana respondeu 201 em vez de 409; a carga com a Ana duas vezes gravou `persisted: 2` em vez de 1.

## Tentativa que falhou

Nenhuma. O vermelho era a ausência da trava.

## Tradeoff e decisão

A checagem acontece antes do `save`, reusando `existsByPessoaAndPathAndAtivaTrue`. Uma violação de constraint no meio da carga marcaria a transação para rollback e derrubaria o lote. O 409 reusa o `ErroArquivo` do 400. O índice único em `(pessoa, path)` é a segunda trava, no banco; simples, não parcial, porque toda linha nasce ativa e não há revogação.

## Solução

- `src/test/java/menucarga/ConcessaoApiTest.java`
- `src/test/java/menucarga/CargaApiTest.java`
- `src/main/java/menucarga/concessao/ConcessaoDuplicadaException.java`
- `src/main/java/menucarga/concessao/ConcessaoService.java`
- `src/main/java/menucarga/concessao/Concessao.java`
- `src/main/java/menucarga/api/controller/ConcessaoController.java`
- `src/main/java/menucarga/carga/CargaService.java`

## CAR

1. Uma pessoa não ganha duas concessões ativas para o mesmo path, nem pelo POST nem pela carga.
2. O service recusa antes de gravar; o controller traduz em 409; a carga devolve a linha em `errors` e grava as outras; o índice único trava no banco.
3. POST repetido responde 409 `{ "error": "concessao duplicada" }`; carga com a Ana duas vezes responde 200, `persisted: 1`, linha 3 `concessao duplicada`.
