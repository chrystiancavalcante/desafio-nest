# Sistema de Cadastro de Usuários

Este é um sistema de cadastro de usuários desenvolvido utilizando NestJS e MongoDB, com funcionalidades de login, cadastro, recuperação de senha e uma página de home para listagem de usuários cadastrados.

## Instalação

### Clonar o repositório

```bash
git clone https://github.com/seu-usuario/desafio-nest.git
cd desafio-nest

Instalar Dependências

Após clonar o repositório, instale as dependências necessárias usando npm:


npm install

Configurar Variáveis de Ambiente
Renomeie o arquivo .env.example para .env e configure as variáveis necessárias, como a conexão com o banco de dados MongoDB.

Inicializar Servidor de Desenvolvimento
Para iniciar o servidor de desenvolvimento, utilize o seguinte comando:

npm run start:dev


O servidor será iniciado em http://localhost:3000 por padrão.

Rotas
Login:

POST /users/login: Realiza o login de um usuário.
Cadastro:

POST /users: Cadastra um novo usuário.
Home:

GET /users/home: Exibe a lista de usuários cadastrados.
Recuperar Senha:

POST /users/forgot-password: Envia um e-mail com instruções para recuperação de senha.
GET /users/reset-password/:token: Exibe o formulário para resetar a senha.

Busca por CEP:

GET /users/address/:zip: Retorna o endereço correspondente ao CEP informado.

Funcionamento

Design Pattern
O sistema utiliza o padrão de arquitetura MVC (Model-View-Controller) para separação clara de responsabilidades:

Model: Define a estrutura dos dados no MongoDB, como User.
View: Utiliza EJS para renderizar páginas HTML dinamicamente.
Controller: Gerencia as requisições HTTP, processa a lógica de negócio e retorna respostas.

## Funcionalidades

Login: Autenticação de usuários utilizando JWT (JSON Web Token).
Cadastro: Permite o cadastro de novos usuários com validações.
Home: Exibe uma lista de usuários cadastrados.
Recuperar Senha: Funcionalidade para recuperação de senha por e-mail.
Busca por CEP: Utiliza a API do ViaCEP para obter dados de endereço a partir do CEP informado.

## Validação

A validação dos dados é realizada tanto no frontend quanto no backend para garantir a integridade das informações inseridas pelos usuários:

Frontend: Validação de campos obrigatórios e formato de e-mail utilizando HTML5 e JavaScript.
Backend: Validação de dados recebidos nas requisições HTTP utilizando decorators do NestJS e bibliotecas como class-validator.

## Tecnologias Utilizadas

NestJS: Framework para construção de aplicativos Node.js escaláveis.
MongoDB: Banco de dados NoSQL para armazenamento de dados de usuários.
EJS: Engine de templates para renderização de páginas HTML.
