const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
	res.send('Servidor rodando corretamente');
});

app.listen(port, () => {
	console.log(`Servidor rodando em localhost:${port}`);
});
