const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/statsController');

/**
 * @swagger
 * /stats:
 *   get:
 *     summary: Estatísticas detalhadas das partidas ativas
 *     tags: [Stats]
 *     responses:
 *       200:
 *         description: Lista de partidas ativas com detalhes
 */
router.get('/', getStats);

module.exports = router;