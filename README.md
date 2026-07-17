# Controle de Gastos Residenciais

Sistema full stack desenvolvido para controle de gastos residenciais, permitindo o cadastro de pessoas, o registro de receitas e despesas e a consulta de totais financeiros individuais e gerais.

O projeto foi construído com uma API em ASP.NET Core, persistência de dados com Entity Framework Core e SQLite, além de uma interface web em React com TypeScript.

## Funcionalidades

### Pessoas

- Cadastrar uma pessoa;
- Listar pessoas cadastradas;
- Excluir uma pessoa;
- Excluir automaticamente as transações relacionadas à pessoa removida.

### Transações

- Cadastrar receitas e despesas;
- Listar transações cadastradas;
- Vincular cada transação a uma pessoa existente;
- Validar descrição e valor;
- Impedir o cadastro de receitas para pessoas menores de 18 anos.

### Totais financeiros

- Exibir o total de receitas por pessoa;
- Exibir o total de despesas por pessoa;
- Calcular o saldo individual;
- Exibir o total geral de receitas;
- Exibir o total geral de despesas;
- Calcular o saldo geral.

## Regra de negócio principal

Pessoas menores de 18 anos podem cadastrar somente transações do tipo `Despesa`.

A validação é realizada no backend, garantindo a integridade da regra mesmo quando a API é chamada diretamente por ferramentas como REST Client ou Postman.

## Tecnologias utilizadas

### Backend

- C#;
- ASP.NET Core Web API;
- Entity Framework Core;
- SQLite;
- Migrations;
- Programação assíncrona com `async` e `await`;
- DTOs para entrada e saída de dados.

### Frontend

- React;
- TypeScript;
- Vite;
- Fetch API;
- CSS;
- ESLint.

### Ferramentas

- Visual Studio Code;
- REST Client;
- Git;
- GitHub.

## Estrutura do projeto

```text
ControleGastos/
├── Backend/
│   ├── Controllers/
│   ├── Data/
│   ├── DTOs/
│   ├── Migrations/
│   ├── Models/
│   ├── Properties/
│   ├── Services/
│   ├── Backend.csproj
│   ├── Backend.http
│   ├── Program.cs
│   ├── appsettings.json
│   └── appsettings.Development.json
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FormularioPessoa.tsx
│   │   │   ├── FormularioTransacao.tsx
│   │   │   ├── ListaPessoas.tsx
│   │   │   ├── ListaTransacoes.tsx
│   │   │   └── ResumoFinanceiro.tsx
│   │   ├── services/
│   │   │   ├── pessoaService.ts
│   │   │   ├── transacaoService.ts
│   │   │   └── totaisService.ts
│   │   ├── types/
│   │   │   ├── Pessoa.ts
│   │   │   ├── Transacao.ts
│   │   │   └── Totais.ts
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   ├── .env.example
│   ├── eslint.config.js
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## Como executar o projeto

### Pré-requisitos

Antes de iniciar, tenha instalado:

- .NET SDK;
- Node.js;
- npm;
- Git;
- ferramenta `dotnet-ef`.

Para instalar o `dotnet-ef`, caso ainda não esteja disponível:

```bash
dotnet tool install --global dotnet-ef
```

## Executando o backend

Abra um terminal na pasta do backend:

```bash
cd Backend
```

Restaure as dependências:

```bash
dotnet restore
```

Aplique as migrations para criar o banco SQLite:

```bash
dotnet ef database update
```

Execute a API:

```bash
dotnet run
```

O terminal exibirá o endereço da aplicação, por exemplo:

```text
http://localhost:5237
```

A porta pode variar de acordo com o ambiente.

## Configurando o frontend

Entre na pasta do frontend:

```bash
cd Frontend
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo chamado `.env` com base no `.env.example`.

Exemplo:

```env
VITE_API_URL=http://localhost:5237
```

Utilize exatamente o endereço informado pelo `dotnet run`.

Depois execute:

