const express = require('express');
const router = express.Router();
const { getHealth, getRoot } = require('../controllers/healthController');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Verifica se o servidor está rodando
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Servidor online
 */
router.get('/', getRoot);

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Status de saúde do servidor
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Status ok com partidas ativas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 activeGames:
 *                   type: integer
 *                 games:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.get('/health', getHealth);

module.exports = router;