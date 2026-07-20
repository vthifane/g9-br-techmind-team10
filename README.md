# g9-br-techmind-team10

# TechMind — Plataforma de Catalogação Inteligente de Conteúdos Técnicos

## Visão geral

O **TechMind** é uma aplicação desenvolvida para organizar, classificar e consultar conteúdos técnicos de forma mais eficiente. A proposta do projeto é permitir que usuários cadastrem textos, artigos, anotações ou materiais de estudo, e que esses conteúdos sejam categorizados por tags técnicas, facilitando futuras buscas e revisões.

O projeto está sendo desenvolvido como parte do desafio da **NoCountry**, pela equipe **G9 Team10**.

## Objetivo do projeto

O objetivo principal é criar uma biblioteca técnica inteligente, onde o usuário possa:

- Cadastrar conteúdos técnicos.
- Consultar conteúdos por tags e categorias.
- Visualizar detalhes completos dos conteúdos.
- Manter histórico de leitura.
- Favoritar conteúdos importantes.
- Organizar conteúdos com tags personalizadas próprias.

A ideia é que a plataforma funcione como um ambiente de apoio ao estudo, à pesquisa e à revisão de temas técnicos.

## Tecnologias utilizadas

### Backend

- Java 17
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Flyway
- Oracle Database
- Docker

### Frontend

- HTML
- CSS
- JavaScript
- Nginx para servir o frontend em ambiente Docker

### Banco de dados

- Oracle Database Free em ambiente local via Docker
- Estrutura versionada com migrations Flyway

## Funcionalidades implementadas até o momento

### Autenticação

O sistema possui autenticação com JWT, permitindo que usuários criem conta, façam login e acessem endpoints protegidos.

Funcionalidades disponíveis:

- Cadastro de usuário.
- Login.
- Proteção de rotas autenticadas.
- Identificação do usuário logado por token.

### Conteúdos técnicos

O usuário pode cadastrar conteúdos técnicos na plataforma. Cada conteúdo possui informações como:

- Título.
- Texto completo.
- Categoria.
- Probabilidade/confiança da classificação.
- Tags técnicas associadas.
- Data de processamento.

A API também permite consultar o detalhe completo de um conteúdo específico.

### Tags globais do sistema

O projeto possui um sistema de tags globais, associadas aos conteúdos técnicos. Essas tags representam a classificação geral do conteúdo, como por exemplo:

- backend
- frontend
- java
- spring-boot
- cloud
- docker
- database
- security

Essas tags são utilizadas para a busca principal da biblioteca.

### Busca por tags

A biblioteca permite buscar conteúdos a partir de uma ou mais tags. O backend retorna conteúdos que correspondem aos filtros selecionados pelo usuário.

Essa funcionalidade já está integrada ao frontend e permite consultar os conteúdos disponíveis na base.

### Histórico de leitura

Foi implementado um sistema de histórico, no qual o backend registra quando o usuário acessa o detalhe de um conteúdo. Com isso, o usuário consegue consultar os conteúdos que já visualizou anteriormente.

Endpoint principal:

```http
GET /content/history
```

### Favoritos

O sistema também permite que o usuário favorite e remova conteúdos dos favoritos.

Endpoints principais:

```http
GET    /content/favorites
POST   /content/{id}/favorite
DELETE /content/{id}/favorite
```

Essa funcionalidade já está integrada ao frontend.

### Contador de conteúdos por categoria

Foi adicionado um endpoint para retornar a quantidade de conteúdos agrupados por categoria.

Endpoint:

```http
GET /content/count
```

Esse recurso pode ser utilizado futuramente para dashboards, indicadores ou visualizações estatísticas da biblioteca.

## Tags personalizadas do usuário

Também foi iniciado o backend para um sistema de **tags personalizadas**.

Diferente das tags globais do sistema, as tags personalizadas pertencem exclusivamente ao usuário logado. Elas permitem que cada pessoa organize conteúdos de acordo com sua própria lógica, por exemplo:

