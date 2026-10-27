# B5 — API no Compose

Estado: fechada. A API responde na porta 8080 a partir do container. `mvn test` verde no H2.

## Contexto e tempo

A API deixa de depender do `mvn spring-boot:run` nesta máquina. O Compose sobe o Postgres que já existia e a imagem da API.

- Início: 26 de outubro de 2026.
- Fim: 26 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

A porta 8080 estava ocupada pelo processo da API da B4. O container não sobe enquanto esse processo escuta a porta.

## Tentativa que falhou

Nenhuma troca de porta. O processo local foi encerrado.

## Tradeoff e decisão

A imagem é construída em dois estágios, então `docker compose up --build` não exige um jar gerado antes. O `mvn package` da imagem usa `-DskipTests`: a suíte continua no host, e o Testcontainers não roda dentro do build. Na rede do Compose a URL é `jdbc:postgresql://postgres:5432/menu_carga`. O `mvn spring-boot:run` nesta máquina continua em `localhost:5432`. Credencial local: usuário `menu`, senha `menu`. O healthcheck `pg_isready` segura a API até o Postgres aceitar conexão. Recriar o container do Postgres para acrescentar o healthcheck não apaga o volume.

## Solução

- `Dockerfile`
- `.dockerignore`
- `docker-compose.yml`
- `README.md`

Na subida, o Flyway registrou `Schema "public" is up to date. No migration necessary.` O GET da Ana respondeu 200 `{ "permitido": true }` e o POST repetido respondeu 409 `{ "error": "concessao duplicada" }`. Depois de `docker compose restart api`, o schema continuou em dia e o GET continuou `true`.

## CAR

1. A API no container lê e recusa a concessão que já está no volume `menu_carga_pg`.
2. O Compose sobe Postgres e API; o host `postgres` só existe nessa rede; os testes do `mvn test` continuam no H2.
3. `GET /modulos/menu?pessoa=Ana` responde `{ "permitido": true }` e o segundo `POST /concessoes` da Ana responde 409 `{ "error": "concessao duplicada" }`.
