# Etapa 1 — Esqueleto

Estado: fechada. `mvn test` com BUILD SUCCESS.

## Contexto e tempo

Laboratório local, módulo único, H2. Esta etapa cria o projeto Maven `menu-carga` em Java 17 com Spring Boot 3: `spring-boot-starter-web`, `validation`, `data-jpa`, `h2`, `spring-boot-starter-test`. Pacote `menucarga`. Um teste sobe o contexto. O README lista o que ficou de fora desta semana.

Em 20 de outubro de 2026 o esqueleto foi escrito e o teste validado no WSL. O teste `ContextoTest` nasceu antes da classe de aplicação.

- Início: 20 de outubro de 2026.
- Fim: 20 de outubro de 2026.
- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado.
- Estouro: não.

## Erro ou dificuldade

`zsh: command not found: java` e o mesmo para `mvn`, antes da instalação pelo `apt`.

## Tentativa que falhou

Nenhuma outra ferramenta de instalação foi usada nesta etapa.

## Tradeoff e decisão

- **Spring Boot 3.5.16** no parent Maven: última 3.x em OSS; linha 4 fora do escopo do laboratório.
- **`sudo apt install openjdk-17-jdk maven`**: JDK e Maven globais no Ubuntu/WSL, pouca fricção para um projeto só; troca aceita — versões da distro, menos flexibilidade que SDKMAN para alternar JDKs.

## Solução

- `pom.xml` — artefato `menu-carga`, Java 17, Web, Validation, Data JPA, H2 e test.
- `src/test/java/menucarga/ContextoTest.java` — sobe o contexto.
- `src/main/java/menucarga/MenuCargaApplication.java` — aplicação no pacote `menucarga`.
- `src/test/resources/application.properties` — `ddl-auto=create-drop`.
- `README.md` — o que ficou de fora e a frase do lote.
- Ambiente: OpenJDK 17.0.20.1, Maven 3.9.12 (`mvn -version` usando `/usr/lib/jvm/java-17-openjdk-amd64`).
- Evidência: `mvn test` → BUILD SUCCESS, `ContextoTest.sobe` passando.

## CAR

1. A etapa 1 prova que o processo Spring Boot sobe com Web, Validation, JPA e H2 nos testes, sem regra de concessão nem carga.
2. O JUnit 5 (`@SpringBootTest`) valida a subida do contexto; ainda não há controller nem fronteira HTTP de negócio.
3. O resultado observado é BUILD SUCCESS em `mvn test`; endpoints HTTP ficam para a etapa 2.

## Fora desta semana

XLSX, PostgreSQL, Flyway, Docker, Spring Security, login, JWT, `/v2`, CRUD de usuário, endpoint de revogação, seed em SQL, teste de exceção de banco no meio da transação. A trilha Angular fica no outro repositório.
