# Diário — menu-carga

Registro corrido do laboratório. Uma seção por etapa, fechada só depois do teste verde. O `README.md` do projeto não recebe este diário: lá ficam a lista do que ficou de fora, a frase de que a linha inválida não derruba o lote, e o ponteiro para os testes.

Fonte bruta para o portfólio. O índice curado está em [docs/guia-portfolio.md](docs/guia-portfolio.md). O detalhe de cada etapa está em [docs/etapas/](docs/etapas/).

## Ritual

1. O teste da etapa nasce antes da implementação. Não avance com esse teste vermelho.
2. Durante a etapa, anote aqui em rascunho: erro real, tentativa que falhou, tradeoff, decisão. Não invente falha que não aconteceu.
3. Estourou 90 minutos: pare a feature nova e deixe o teste daquela etapa verde.
4. Com o teste verde, complete a seção desta etapa e o arquivo em `docs/etapas/`, incluindo o CAR em três frases: a regra, quem faz o quê na fronteira, o resultado HTTP.
5. Só então faça o commit da etapa e a tag. Não commite implementação com teste vermelho.
6. A etapa seguinte só começa depois desse fechamento.
7. O push para o GitHub espera o fechamento da etapa 4, salvo decisão explícita de publicar antes.

### Git

Repositório local desde o início da documentação. `.gitignore` cobre Maven, Java e IDE.

Commit só com o teste da etapa verde. **Mensagens em inglês** (assunto curto, corpo opcional em 1–2 frases):

```bash
git add -A
git commit -m "stage N: <green outcome>"
git tag etapa-N
```

Exemplos: `stage 1: Spring Boot skeleton and green ContextoTest`, `docs: development diary and portfolio guide`.

Publicação posterior, ao fechar a etapa 4:

```bash
# criar o repositório menu-carga no GitHub e então:
git remote add origin git@github.com:<usuario>/menu-carga.git
git push -u origin main --tags
```

Conferir no GitHub o `README.md` mínimo, este `DIARIO.md` e `docs/`. O link entra em `docs/guia-portfolio.md`. Não criar a rota `/modules/menu`. Não copiar a trilha Angular.

### Template de cada etapa

- Contexto e tempo real (faixa de 60–90 minutos; onde estourou ou parou).
- Erro ou dificuldade encontrada (mensagem real de teste, log, stack curta).
- Tentativa que falhou.
- Tradeoff considerado e decisão.
- Solução aplicada e o arquivo que prova.
- CAR em três frases.

## Etapa 1 — Esqueleto

Estado: fechada com teste verde. `mvn test` terminou em **BUILD SUCCESS**; `menucarga.ContextoTest#sobe` passou.

- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado; ambiente instalado e teste validado no mesmo dia (20 de outubro de 2026).
- Erro ou dificuldade: antes do `apt`, `java` e `mvn` retornavam `zsh: command not found` no WSL.
- Tentativa que falhou: nenhuma tentativa de instalação alternativa (SDKMAN, wrapper) nesta etapa; o bloqueio era só PATH vazio.
- Tradeoff e decisão: (1) Spring Boot **3.5.16** no `pom.xml`, última linha 3.x em OSS, porque o laboratório pede Spring Boot 3 e não a 4. (2) **Java 17 e Maven pelo `apt`** (`sudo apt install openjdk-17-jdk maven`): instalação global no Ubuntu/WSL, simples para um único lab, em troca de ficar preso à versão empacotada pela distro (OpenJDK 17.0.20.1, Maven 3.9.12) em vez de gerenciar vários JDKs com SDKMAN.
- Solução: `pom.xml`, `MenuCargaApplication`, `ContextoTest`, `src/test/resources/application.properties`, `README.md`; ambiente com `java -version` / `mvn -version` apontando para `/usr/lib/jvm/java-17-openjdk-amd64`.
- CAR: A etapa 1 só exige que o contexto Spring suba com as dependências do laboratório, sem endpoint de negócio. O JUnit 5 com `@SpringBootTest` prova a subida; o controller e o HTTP entram nas etapas seguintes. Resultado: `mvn test` com BUILD SUCCESS; ainda não há rota HTTP nesta etapa.

Critério de fechamento: atendido.

Detalhe: [docs/etapas/etapa-01-esqueleto.md](docs/etapas/etapa-01-esqueleto.md).

## Etapa 2 — Concessão

Estado: não iniciada. Fecha com o critério 3.

Detalhe: [docs/etapas/etapa-02-concessao.md](docs/etapas/etapa-02-concessao.md).

## Etapa 3 — Carga

Estado: não iniciada. Fecha com os critérios 1 e 2.

Detalhe: [docs/etapas/etapa-03-carga.md](docs/etapas/etapa-03-carga.md).

## Etapa 4 — Trava

Estado: não iniciada. Acrescenta o critério 4. Não mapeia `/modules/menu`.

Detalhe: [docs/etapas/etapa-04-trava.md](docs/etapas/etapa-04-trava.md).
