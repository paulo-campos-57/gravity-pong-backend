require('../core/constants');

const VALID_DIRECTIONS = ['up', 'down', 'stop'];

function validateCreateGame(data) {
    if (!data || typeof data !== 'object') return 'Dados inválidos.';
    if (!data.playerName || typeof data.playerName !== 'string' || !data.playerName.trim()) {
        return 'Nome do jogador é obrigatório.';
    }
    if (data.maxScore !== undefined) {
        const ms = Number(data.maxScore);
        if (!Number.isInteger(ms) || ms < 1 || ms > 50) {
            return 'maxScore deve ser um inteiro entre 1 e 50.';
        }
    }
    return null;
}

function validateJoinGame(data) {
    if (!data || typeof data !== 'object') return 'Dados inválidos.';
    if (!data.playerName || typeof data.playerName !== 'string' || !data.playerName.trim()) {
        return 'Nome do jogador é obrigatório.';
    }
    if (!data.gameId || typeof data.gameId !== 'string') {
        return 'gameId é obrigatório.';
    }
    return null;
}

function validateMovePaddle(data) {
    if (!data || typeof data !== 'object') return 'Dados inválidos.';
    if (!data.gameId) return 'gameId é obrigatório.';
    if (!VALID_DIRECTIONS.includes(data.direction)) {
        return `direction inválido. Use: ${VALID_DIRECTIONS.join(', ')}`;
    }
    return null;
}

module.exports = { validateCreateGame, validateJoinGame, validateMovePaddle };