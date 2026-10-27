# Integração — carga no Postgres

Estado: fechada. `mvn test` verde no H2. `mvn verify` verde, 1 teste de integração, 0 falhas.

## Contexto e tempo

A suíte do H2 não aplica `V1` nem `V2`. Esta etapa prova a carga CSV num Postgres 16 que o Flyway acabou de migrar. A API no Compose continua para a B5.

- Início: 26 de outubro de 2026.
- Fim: 26 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

O teste nasceu antes da dependência. `mvn test-compile` falhou com `package org.testcontainers.containers does not exist`.

O primeiro `mvn verify` falhou com `Could not find a valid Docker environment` e `Can't get Docker image: postgres:16`.

## Tentativa que falhou

A sessão da WSL não carregava o grupo `docker`, embora o usuário já estivesse nele no `/etc/group`. O socket `/var/run/docker.sock` é `root:docker`, modo `660`. Abrir o socket com `chmod 666` ficou de fora.

## Tradeoff e decisão

O arquivo termina em `IT.java` e roda no Failsafe. `mvn test` continua no H2, com o Flyway desligado, e não exige Docker. `mvn verify` sobe `postgres:16` só para `CargaPostgresIT`, com `@ServiceConnection`, `spring.flyway.enabled=true` e `ddl-auto=validate`. O container não usa o volume `menu_carga_pg`. A etapa C passa a ser `mvn verify` num runner com Docker, sem serviço de Postgres no workflow; o workflow em si não entra agora.

## Solução

- `src/test/java/menucarga/CargaPostgresIT.java`
- `pom.xml`
- Segunda execução: `sudo -g docker mvn verify`. Testcontainers 1.21.4, Postgres 16.15, banco `test`. O log registrou `Successfully applied 2 migrations to schema "public", now at version v2`. Relatório: `Tests run: 1, Failures: 0`.

## CAR

1. A carga no Postgres real grava só a linha válida e devolve o erro da linha inválida, sobre o schema que o Flyway aplicou.
2. O teste de integração sobe o container e liga o Flyway; os testes de `mvn test` continuam no H2 e não conhecem esse container.
3. `POST /cargas` responde 200, `persisted: 1`, linha 3 `campo obrigatorio`, e `GET /modulos/menu?pessoa=Ana` responde `{ "permitido": true }`. O histórico tem as versões 1 e 2, e o índice `concessao_pessoa_path_uk` existe.
