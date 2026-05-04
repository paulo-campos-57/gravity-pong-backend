# gravity-pong-backend
Repositório destinado ao backend do jogo Gravity Pong

## Rodando o projeto
### 1. Criação do .env
Crie um arquivo .env na pasta raiz do projeto. Dentro dele, insira:
```bash
NODE_ENV=development

PORT=3000

ALLOWED_ORIGINS=http://localhost:5173,https://frontend-pong.vercel.app
```

### 2. Instalação de dependências
Instale as dependências do projeto:
```bash
npm install
```

### 3. Rodar o lint
Rode o lint do projeto com o comando:
```bash
npm run lint # só rodar o lint

npm run lint:fix # rodar lint e corrigir os erros
```

### 4. Rodar o servidor
Rode o servidor dom o comando:
```bash
npm run dev
```
O servidor estará online em localhost:3000