- Ler depois.
- Revisar.
- Importante.
- Projeto pessoal.
- Estudo faculdade.

Para evitar conflito com as tags globais, foi criada uma estrutura separada no banco de dados.

Tabela criada:

```text
user_content_tag
```

Essa tabela relaciona:

```text
usuário + conteúdo + tag personalizada
```

Endpoints planejados/implementados no backend:

```http
GET    /content/{contentId}/personal-tags
POST   /content/{contentId}/personal-tags
DELETE /content/{contentId}/personal-tags/{tagId}

GET    /content/personal-tags
GET    /content/personal-tags/search?tags=ler-depois
```

Regras principais:

- O frontend não envia `userId`.
- O usuário é identificado pelo token JWT.
- Um usuário não pode ver nem remover tags personalizadas de outro usuário.
- Tags iguais com variações de maiúsculas, acentos ou espaços são normalizadas para evitar duplicidade.

Exemplo:

```text
"Ler depois"
"LER   DEPOIS"
"ler depois"
```

Todas são tratadas como:

```text
ler-depois
```

## Organização atual da arquitetura

O backend segue uma estrutura em camadas:

```text
Controller → Service → Repository → Database
```

Principais responsabilidades:

- **Controller:** expõe os endpoints da API.
- **Service:** concentra as regras de negócio.
- **Repository:** realiza consultas no banco.
- **DTOs:** padronizam os dados recebidos e enviados pela API.
- **Migrations Flyway:** versionam a estrutura do banco de dados.

## Ambiente local

O projeto pode ser executado localmente com Docker Compose.

Comando principal:

```bash
docker compose up --build
```

A aplicação sobe com:

- Backend Spring Boot.
- Frontend servido por Nginx.
- Banco Oracle local.
- Migrations aplicadas automaticamente pelo Flyway.

URLs principais em ambiente local:

```text
Frontend: http://localhost/
Backend:  http://localhost:8080
Swagger:  http://localhost:8080/swagger-ui/index.html
```

## Status atual

Atualmente o projeto já possui:

- Backend estruturado com Spring Boot.
- Banco Oracle com migrations.
- Autenticação JWT.
- Cadastro e login de usuários.
- Cadastro de conteúdos.
- Busca por tags globais.
- Histórico de leitura.
- Favoritos.
- Contagem de conteúdos por categoria.
- Backend inicial para tags personalizadas do usuário.
- Frontend funcional para biblioteca, envio de conteúdo, favoritos e histórico.

## Próximos passos

Os próximos passos previstos são:

- Finalizar a integração das tags personalizadas com o frontend.
- Permitir que o usuário crie, visualize e remova suas próprias tags na tela de detalhe do conteúdo.
- Permitir busca ou filtro de conteúdos por tags personalizadas.
- Integrar melhorias relacionadas à confiança da classificação do conteúdo.
- Evoluir a experiência visual da biblioteca e da organização pessoal dos conteúdos.

# Data Science

# 🔎 **Coleta de Dados**

## Origem dos Dados

A DEV Community é uma comunidade com mais de três milhões de desenvolvedores de software [1] . No site, os desenvolvedores escrevem artigos (posts de blog, perguntas em fóruns de discussão, tópicos de ajuda, etc.), participam de discussões e constroem seus perfis profissionais [2].

O site é hospedado pelo FOREM [2], um software de código aberto para a construção de comunidades. Na documentação do FOREM é disponibilizada uma API pública [3] que retorna os textos publicados, tags sobre o assunto tratado, entre outras informações. A documentação da API não estabelece uma licença específica para os dados disponibilizados. Os dados que podem identificar de alguma forma os autores dos textos foram ocultados.

Para realizar a coleta dos dados foi utilizada a versão 1 [4] da API pública do DEV Community

### ⚖️ Governança de Dados, Ética e Licenciamento

Os dados brutos coletados por este script são obtidos de forma pública, respeitando as diretrizes de taxa de requisição da plataforma (*rate-limiting* via pausas controladas no código).

