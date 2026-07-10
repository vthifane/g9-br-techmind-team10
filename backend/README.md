# Backend Service - TechMind Team 10

## 1. Visão Geral
API REST responsável pela autenticação e serviços core do projeto TechMind, desenvolvido durante o Hackathon No Country G9.

**Stack:** Java 17, Spring Boot 3.3.0, Gradle 8.8, H2 Database, GitHub Actions.

## 2. Decisões de Arquitetura

### 2.1 Build System
**Data:** 2026-07-08  
**Status:** Implementado  
**Contexto:** Necessidade de padronização do ambiente de build para garantir consistência entre ambientes de desenvolvimento local e pipelines de CI/CD.  
**Decisão:** Migração do Apache Maven para Gradle.  
**Consequências:** Redução do tempo de build, simplificação da declaração de dependências, integração nativa com GitHub Actions e melhor performance em builds incrementais.

## 3. Como Executar o Projeto

```bash
git clone https://github.com/VGNelo/g9-br-techmind-team10.git
cd g9-br-techmind-team10/backend
./gradlew bootRun 
A API estará disponível em http://localhost:8080.

4. Pipeline CI/CD
Integração e entrega contínua configurada com GitHub Actions. O pipeline é acionado a cada push na main.

5. Deploy
A aplicação é containerizada utilizando Docker. Deploy realizado na Oracle Cloud Infrastructure (OCI).
```

## 4. Como fazer o Cadastro e Login

Rota para o Cadastro:
- POST auth/register
```bash
{
    "name": "Carlos",
    "email": "carlos@email.com",
    "password": "654321"
}
````

Rota para o Login:
- POST auth/login
```bash
{
    "email": "carlos@email.com",
    "password": "654321"
}
````

Após o Login, ele ira retornar um TOKEN, use esse TOKEN para liberar rotas bloqueadas. **Bearer Token** é o nome do tipo de autentificação.


