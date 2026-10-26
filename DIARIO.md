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

## Evolução A — trava de duplicidade

Estado: fechada com teste verde em 25 de outubro de 2026. `mvn test` passou: 11 testes, 0 falhas.

- Erro ou dificuldade: os dois testes nasceram vermelhos. O segundo `POST /concessoes` da Ana respondeu 201 em vez de 409. A carga com a Ana duas vezes gravou `persisted: 2` em vez de 1.
- Tradeoff e decisão: a checagem acontece antes do `save`, reusando `existsByPessoaAndPathAndAtivaTrue`. Uma violação de constraint no meio do `POST /cargas` marcaria a transação para rollback e derrubaria o lote, contra a regra de que linha inválida não derruba as outras. Por isso a carga também rejeita a linha duplicada antes de gravar, contra o banco e contra as linhas já aceitas do mesmo arquivo. O `409` usa o mesmo `ErroArquivo` do 400, porque o corpo `{ "error": ... }` já é o contrato de erro da API. O índice único em `(pessoa, path)` é a segunda trava, no banco. Índice simples, não parcial: toda linha nasce ativa e ainda não existe revogação.
- Solução: `ConcessaoDuplicadaException`, guarda em `ConcessaoService.conceder`, `@ExceptionHandler` com 409 no `ConcessaoController`, guarda de duplicidade no `CargaService`, `uniqueConstraints` na `Concessao`.
- CAR: Uma pessoa não ganha duas concessões ativas para o mesmo path. O service recusa antes de gravar; o controller traduz em 409; a carga devolve a linha em `errors` e grava as outras. `POST /concessoes` repetido responde 409 `{ "error": "concessao duplicada" }`; a carga com a Ana duas vezes responde 200, `persisted: 1`, linha 3 `concessao duplicada`.

Prova manual em 25 de outubro de 2026, ainda no H2. O segundo `POST /concessoes` da Ana respondeu 409 e o GET continuou `permitido: true`. O mesmo CSV com a Ana duas vezes, enviado depois desse POST, respondeu 200 com `persisted: 0` e as linhas 2 e 3 em `concessao duplicada`: as duas bateram na linha que já estava no banco. Com o processo reiniciado e a tabela vazia, o mesmo arquivo respondeu `persisted: 1` e só a linha 3 duplicada. O arquivo não vira 409. A duplicidade é erro de linha, no mesmo 200 das outras linhas recusadas.

Detalhe: [docs/etapas/etapa-05-duplicada.md](docs/etapas/etapa-05-duplicada.md).

## Evolução B — PostgreSQL

Estado: B3 fechada em 26 de outubro de 2026. V1 e V2 aplicadas no Postgres. O `mvn test` segue no H2. A prova de restart da Ana fica para a B4.

Preparação do ambiente. O Docker Desktop ficou no motor WSL2. O socket `/var/run/docker.sock` é `root:docker`, modo `660`. O usuário da WSL já estava no grupo `docker` no `/etc/group`, mas a sessão tinha começado antes disso: `id -nG` não listava `docker` e o `docker compose` respondia `permission denied`. O `newgrp` não existe nesta WSL. O socket não foi aberto com `chmod 666`. Saída imediata: `sudo docker compose`. Saída duradoura: `wsl --shutdown` no PowerShell do Windows e abrir o Ubuntu de novo, para a sessão carregar o grupo.

B1 fechada em 26 de outubro de 2026. `docker-compose.yml` sobe só o Postgres 16, banco `menu_carga`, volume `menu_carga_pg`. Credencial só local, no Compose. O `\dt` respondeu `Did not find any relations`.

B2 em observação. O H2 foi para escopo `test`. A execução usa o driver PostgreSQL, `ddl-auto=update`, SQL formatado e o logger `org.hibernate.tool.schema` em DEBUG. Flyway ainda desligado. O `mvn test` continuou no H2 (`jdbc:h2:mem:menu-carga`) e passou. Na subida contra o Postgres vazio, o Hibernate emitiu `create table concessao` (`id` identity, `ativa boolean not null`, `direito`, `modulo`, `path` e `pessoa` como `varchar(255) not null`, chave primária em `id`) e depois `alter table ... add constraint ... unique (pessoa, path)`. O nome do índice foi gerado pelo Hibernate. Antes do `add`, o `drop constraint if exists` avisou que a constraint ainda não existia; o `update` tenta alinhar o que já está no banco. Esse schema é observação: o `varchar(255)` e o nome do índice não são o contrato final.

