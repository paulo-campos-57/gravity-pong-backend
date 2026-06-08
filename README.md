<div align="center">
  <h1>
    <img src="https://skillicons.dev/icons?i=nodejs,express,jest" /><br>
    Back-End — Gravity Pong 🇺🇸
  </h1>
  <p>
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=flat&logo=socketdotio&logoColor=white" />
    <img src="https://img.shields.io/badge/Jest-29.x-C21325?style=flat&logo=jest&logoColor=white" />
    <img src="https://img.shields.io/badge/ESLint-enabled-4B32C3?style=flat&logo=eslint&logoColor=white" />
  </p>
</div>


## Project Structure

```
gravity-pong-backend/
├── src/
│   ├── config/             # Configuration (CORS, Swagger)
│   ├── controllers/        # REST API handlers
│   ├── core/               # Game Engine & Physics
│   │   ├── ball.js         # Gravitational physics and collisions
│   │   ├── bot.js          # CPU Artificial Intelligence (Arcade Tower)
│   │   ├── constants.js    # Global physics variables
│   │   ├── gameLoop.js     # 60Hz Server Tick Loop
│   │   └── paddle.js       # Player movement logic
│   ├── middlewares/        # Payload validation and error handling
│   ├── routes/             # REST API endpoints
│   ├── services/           # Socket and Game state management
│   │   ├── gameManager.js  # Matches and Lobby logic
│   │   └── socketService.js# WebSocket event listeners
│   ├── app.js              # Express app factory
│   └── server.js           # Entry point
├── tests/                  # Unit tests (Jest)
│   ├── ball.test.js
│   └── bot.test.js
├── package.json            # Dependencies and scripts
└── README.md
```

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20.x | JavaScript runtime |
| [Express](https://expressjs.com/) | 5.x | REST API Framework |
| [Socket.IO](https://socket.io/) | 4.x | Real-time bidirectional communication |
| [Jest](https://jestjs.io/) | 29.x | Unit testing framework |
| [Swagger](https://swagger.io/) | 6.x | API Documentation |
| [Nodemon](https://nodemon.io/) | 3.x | Development auto-reload |

---

## Requirements

- **Node.js** 20.x or higher
- **npm** (Node Package Manager)

---

## How to Run

### <img src="https://skillicons.dev/icons?i=github" height="20" style="vertical-align: middle;" /> 1. Clone the repository

```bash
git clone https://github.com/paulo-campos-57/gravity-pong-backend.git
cd gravity-pong-backend
```

### 📦 2. Install dependencies

```bash
npm install
```

### ▶️ 3. Start the server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will be running at **http://localhost:3000**.<br>
API Documentation (Swagger) is available at **http://localhost:3000/api-docs**.

---

## Running Tests

```bash
# Run the Jest test suite
npm run test
```

---

## WebSocket Events (Socket.IO)

| Event | Direction | Payload / Description |
|---|---|---|
| `create_game` | Client → Server | `{ playerName, maxScore }` |
| `create_single_player` | Client → Server | `{ playerName, maxScore, stage }` — Spawns a CPU Bot |
| `join_game` | Client → Server | `{ playerName, gameId }` |
| `move_paddle` | Client → Server | `{ gameId, direction }` — `'up'`, `'down'`, `'stop'` |
| `game_state` | Server → Client | 60Hz update with ball, paddles, and scores |

---

<br>

---

<div align="center">
  <h1>
    <img src="https://skillicons.dev/icons?i=nodejs,express,jest" /><br>
    Back-End — Gravity Pong 🇧🇷
  </h1>
  <p>
    <img src="https://img.shields.io/badge/Node.js-20.x-339933?style=flat&logo=nodedotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Express-5.x-000000?style=flat&logo=express&logoColor=white" />
    <img src="https://img.shields.io/badge/Socket.io-4.x-010101?style=flat&logo=socketdotio&logoColor=white" />
    <img src="https://img.shields.io/badge/Jest-29.x-C21325?style=flat&logo=jest&logoColor=white" />
    <img src="https://img.shields.io/badge/ESLint-enabled-4B32C3?style=flat&logo=eslint&logoColor=white" />
  </p>
</div>


## Estrutura do Projeto

```
gravity-pong-backend/
├── src/
│   ├── config/             # Configurações (CORS, Swagger)
│   ├── controllers/        # Manipuladores da API REST
│   ├── core/               # Motor do Jogo & Física
│   │   ├── ball.js         # Física gravitacional e colisões
│   │   ├── bot.js          # IA da CPU (Torre Arcade)
│   │   ├── constants.js    # Variáveis globais de física
│   │   ├── gameLoop.js     # Loop de atualização do servidor (60Hz)
│   │   └── paddle.js       # Lógica de movimento
│   ├── middlewares/        # Validação de dados e tratamento de erros
│   ├── routes/             # Endpoints da API REST
│   ├── services/           # Gerenciamento de estado e Sockets
│   │   ├── gameManager.js  # Lógica de criação de salas e lobby
│   │   └── socketService.js# Eventos do WebSocket
│   ├── app.js              # Configuração do Express
│   └── server.js           # Ponto de entrada
├── tests/                  # Testes Unitários (Jest)
│   ├── ball.test.js
│   └── bot.test.js
├── package.json            # Dependências e scripts
└── README.md
```

---

## Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| [Node.js](https://nodejs.org/) | 20.x | Ambiente de execução JavaScript |
| [Express](https://expressjs.com/) | 5.x | Framework para API REST |
| [Socket.IO](https://socket.io/) | 4.x | Comunicação bidirecional em tempo real |
| [Jest](https://jestjs.io/) | 29.x | Framework de testes unitários |
| [Swagger](https://swagger.io/) | 6.x | Documentação da API |
| [Nodemon](https://nodemon.io/) | 3.x | Auto-reload em ambiente de desenvolvimento |

---

## Requisitos

- **Node.js** 20.x ou superior
- **npm** (Node Package Manager)

---

## Como Executar

### <img src="https://skillicons.dev/icons?i=github" height="20" style="vertical-align: middle;" /> 1. Clone o repositório

```bash
git clone https://github.com/paulo-campos-57/gravity-pong-backend.git
cd gravity-pong-backend
```

### 📦 2. Instale as dependências

```bash
npm install
```

### ▶️ 3. Inicie o servidor

```bash
# Modo de desenvolvimento (reinicia ao salvar arquivos)
npm run dev

# Modo de produção
npm start
```

O servidor estará rodando em **http://localhost:3000**.<br>
A documentação da API (Swagger) estará disponível em **http://localhost:3000/api-docs**.

---

## Rodando os Testes

```bash
# Executa a suíte de testes do Jest
npm run test
```

---

## Eventos de WebSocket (Socket.IO)

| Evento | Direção | Carga (Payload) / Descrição |
|---|---|---|
| `create_game` | Cliente → Servidor | `{ playerName, maxScore }` |
| `create_single_player` | Cliente → Servidor | `{ playerName, maxScore, stage }` — Cria um bot da CPU |
| `join_game` | Cliente → Servidor | `{ playerName, gameId }` |
| `move_paddle` | Cliente → Servidor | `{ gameId, direction }` — `'up'`, `'down'`, `'stop'` |
| `game_state` | Servidor → Cliente | Atualização a 60Hz com bola, raquetes e placar |