Em conformidade com as políticas do site DEV.to, os artigos textuais consumidos estão sob a licença padrão **Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)**.[5]

## O Problema

Para realizar o projeto TechMind no Hackathon ONE, é necessário obter textos técnicos da área de tecnologia para treinar um modelo de classificação de textos. O modelo irá classificar os textos pelo assunto principal, que aqui estamos chamando de categoria. Os dados obtidos, através da API, não possuem um target que represente a categoria. Porém os artigos publicados no site Dev Community, possuem tags associadas a eles, que representam o tema do artigo. Conforme a documentação da API, essas tags podem ser utilizadas nos parametros da API para obter artigos especificos. Dito isso, se faz necessário realizar a Rotulagem de Dados (Data Labeling), gerando assim o target de cada texto.

Além disso, será necessária a extração de uma amostra dos dados para validação manual dos textos, afim de conferir se os mesmos são realmente da categoria a que foi associado. Dessa forma iremos validar a qualidade dos dados e consequentemente viabilizar a utilização dos mesmos no projeto.

A coleta de dados será realizada no sprint 1.

## Próximos passos

Os próximos passos previstos são:

- Análise Exploratória (EAD) + verificação sobre desbalanceamento de categorias
- Tratamento de texto (lowercase, remoção de ruído, stopwords, tokenização simples)
- Vetorização TF-IDF
- Separação Treino e Teste
- Aplicação de 3 modelos (SVM, Regressão Logística, Naive Bayes)
- Escolha do melhor modelo
- Serialização

## Refererências

> * **[1]** DEV COMMUNITY. *Site*. Disponível em: [https://dev.to/](https://dev.to/). Acesso em: 9 jul. 2026.
> * **[2]** FOREM. *Sobre dev.to*. Disponível em: [https://github.com/forem/forem/](https://github.com/forem/forem/). Acesso em: 9 jul. 2026.
> * **[3]** API. *Versões da API*. Disponível em: [https://developers.forem.com/api](https://developers.forem.com/api). Acesso em: 9 jul. 2026.
> * **[4]** Forem API V1. *Documentação da API*. Disponível em: [https://developers.forem.com/api/v1](https://developers.forem.com/api/v1). Acesso em: 9 jul. 2026.
> * **[5]** Licença (CC BY-SA 4.0): [https://creativecommons.org/licenses/by-sa/4.0/deed.en](https://creativecommons.org/licenses/by-sa/4.0/deed.en)



## Rodando o projeto localmente com Docker Compose

O projeto pode ser executado localmente com Docker Compose, subindo automaticamente:

```text
- Oracle Database 26ai Free
- Backend Spring Boot
- Frontend Nginx
```

### Pré-requisitos

É necessário ter instalado:

```text
- Docker Desktop
- Docker Compose
```

No Windows, o Docker Desktop deve estar rodando com Linux containers.

### Subir o projeto

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Na primeira execução, o Docker fará o download da imagem do Oracle Database 26ai Free, o que pode demorar alguns minutos.

Quando os containers estiverem rodando, acesse:

```text
Frontend:
http://localhost/

Backend:
http://localhost:8080

Swagger:
http://localhost:8080/swagger-ui/index.html
```

### Verificar containers

Em outro terminal, na raiz do projeto:

```bash
docker compose ps
```

O esperado é ver os três containers rodando:

```text
techmind-oracle-db
techmind-backend
techmind-frontend
```

### Parar o projeto

No terminal onde o Docker Compose está rodando:

```text
Ctrl + C
```

Ou, em outro terminal:

```bash
docker compose down
```

### Subir novamente sem rebuild

Depois da primeira execução, normalmente basta rodar:

```bash
docker compose up
```

Use `--build` novamente quando alterar Dockerfile, dependências ou configurações relevantes.

### Resetar o banco local

Para apagar o banco local e recriar tudo do zero:

```bash
docker compose down -v
docker compose up --build
```

Atenção: o comando `docker compose down -v` remove o volume do Oracle e apaga os dados locais.