```bash
npm run dev
```

O frontend normalmente será iniciado em:

```text
http://localhost:5173
```

Mantenha backend e frontend executando em terminais separados.

## Endpoints da API

### Pessoas

#### Listar pessoas

```http
GET /api/pessoas
```

#### Cadastrar pessoa

```http
POST /api/pessoas
Content-Type: application/json
```

Exemplo:

```json
{
  "nome": "Carlos",
  "idade": 25
}
```

#### Excluir pessoa

```http
DELETE /api/pessoas/{id}
```

A exclusão remove também as transações vinculadas à pessoa.

### Transações

#### Listar transações

```http
GET /api/transacoes
```

#### Cadastrar transação

```http
POST /api/transacoes
Content-Type: application/json
```

Exemplo de receita:

```json
{
  "descricao": "Salário",
  "valor": 3500,
  "tipo": 0,
  "pessoaId": 1
}
```

Exemplo de despesa:

```json
{
  "descricao": "Conta de energia",
  "valor": 180.50,
  "tipo": 1,
  "pessoaId": 1
}
```

Valores de `tipo`:

```text
0 = Receita
1 = Despesa
```

### Totais

#### Consultar totais

```http
GET /api/totais
```

Exemplo de resposta:

```json
{
  "pessoas": [
    {
      "pessoaId": 1,
      "nome": "Carlos",
      "totalReceitas": 3500,
      "totalDespesas": 180.5,
      "saldo": 3319.5
    }
  ],
  "totalGeral": {
    "totalReceitas": 3500,
    "totalDespesas": 180.5,
    "saldo": 3319.5
  }
}
```

## Validações implementadas

### Pessoas

- Nome obrigatório;
- Nome composto apenas por espaços não é aceito;
- Idade não pode ser negativa;
- Idade deve ser um número inteiro.

### Transações

- Descrição obrigatória;
- Valor deve ser maior que zero;
- Tipo deve ser `Receita` ou `Despesa`;
- A pessoa informada deve existir;
- Menores de 18 anos não podem cadastrar receitas.

As validações existem tanto no frontend quanto no backend. O frontend melhora a experiência do usuário, enquanto o backend protege efetivamente os dados e as regras do sistema.

## Organização do frontend

O frontend foi separado em componentes com responsabilidades específicas:

- `FormularioPessoa`: cadastro de pessoas;
- `ListaPessoas`: listagem e exclusão de pessoas;
- `FormularioTransacao`: cadastro de receitas e despesas;
- `ListaTransacoes`: exibição das transações;
- `ResumoFinanceiro`: apresentação dos totais gerais e individuais.

O arquivo `App.tsx` é responsável por coordenar o carregamento dos dados e distribuir as informações para os componentes.

## Organização do backend

O backend utiliza:

- Models para representar as entidades;
- DTOs para controlar os dados recebidos e retornados;
- Controllers para disponibilizar os endpoints;
- Entity Framework Core para persistência;
- SQLite como banco de dados;
- Migrations para criação e atualização da estrutura do banco;
- Operações assíncronas para acesso ao banco de dados.

## Comandos de verificação

### Frontend

Executar análise do ESLint:

```bash
npm run lint
```

Gerar a versão de produção:

```bash
npm run build
```

### Backend

Compilar o projeto:

```bash
dotnet build
```

Listar migrations:

```bash
dotnet ef migrations list
```

Atualizar o banco:

```bash
dotnet ef database update
```

## Uso de inteligência artificial

Ferramentas de inteligência artificial foram utilizadas como apoio para esclarecimento de dúvidas técnicas, revisão de código e estudo de boas práticas.

Todas as implementações foram analisadas, adaptadas ao contexto do projeto, testadas e compreendidas durante o desenvolvimento.

## Contato

Desenvolvido por [João Pedro](https://github.com/Joao-Pedro-Duo) Para dúvidas, sugestões ou colaborações, entre em contato via GitHub ou abra uma issue!