Senha. Alternativas consideradas em 26 de outubro de 2026:

- Senha só no arquivo, sem variável. A leitura fica óbvia e o mesmo arquivo levaria a credencial local para qualquer outro ambiente.
- Variável de ambiente com valor local só quando a variável falta. Foi a escolha. Quem clona o repositório sobe o Compose nesta máquina. Em outro ambiente a plataforma injeta a variável e o valor do arquivo não entra. O `mvn test` não usa essa credencial: o `application.properties` de teste aponta para o H2.
- Cofre real (Vault, Secrets Manager ou Key Vault). A senha sairia do Git. A API passaria a depender de outro segredo, o acesso ao cofre, e de um serviço que o tech lead não tem ao rodar o projeto local.
- Cofre dentro do Compose, com token fixo. Subiria junto com o banco e o token voltaria ao repositório. O efeito é o contrário do cofre de produção.

Decisão: sem cofre nesta evolução. O arquivo declara a variável. O valor local existe para o Compose desta máquina.

B3, V1 aplicada em 26 de outubro de 2026. O Flyway entra na execução. O teste desliga o Flyway e segue no H2 com `create-drop`. `ddl-auto=validate`. A `V1__concessao.sql` cria `concessao` com chave, colunas e `ativa`, sem o único em `(pessoa, path)`. Na subida, o log registrou `Migrating schema "public" to version "1 - concessao"` e `Successfully applied 1 migration`. O Hibernate não emitiu `CREATE`.

B3, V2 aplicada em 26 de outubro de 2026. `V2__concessao_pessoa_path_unica.sql` adiciona `concessao_pessoa_path_uk` em `(pessoa, path)`. A mesma restrição voltou na entidade, com esse nome, para o `validate` achar o índice. O log registrou `Migrating schema "public" to version "2 - concessao pessoa path unica"` e `now at version v2`. A `V1` não rodou de novo. O `mvn test` passou.

Análises da B3, em 26 de outubro de 2026:

- Duas migrações, com parada no meio. A V1 só cria a tabela. A V2 só cria o índice. O ponto era olhar o `\d concessao` entre as duas, em vez de receber o schema inteiro de uma vez.
- O schema da B2 e a V1 não cabem no mesmo banco. O Flyway não inspeciona a tabela que já existe para pular uma versão. Ele só pula o que está em `flyway_schema_history` com sucesso. A V1 é `CREATE TABLE`. Com a `concessao` da B2 no volume, o Postgres responde `relation "concessao" already exists` e a versão 1 não fica marcada. Por isso o volume foi recriado uma vez, com `docker compose down -v`, antes da V1. Não foi por causa da anotação de único.
- O que o `\d` da V1 mostra de diferente da B2 é a ordem das colunas: `pessoa`, `modulo`, `path`, `direito`, `ativa`, e só o índice `concessao_pkey`. O par `(pessoa, path)` não está nessa tabela. Esse par é a V2. A primeira leitura, de que a diferença visual já era o índice único, estava errada.
- O Hibernate deixa de emitir DDL. Com `ddl-auto=validate` ele só compara a entidade com o schema e falha se os dois divergirem. `SELECT` e `INSERT` continuam dele. Quem muda tabela é o arquivo em `db/migration`.
- A anotação `uniqueConstraints` saiu na V1 e voltou na V2. Com ela ligada e a tabela sem o índice, o `validate` recusa a subida. O nome `concessao_pessoa_path_uk` é explícito nos dois lados. Sem o nome, o Hibernate geraria outro, como o `UKrn451rv1fj6h7wwoh1e6qmtfw` da B2, e o `validate` não reconheceria o índice do SQL.
- A checagem `existsByPessoaAndPathAndAtivaTrue` permanece. Ela existe para a API responder 409, e para a carga recusar a linha sem marcar a transação inteira para rollback. O índice não substitui essa checagem. Ele trava a corrida de dois processos gravando o mesmo par ao mesmo tempo.
- O volume `menu_carga_pg` agora guarda a tabela e o histórico das versões 1 e 2. `docker compose down` sem `-v` preserva isso. Outro `down -v` apagaria as duas migrações já aplicadas.

A carga manual e a etapa 4 fecharam no H2, antes desta evolução. O `mvn test` continua no H2, com o Flyway desligado, para a suíte não depender do Compose. O `mvn spring-boot:run` desta evolução grava no Postgres. A prova de que a Ana sobrevive a um restart fica na B4.

SQL Server ficou de fora deste módulo. O banco desta evolução é o PostgreSQL.
