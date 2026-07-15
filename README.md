# g9-br-techmind-team10



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