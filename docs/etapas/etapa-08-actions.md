# Etapa C — GitHub Actions

Estado: workflow escrito em 26 de outubro de 2026. O check verde no GitHub ainda depende do push.

## Contexto e tempo

A suíte que o repositório considera completa é `mvn verify`: H2 e, em seguida, o Postgres 16 do Testcontainers.

- Início: 26 de outubro de 2026.
- Fim: 26 de outubro de 2026 para o arquivo. O check no GitHub fica para o push.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

Nenhum. O arquivo nasceu nesta etapa. O runner ainda não executou.

## Tentativa que falhou

Nenhuma.

## Tradeoff e decisão

`mvn test` ficaria só no H2 e não rodaria `CargaPostgresIT`. O comando do workflow é `mvn -B verify`. O `ubuntu-latest` já tem Docker, então o workflow não declara `services: postgres`. O container do teste é efêmero e não é o volume `menu_carga_pg`.

## Solução

- `.github/workflows/test.yml`

## CAR

1. Push e pull request disparam a mesma suíte que `mvn verify` nesta máquina.
2. O workflow escolhe Java 17 e chama o Maven. O Testcontainers sobe o Postgres. O arquivo não configura banco.
3. O resultado visível é o check do GitHub depois do push. Esse check ainda não rodou.
