function notFound(req, res, next) {
    const error = new Error(`Rota não encontrada: ${req.originalUrl}`);
    res.status(404);
    next(error);
}

function errorHandler(err, _req, res, _next) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
}

module.exports = { notFound, errorHandler };