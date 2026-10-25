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

Estado: fechada com teste verde. `mvn test` passou, incluindo `ConcessaoApiTest`.

- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado; escrita e validação no mesmo dia (20 de outubro de 2026).
- Erro ou dificuldade: o teste nasceu antes da rota. A primeira execução devolveu 404 (`No static resource concessoes` e `No static resource modulos/cardapio`).
- Tentativa que falhou: nenhuma implementação anterior. O vermelho era a ausência do endpoint.
- Tradeoff e decisão: `@Valid` no corpo do POST, com `@NotBlank` e `@Pattern` no record `NovaConcessao`. Path e direito fora do contrato viram 400 antes do service. `ativa` não entra no JSON; o service grava `true`.
- Solução: `Concessao`, `ConcessaoRepository`, `ConcessaoService`, `ConcessaoController`.
- CAR: A concessão só vale com os quatro campos preenchidos, path `/modulos/menu` e direito `ACESSO`, e nasce ativa. O controller recebe HTTP e delega; o service grava e consulta; o repositório não conhece a rota. `POST /concessoes` válido responde 201, corpo inválido responde 400 sem gravar, e `GET /modulos/menu?pessoa=Ana` responde `{ "permitido": true }` ou `{ "permitido": false }`. O path `/modulos/cardapio` foi trocado por `/modulos/menu` para o nome da rota acompanhar o módulo. `GET /modules/menu` continua sem mapeamento.

### Limpeza da entidade

Em 22 de outubro de 2026, `Concessao` ainda era um bean com getter e setter para cada campo. O service montava a linha com `new Concessao()` e `setAtiva(true)`. Nenhum getter era chamado. A consulta do repositório lê os campos pelo metamodelo do Hibernate, porque as anotações JPA estão nos campos.

Tradeoff: `ativar()` e `desativar()` foram descartados. A concessão nasce ativa, e esta semana não tem revogação. Um `desativar()` criaria um estado que nenhuma rota usa. A validação de path e direito permanece no DTO `NovaConcessao`; repetir essa regra na entidade misturaria HTTP com persistência.

Decisão: construtor `Concessao(pessoa, modulo, path, direito)` grava `ativa = true`. O construtor vazio ficou `protected`, só para o JPA reidratar a linha. Getters e setters saíram. A busca no projeto mostrou um único ponto de montagem, o `ConcessaoService`. Testes passam pela API e não instanciam a entidade. Não há job. `mvn test` continuou verde.

Detalhe: [docs/etapas/etapa-02-concessao.md](docs/etapas/etapa-02-concessao.md).

## Etapa 3 — Carga

Estado: fechada com teste verde. `mvn test` passou, incluindo `CargaApiTest`.

- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado; escrita e validação em 25 de outubro de 2026.
- Erro ou dificuldade: o teste nasceu antes da rota. A primeira execução devolveu 404 (`No static resource cargas`).
- Tentativa que falhou: nenhuma implementação anterior. O vermelho era a ausência de `POST /cargas`.
- Tradeoff e decisão: a fronteira fica no tipo da falha. Arquivo ausente, vazio ou com cabeçalho diferente responde 400 e nada persiste. Campo em branco, path diferente de `/modulos/menu` ou direito diferente de `ACESSO` responde 200, grava as outras linhas e devolve o erro da linha. O `Validator` roda na mão sobre `NovaConcessao`; as mensagens do lote (`campo obrigatorio`, `path invalido`, `direito invalido`) são traduzidas no `ValidadorDeLinha`, porque o Bean Validation não usa esses textos. Quem valida não grava. A gravação das válidas acontece depois, na mesma transação do `CargaService`.
- Solução: `LeitorDeLinhas`, `LeitorCsv`, `ValidadorDeLinha`, `CargaService`, `CargaController`. A parte multipart se chama `arquivo`.
- CAR: O arquivo lido responde 200 mesmo com linha inválida; arquivo ausente, vazio ou com cabeçalho errado responde 400 e não grava. O controller só recebe o multipart; o `LeitorCsv` lê as linhas atrás de `LeitorDeLinhas`; o `ValidadorDeLinha` decide a linha e o `ConcessaoService` grava só as aceitas. `POST /cargas` da Ana devolve `persisted: 1` e o erro da linha 3 com `campo obrigatorio`.

Prova manual em 25 de outubro de 2026, ainda no H2. O `curl` com `-F "arquivo=@regras.csv"` respondeu 200, `persisted: 0`, linha 2 `path invalido` e linha 3 `direito invalido`. Nada foi gravado.

O mesmo arquivo no Insomnia respondeu 400 `{ "error": "arquivo rejeitado" }`. O Body estava em File, então o CSV ia no corpo cru, sem o campo `arquivo`. O controller trata parte ausente como arquivo rejeitado e nem lê as linhas. O acerto é Multipart Form, campo com o nome `arquivo` e tipo File. O curl já montava essa parte; por isso os dois clientes divergiam com o arquivo certo.

Detalhe: [docs/etapas/etapa-03-carga.md](docs/etapas/etapa-03-carga.md).

## Etapa 4 — Trava

Estado: fechada com teste verde. `mvn test` passou, incluindo `ConcessaoApiTest`.

- Tempo estimado: 60–90 minutos.
- Tempo real: não cronometrado; escrita e validação em 25 de outubro de 2026.
- Erro ou dificuldade: o teste nasceu antes de soltar o parâmetro. `GET /modulos/menu` sem `pessoa` respondeu 400 (`Required parameter 'pessoa' is not present`).
- Tentativa que falhou: nenhuma rota nova. O vermelho era o `@RequestParam` obrigatório.
- Tradeoff e decisão: `pessoa` fica opcional. Sem pessoa, ou com valor em branco, a rota responde 200 e não consulta o banco, para não devolver `permitido: false` de alguém que não foi pedido. Com pessoa, o corpo continua `{ "permitido": true|false }`. `/modules/menu` não ganha mapeamento.
- Solução: `ConcessaoController.consultar` e o teste `menuSemPessoaRespondeOkEInglesNaoExiste`.
- CAR: O path travado da consulta é `/modulos/menu`; `/modules/menu` não é rota. O controller aceita o GET sem pessoa e só chama o service quando a pessoa vem preenchida. `GET /modulos/menu` responde 200 e `GET /modules/menu` responde 404.

Detalhe: [docs/etapas/etapa-04-trava.md](docs/etapas/etapa-04-trava.md).

## Evolução futura — PostgreSQL

Estado: anotada em 25 de outubro de 2026. Não implementada.

O `mvn spring-boot:run` grava no H2 em memória. A concessão manual no Insomnia passou: o `POST` 201 e o `GET` da Ana leu a linha. Ao encerrar o processo, a tabela some. A carga manual também passou no H2, pelo `curl`.

Decisão de momento: a carga manual e a etapa 4 fecharam no H2. O PostgreSQL continua fora do código e entra na execução, com o `mvn test` no H2.

Tradeoff: trocar o banco antes da carga manual mistura falha de CSV com falha de conexão, dialeto ou tabela. Trocar no meio da etapa 4 mistura rota com persistência. No `mvn test`, o H2 com `create-drop` permanece, para a suíte não exigir um servidor ligado. Na execução, o H2 sai e entram driver, URL, usuário e senha. Entidade, repositório e HTTP ficam. O sinal de que a troca funcionou é desligar a aplicação, subir de novo e o `GET` da Ana continuar `true`.

SQL Server ficou de fora deste módulo. O banco desta evolução é o PostgreSQL.
