# SENAI - Curso Técnico em Desenvolvimento de Sistemas

![Imagem de capa](/gifs/WR%20FIT-ADM.gif)

**Descrição:**

Este projeto disponibiliza uma interface web administrativa para o gerenciamento de clientes em um sistema de controle de acesso para academias. Desenvolvida com HTML, Tailwind CSS e JavaScript, a interface permite adicionar, visualizar, editar e excluir informações de clientes, interagindo com uma API RESTful externa (Python com Flask e Firebase).  Oferece funcionalidades CRUD completas, pesquisa eficiente por nome e CPF, e uma apresentação clara em tabelas para uma administração otimizada.

## Índice

* [Funcionalidades](#funcionalidades)
* [Tecnologias Utilizadas](#tecnologias-utilizadas)
* [Como Executar](#como-executar)
    * [Pré-requisitos](#pré-requisitos)
    * [Configuração da API](#configuração-da-api)
    * [Execução do Front-end](#execução-do-front-end)
* [API (Backend)](#api-backend)
* [Autor](#autor)
* [Licença](#licença)


## Funcionalidades

* **Listagem de Clientes:** Apresenta todos os clientes cadastrados, ordenados alfabeticamente e com indicação de status (ativo/inativo).
* **Pesquisa:** Permite filtrar a lista de clientes por nome ou CPF, facilitando a localização de registros específicos.

![gif de funcionalidades](/gifs/pesquisawrfit.gif) 

* **Cadastro de Novos Clientes:** Formulário intuitivo para adicionar novos clientes ao sistema, validando os campos nome e CPF.
* **Edição de Clientes:** Permite modificar as informações (nome e CPF) de clientes existentes.
* **Exclusão de Clientes:** Possibilidade de remover clientes do sistema com uma confirmação para evitar exclusões acidentais.
* **Alteração de Status:** Permite alternar o status de um cliente entre "ativo" e "inativo".

![gif de funcionalidades](/gifs/crudwrfit.gif)

* **Feedback ao Usuário (Toasts):** Exibe mensagens de confirmação, sucesso, erro e alertas, fornecendo feedback claro sobre as ações realizadas.


## Tecnologias Utilizadas

![image](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![image](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![image](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![image](https://img.shields.io/badge/Lucide_Icons-3298DC?style=for-the-badge&logo=lucide&logoColor=white)

## Como Executar

### Pré-requisitos

* Node.js e npm (para executar o código front-end, se necessário)
* Python 3.x e pip (para executar a API)
* Conta do Google Cloud e projeto do Firebase configurado (para o back-end)


### Configuração da API

1. **Clone o repositório da API:** (Forneça o link para o repositório da sua API em Python)
2. **Instale as dependências:** `pip install -r requirements.txt`
3. **Configure as variáveis de ambiente:**  Crie um arquivo `.env` na raiz do projeto da API e adicione sua `CONFIG_FIREBASE` (chave do seu projeto Firebase em formato JSON).  Exemplo:
CONFIG_FIREBASE = "{
"type": "service_account",
"project_id": "seu-projeto-firebase",
"private_key_id": "sua-private-key-id",
...
}"
4. **Execute a API:** `python app.py`


### Execução do Front-end

1.  **Clone o repositório do front-end:** (Este repositório)
2.  **Abra `index.html` em um navegador web.** O front-end carrega os dados automaticamente.

**IMPORTANTE:**  Certifique-se de que o endereço da sua API esteja corretamente configurado no arquivo `script.js` nas variáveis `ENDPOINT_CLIENTES_CPF` e `ENDPOINT_LISTA_CLIENTES`.  Substitua  `'https://academia-api-xi.vercel.app/clientes/'` pelo endereço da sua API em execução.


## API (Backend)

* Detalhes completos da API estão disponíveis em seu próprio repositório https://github.com/Matheus2614/Academia-API.git.  Abaixo estão os endpoints utilizados por este front-end:

### Endpoints Utilizados

* **`GET /clientes`**: Lista todos os clientes.  Exemplo de *request*: `GET https://sua-api.com/clientes`

    *Exemplo de *response* (código 200 OK):*

    ```json
    [
      {
        "id": 1,
        "nome": "Cliente 1",
        "nome_lower": "cliente 1",
        "cpf": "12345678901",
        "status": "ativo"
      },
      {
        "id": 2,
        "nome": "Cliente 2",
        "nome_lower": "cliente 2",
        "cpf": "98765432109",
        "status": "inativo"
      }
    ]
    ```

    *Exemplo de *response* (código 404 Not Found, caso não haja clientes):*

    ```json
    {
      "Mensagem": "Erro! Nenhum cliente encontrado."
    }
    ```


* **`POST /clientes`**: Cadastra um novo cliente. Exemplo de *request*: `POST https://sua-api.com/clientes`

    *Exemplo de *request body*: *

    ```json
    {
      "nome": "Novo Cliente",
      "cpf": "09876543210"
    }
    ```

    *Exemplo de *response* (código 201 Created):*

    ```json
    {
      "mensagem": "Cadastro concluído com sucesso!"
    }
    ```

* **`PUT /clientes/<id>`**: Atualiza as informações de um cliente. Exemplo de *request*: `PUT https://sua-api.com/clientes/1`

    *Exemplo de *request body*: *

    ```json
    {
      "nome": "Cliente 1 Atualizado",
      "cpf": "11223344556",
      "status": "inativo"
    }
    ```

    *Exemplo de *response* (código 200 OK):*

    ```json
    {
      "mensagem": "Cadastro alterado com sucesso!"
    }
    ```

* **`DELETE /clientes/<id>`**: Exclui um cliente. Exemplo de *request*: `DELETE https://sua-api.com/clientes/1`

    *Exemplo de *response* (código 200 OK):*

    ```json
    {
      "mensagem": "Cliente excluído(a) com sucesso!"
    }
    ```

* **`GET /clientes/id/<id>`**: Busca um cliente pelo seu ID. Exemplo de *request*: `GET https://sua-api.com/clientes/id/1`

    *Exemplo de *response* (código 200 OK):*

    ```json
    {
        "id": 1,
        "nome": "Cliente 1",
        "nome_lower": "cliente 1",
        "cpf": "12345678901",
        "status": "ativo"
    }
    ```


## Autores

- Richard - https://github.com/Richard15151 - richard.oliveira.senai@gmail.com
- Matheus - https://github.com/Matheus2614 - matheusf.wincler.senai@gmail.om


## Licença

Este projeto está licenciado sob a Licença MIT, verifique o arquivo LICENSE para mais informações